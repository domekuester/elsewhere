import {addSky} from './sky.js?v=db93fa129bd5';
import * as THREE from 'three';
import {RectAreaLightUniformsLib} from 'three/addons/lights/RectAreaLightUniformsLib.js';

// Warm afternoon lighting is an artistic presentation, not a measured sun study.
// Window positions and the existing bedside lamp are retained.
export function addDaylight(scene){
 RectAreaLightUniformsLib.init();
 scene.background=new THREE.Color('#b5d3e5');
 scene.fog=new THREE.Fog('#d7e4e8',24,55);
 addSky(scene);
 scene.add(new THREE.HemisphereLight('#c7e3f4','#c5a17c',.34));
 const sun=new THREE.DirectionalLight('#ffd4a0',3.15);
 sun.position.set(7,4.8,3.6);sun.target.position.set(0,0,-.4);sun.castShadow=true;
 sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-6,right:6,top:6,bottom:-6,near:.5,far:24});
 sun.shadow.normalBias=.008;sun.shadow.bias=-.00015;sun.shadow.radius=4.0;
 scene.add(sun,sun.target);
 for(const [z,y,width,height,strength] of [[-.92,1.18,1.65,1.95,3.7],[1.22,1.58,1.55,1.0,4.1]]){
  const light=new THREE.RectAreaLight('#fff0db',strength,width,height);
  light.position.set(1.70,y,z);light.lookAt(-1.5,y-.25,z+.2);scene.add(light);
 }
 // Approximate warm diffuse bounce from the timber floor, deliberately low energy.
 const bounce=new THREE.RectAreaLight('#ffd8ad',.8,2.6,3.3);
 bounce.position.set(0,.08,-.3);bounce.lookAt(0,2,-.3);scene.add(bounce);
 const loftFill=new THREE.RectAreaLight('#ffe4c5',1.45,1.8,1.4);
 loftFill.position.set(.3,3.75,.48);loftFill.lookAt(0,2.3,1.7);scene.add(loftFill);
 // Light from the already modeled bedside lamp; no extra shadow cubemap.
 const bedside=new THREE.PointLight('#ffc084',.85,2.1,2);
 bedside.position.set(1.15,3.28,2.02);scene.add(bedside);
 return sun;
}

function fabricMaps(){
 const canvas=document.createElement('canvas');canvas.width=canvas.height=256;
 const ctx=canvas.getContext('2d');const data=ctx.createImageData(256,256);
 let seed=713;const rand=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 for(let y=0;y<256;y++)for(let x=0;x<256;x++){
  const i=(y*256+x)*4,thread=((x%4<2)===(y%4<2))?9:-7;
  const value=235+thread+(rand()-.5)*14;
  data.data.set([value,value,value,255],i);
 }
 ctx.putImageData(data,0,0);
 const weave=new THREE.CanvasTexture(canvas);weave.wrapS=weave.wrapT=THREE.RepeatWrapping;weave.repeat.set(5,5);weave.colorSpace=THREE.SRGBColorSpace;
 const bump=weave.clone();bump.colorSpace=THREE.NoColorSpace;
 const checkCanvas=document.createElement('canvas');checkCanvas.width=checkCanvas.height=256;const check=checkCanvas.getContext('2d');
 check.fillStyle='#d9dfdb';check.fillRect(0,0,256,256);
 for(let x=0;x<256;x+=16){check.fillStyle='#768e946b';check.fillRect(x,0,8,256);check.fillRect(0,x,256,8);}
 const checkMap=new THREE.CanvasTexture(checkCanvas);checkMap.colorSpace=THREE.SRGBColorSpace;checkMap.wrapS=checkMap.wrapT=THREE.RepeatWrapping;
 return {weave,bump,checkMap};
}

export function refineSurfaces(root,renderer){
 const {weave,bump,checkMap}=fabricMaps();const replacements=new Map();const maxAniso=Math.min(8,renderer.capabilities.getMaxAnisotropy());
 root.traverse(o=>{
  if(!o.isMesh)return;const old=o.material;
  if(replacements.has(old)){o.material=replacements.get(old);return;}
  const name=old.name.toLowerCase();let m=old;
  if(name.includes('fabric')){
   m=new THREE.MeshPhysicalMaterial({name:old.name,color:old.color,vertexColors:old.vertexColors,map:name.includes('check')?checkMap:weave,roughness:.96,metalness:0,bumpMap:bump,bumpScale:.0007,side:THREE.DoubleSide,sheen:.55,sheenRoughness:.88,sheenColor:new THREE.Color('#b8beb7'),envMapIntensity:.38});
   if(name.includes('check'))m.color.set('#ffffff');
   if(name.includes('sage')&&!name.includes('check'))m.color.set('#8e9c99');
   if(name.includes('warm grey'))m.color.set('#51565a');
   if(name.includes('white cotton'))m.color.set('#deded8');
   if(name.includes('linen'))m.color.set('#b9ad98');
  }
  if(/oak|wood/.test(name)&&!name.includes('scanned')){
   m.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',THREE.ShaderChunk.map_fragment.replace('diffuseColor *= sampledDiffuseColor;',`float grain=dot(sampledDiffuseColor.rgb,vec3(.2126,.7152,.0722));
   sampledDiffuseColor.rgb=vec3(mix(.65,1.12,smoothstep(.003,.12,grain)));
   diffuseColor *= sampledDiffuseColor;`));};
   m.customProgramCacheKey=()=> 'natural-timber-v3';
   m.color.set(name.includes('dark')?'#90795b':name.includes('light')?'#d1b58f':'#b29b78');m.roughness=.82;m.roughnessMap=null;m.normalScale?.set(.10,.10);m.envMapIntensity=.30;
  }
  if(name.includes('scanned timber')){m.color.set('#a99d8d');m.normalScale?.set(.14,.14);m.roughness=.80;m.roughnessMap=null;}
  if(name.includes('plaster')||name.includes('paint ivory')){m.color.set(name.includes('plaster')?'#d4d0c6':'#dfddd5');m.roughness=.94;}
  if(name.includes('brushed steel')){m.roughness=.29;m.envMapIntensity=1.1;}
  if(name.includes('lampshade')){m.emissive.set('#ffc58a');m.emissiveIntensity=.30;m.roughness=.96;}
  if(name.includes('plant')){m.color.set(name.includes('light')?'#789451':'#476a37');m.roughness=.86;m.emissive.set('#243a16');m.emissiveIntensity=.08;}
  if(name.includes('gravel')){m.color.set('#b9bcba');m.normalScale?.set(.65,.65);}
  if(name.includes('molded stool')){m.roughness=.64;m.bumpMap=bump;m.bumpScale=.00035;}
  for(const key of ['map','normalMap','roughnessMap','bumpMap'])if(m[key])m[key].anisotropy=maxAniso;
  m.needsUpdate=true;replacements.set(old,m);o.material=m;
 });
}
