import * as THREE from 'three';

// Material response only: retain the photographed texture scans and baked
// vertex occlusion exported by Blender. Timber tonality is matched to the light pine in the references.
function makeDetailMaps(){
 const size=256,canvas=document.createElement('canvas');canvas.width=canvas.height=size;
 const ctx=canvas.getContext('2d'),pixels=ctx.createImageData(size,size);
 let seed=713;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  // Low-amplitude mineral irregularity, not a repeating fabric pattern.
  const value=Math.round(128+(random()-.5)*22);
  pixels.data.set([value,value,value,255],(y*size+x)*4);
 }
 ctx.putImageData(pixels,0,0);
 const plaster=new THREE.CanvasTexture(canvas);
 plaster.wrapS=plaster.wrapT=THREE.RepeatWrapping;plaster.repeat.set(4,4);
 plaster.colorSpace=THREE.NoColorSpace;
 const checks=document.createElement('canvas');checks.width=checks.height=size;
 const paint=checks.getContext('2d');paint.fillStyle='#d9dfdb';paint.fillRect(0,0,size,size);
 for(let x=0;x<size;x+=16){paint.fillStyle='#768e946b';paint.fillRect(x,0,8,size);paint.fillRect(0,x,size,8);}
 const check=new THREE.CanvasTexture(checks);check.colorSpace=THREE.SRGBColorSpace;
 check.wrapS=check.wrapT=THREE.RepeatWrapping;
 return {plaster,check};
}

// Short, irregular crossing fibres avoid continuous stripes. With the model's
// .42–.60 m fabric UV tiles, a texel is roughly 1.6–2.3 mm; mipmaps soften it
// naturally with distance. This is a neutral linear multiplier, not a new dye.
function makeFineWeave(){
 const size=256,canvas=document.createElement('canvas');canvas.width=canvas.height=size;
 const ctx=canvas.getContext('2d'),pixels=ctx.createImageData(size,size),noise=new Float32Array(size*size);
 let seed=90217,sum=0;
 for(let i=0;i<noise.length;i++){seed=(seed*1664525+1013904223)>>>0;noise[i]=seed/4294967296*2-1;}
 const at=(x,y)=>noise[(y&255)*size+(x&255)];
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const warp=(at(x,y-2)+2*at(x,y-1)+2*at(x,y)+2*at(x,y+1)+at(x,y+2))/8;
  const weft=(at(x-2,y)+2*at(x-1,y)+2*at(x,y)+2*at(x+1,y)+at(x+2,y))/8;
  const value=Math.round(128+((x+y)%2 ? 10*warp+3*weft : 10*weft+3*warp)+2*at(x,y));
  pixels.data.set([value,value,value,255],(y*size+x)*4);sum+=value;
 }
 ctx.putImageData(pixels,0,0);
 const map=new THREE.CanvasTexture(canvas);map.name='Fine neutral fabric weave';
 map.colorSpace=THREE.NoColorSpace;map.wrapS=map.wrapT=THREE.RepeatWrapping;
 map.minFilter=THREE.LinearMipmapLinearFilter;map.magFilter=THREE.LinearFilter;map.generateMipmaps=true;
 return {map,gain:255/(sum/(size*size))};
}

function upholstery(old,details){
 // Curtains use the same scan as upholstery, but their finer cloth should not
 // exaggerate its large stitched seam or brighten every window-facing fold.
 const curtain=old.name.toLowerCase().includes('curtain');
 const material=new THREE.MeshPhysicalMaterial({
  name:old.name,color:old.color.clone(),map:old.map,
  normalMap:old.normalMap,normalScale:old.normalScale.clone(),normalMapType:old.normalMapType,
  roughnessMap:old.roughnessMap,roughness:1,metalness:0,
  aoMap:old.aoMap,aoMapIntensity:old.aoMapIntensity,
  bumpMap:old.bumpMap,bumpScale:old.bumpScale,
  alphaMap:old.alphaMap,opacity:old.opacity,transparent:old.transparent,alphaTest:old.alphaTest,
  vertexColors:old.vertexColors,side:old.side,depthWrite:old.depthWrite,
  sheen:curtain ? .07 : .10,sheenRoughness:.95,sheenColor:old.color.clone().lerp(new THREE.Color('#eee8da'),.25),
  specularIntensity:curtain ? .24 : .42,envMapIntensity:.30,dithering:true
 });
 // The checked cushion is visible in the source photographs; its colour
 // pattern supplements the retained scan normal/roughness channels.
 let weaveGain=null;
 if(!old.map){
  if(old.name.toLowerCase().includes('check')){material.map=details.check;material.color.set('#ffffff');}
  else{
   details.weave??=makeFineWeave();material.map=details.weave.map;weaveGain=details.weave.gain;
  }
 }
 material.normalScale.multiplyScalar(curtain ? .30 : .85);
 // Scan roughness must not turn matte cotton into varnish under a broad window.
 material.onBeforeCompile=shader=>{
  shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>',
   '#include <roughnessmap_fragment>\n roughnessFactor = clamp(roughnessFactor, .88, .98);');
  if(weaveGain!==null)shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',
   THREE.ShaderChunk.map_fragment.replace('diffuseColor *= sampledDiffuseColor;',
    'sampledDiffuseColor.rgb *= '+weaveGain.toFixed(8)+';\n diffuseColor *= sampledDiffuseColor;'));
 };
 material.customProgramCacheKey=()=> weaveGain===null ? 'reference-woven-matte-v1' : 'reference-woven-fibres-v1';
 return material;
}

export function refineSurfaces(root,renderer){
 const details=makeDetailMaps(),replacements=new Map();
 const anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
 function refine(old){
  if(replacements.has(old))return replacements.get(old);
  const name=old.name.toLowerCase();let material=old;
  if(name.includes('fabric'))material=upholstery(old,details);
  if(/oak|wood/.test(name)&&!name.includes('scanned')){
   // Keep the source RGB variation. A gentler lift retains more of the grain;
   // the pale tint compensates without flattening it into uniform beige.
   const countertop=name.includes('laminate'),cabinet=name.includes('cabinet'),cane=name.includes('cane');
   const tint=cane?'#c79c64':countertop?'#c9b08e':cabinet?'#d9c6aa':name.includes('dark')?'#a68c6d':name.includes('light')?'#e1cfb0':'#cfb897';
   const limits=countertop?'.58, .82':cabinet?'.65, .90':'.70, .94';
   material.color.set(tint);
   material.roughness=1;material.metalness=0;material.normalScale?.multiplyScalar(cane ? .22 : (countertop||cabinet) ? .45 : .65);material.envMapIntensity=countertop ? .45 : .30;
   material.onBeforeCompile=shader=>{
    shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',THREE.ShaderChunk.map_fragment.replace('diffuseColor *= sampledDiffuseColor;',
     'sampledDiffuseColor.rgb = pow(max(sampledDiffuseColor.rgb, vec3(0.0)), vec3(.34));\n diffuseColor *= sampledDiffuseColor;'));
    shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>',
     '#include <roughnessmap_fragment>\n roughnessFactor = clamp(roughnessFactor, '+limits+');');
   };
   material.customProgramCacheKey=()=> 'reference-timber-rgb-v2-'+limits;
  }
  if(name.includes('scanned timber')){
   // The separate floor scan already carries the appropriate board colours.
   material.color.set('#ffffff');material.roughness=.94;material.normalScale?.multiplyScalar(.65);material.envMapIntensity=.38;
  }
  if(name.includes('plaster')||name.includes('paint ivory')){
   material.color.set(name.includes('plaster')?'#d9d7cf':'#e7e4dc');
   material.roughness=.92;
   if(!material.normalMap&&!material.bumpMap){material.bumpMap=details.plaster;material.bumpScale=.0012;}
  }
  if(name.includes('ceramic')){material.roughness=.32;material.envMapIntensity=.65;}
  if(name.includes('painted sage')){material.roughness=.60;material.envMapIntensity=.42;}
  if(name.includes('brushed steel')){material.roughness=.34;material.envMapIntensity=.9;}
  if(name.includes('refrigerator satin')||name.includes('appliance brushed')){
   material.color.set('#a2a6a7');material.metalness=.65;material.roughness=.47;material.envMapIntensity=.75;
  }
  if(name.includes('sink graphite')){
   material.color.set('#242829');material.metalness=0;material.roughness=.64;material.envMapIntensity=.45;
  }
  if(name.includes('lampshade')){
   material.emissive.set('#ffcf98');material.emissiveIntensity=.20;material.roughness=.96;
  }
  if(name.includes('plant')){
   material.roughness=.78;material.envMapIntensity=.25;
   material.color.set(name.includes('light')?'#79894a':'#426338');
   // A very small transmitted-light approximation, with no artificial glow.
   material.emissive.set('#203815');material.emissiveIntensity=.025;
  }
  if(name.includes('gravel')){material.color.set('#e6e5df');material.roughness=1;material.normalScale?.set(.65,.65);}
  if(name.includes('molded stool')){material.roughness=.64;material.envMapIntensity=.35;}
  for(const key of ['map','normalMap','roughnessMap','metalnessMap','bumpMap','aoMap'])if(material[key])material[key].anisotropy=anisotropy;
  material.dithering=true;material.needsUpdate=true;replacements.set(old,material);
  return material;
 }
 root.traverse(object=>{if(object.isMesh)object.material=Array.isArray(object.material)?object.material.map(refine):refine(object.material);});
}
