import {FrameLoop} from './frame-loop.js?v=4e2b53370ad5';
import {TourGestures,PhotoSwipe} from './touch-controls.js?v=4e2b53370ad5';
import {copy} from './copy.js?v=4e2b53370ad5';
import {initialLanguage,rememberLanguage,bookingUrl,isLanguage} from './i18n.js?v=4e2b53370ad5';
import {advanceWalking} from './motion.js?v=4e2b53370ad5';
import {addDaylight,refineSurfaces} from './atmosphere.js?v=4e2b53370ad5';
import {setupExperience,isExploring,tourReady,tourFailed,translateExperience} from './experience.js?v=4e2b53370ad5';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import { spots,movePosition } from './navigation.js?v=4e2b53370ad5';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let language=initialLanguage(),currentRoom='living',level='ground',ready=false,changing=false,photoIndex=0,infoMode='about';
const roomKeys=Object.keys(spots);
const photoFiles=['living-new','kitchen-new','terrace','beach','bedroom-new','living-reverse-new','lagoon','terrace-facade','bathroom-washbasin-toilet','bathroom-shower','sofa-detail','terrace-seating-wide','terrace-under-roof','bedroom-lamp','sunset-etang-sale-sdr','water-and-green-hills-sdr','sunset-clouds-etang-sale','boats-evening-etang-sale','pink-flowers-etang-sale'];
function t(key){return copy[language][key];}
function updateRoomUI(){
 const idx=roomKeys.indexOf(currentRoom);
 $('#room-title').textContent=t('roomTitles')[idx];$('#room-description').textContent=t('roomDescriptions')[idx];
 $('#room-announcement').textContent=t('roomTitles')[idx];
 $('#room-level').textContent=t(currentRoom==='bedroom'?'loft':currentRoom==='terrace'?'outside':'ground');
 $$('[data-room]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.room===currentRoom)));
}
function translate(){
 document.documentElement.lang=language;
 $$('[data-i18n]').forEach(e=>e.textContent=t(e.dataset.i18n));
 $$('[data-i18n-title]').forEach(e=>e.title=t(e.dataset.i18nTitle));
 document.title=t('pageTitle');
 document.querySelector('meta[name="description"]').content=t('pageDescription');
 document.querySelector('meta[property="og:title"]').content=t('pageTitle');
 document.querySelector('meta[property="og:description"]').content=t('pageDescription');
 document.querySelector('meta[property="og:image:alt"]').content=t('heroAlt');
 $$('.language-select').forEach(select=>{select.value=language;select.ariaLabel=t('chooseLanguage');});
 $$('[data-language-current]').forEach(label=>label.textContent=language.toUpperCase());
 $('.book').href=bookingUrl(language);
 $$('[data-move]').forEach(b=>b.ariaLabel=t('directions')[b.dataset.move]);
 $$('.close').forEach(b=>b.ariaLabel=t('close'));
 $('#joystick').ariaLabel=t('joystickLabel');$('#joystick').title=t('joystickLabel');
 $('#fullscreen').ariaLabel=$('#fullscreen').title=t('fullscreen');
 $('#help').ariaLabel=t('help');
 $('#prev-photo').ariaLabel=t('previousPhoto');$('#next-photo').ariaLabel=t('nextPhoto');
 $('#map').setAttribute('aria-label',t('positionLabel'));
 updateRoomUI();showPhoto(photoIndex);if($('#information').open)fillInfo();translateExperience();
}
let toastTimer;
function toast(text){clearTimeout(toastTimer);$('#toast').textContent=text;$('#toast').hidden=false;toastTimer=setTimeout(()=>$('#toast').hidden=true,4300);}
function changeLanguage(next){if(!isLanguage(next)||next===language)return;releaseInput();language=next;rememberLanguage(next);translate();}
$$('.language-select').forEach(select=>select.addEventListener('change',event=>changeLanguage(event.target.value)));
function revealPhotoThumb(){
 const strip=$('#photo-thumbs'),active=strip.children[photoIndex];
 if(!active||!$('#gallery').open)return;
 const left=active.offsetLeft-strip.offsetLeft,right=left+active.offsetWidth;
 if(left<strip.scrollLeft)strip.scrollLeft=left;
 else if(right>strip.scrollLeft+strip.clientWidth)strip.scrollLeft=right-strip.clientWidth;
}
function showPhoto(i){
 photoIndex=(i+photoFiles.length)%photoFiles.length;
 $('#gallery-image').src=`./photos/${photoFiles[photoIndex]}.jpg`;$('#gallery-image').alt=t('photoNames')[photoIndex];$('#photo-caption').textContent=t('photoNames')[photoIndex];$('#photo-counter').textContent=`${photoIndex+1} / ${photoFiles.length}`;
 $$('#photo-thumbs button').forEach((b,j)=>{b.setAttribute('aria-pressed',String(j===photoIndex));b.ariaLabel=t('photoNames')[j];});
 revealPhotoThumb();
}
photoFiles.forEach((name,i)=>{const b=document.createElement('button');b.innerHTML=`<img src="./photos/thumbs/${name}.jpg" width="96" height="64" alt="" loading="lazy" decoding="async">`;b.addEventListener('click',()=>showPhoto(i));$('#photo-thumbs').appendChild(b);});
function gallery(index){releaseInput();showPhoto(Number.isInteger(index)?index:photoIndex);$('#gallery').showModal();revealPhotoThumb();}
const photoSwipe=new PhotoSwipe(),photoImage=$('#gallery-image');
photoImage.addEventListener('touchstart',e=>photoSwipe.begin(e.touches),{passive:true});
photoImage.addEventListener('touchend',e=>{const direction=photoSwipe.end(e.changedTouches);if(direction&&(!window.visualViewport||window.visualViewport.scale<=1))showPhoto(photoIndex+direction);},{passive:true});
photoImage.addEventListener('touchcancel',()=>photoSwipe.cancel(),{passive:true});
$('#gallery').addEventListener('close',()=>photoSwipe.cancel());
$('#photos').addEventListener('click',gallery);$('#fallback-photos').addEventListener('click',gallery);
$('#prev-photo').addEventListener('click',()=>showPhoto(photoIndex-1));$('#next-photo').addEventListener('click',()=>showPhoto(photoIndex+1));
$('#gallery').addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();showPhoto(photoIndex+1);}if(e.key==='ArrowLeft'){e.preventDefault();showPhoto(photoIndex-1);}});
$$('[data-close]').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.close).close()));
$$('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}}));
function fillInfo(){$('#info-title').textContent=t(infoMode+'Title');$('#info-body').innerHTML=t(infoMode+'Body');}
function openInfo(mode){releaseInput();infoMode=mode;fillInfo();$('#information').showModal();}
$('#about').addEventListener('click',()=>openInfo('about'));$('#help').addEventListener('click',()=>openInfo('help'));
$('#map-toggle').addEventListener('click',()=>{const open=$('#map-content').hidden;$('#map-content').hidden=!open;$('#map-toggle').setAttribute('aria-expanded',String(open));$('#map-toggle svg').style.transform=open?'rotate(180deg)':'rotate(0deg)';});
$('#retry').addEventListener('click',()=>location.reload());
$('#fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if($('#tour').requestFullscreen)await $('#tour').requestFullscreen();else toast(t('fullscreenFail'));}catch{toast(t('fullscreenFail'));}});
// Locally generated small surface maps. No remote texture or CDN requests.
let seed=493;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
let renderer,scene,camera,composer,aoPass,fxaaPass,yaw=0,pitch=0,lastRenderedPose='';const keys=new Set();const gestures=new TourGestures();let padMove=null,last=performance.now();let walking={forward:0,side:0};const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
function updateStick(){const {x,y}=gestures.offset;$('#stick-knob').style.transform=`translate(${x}px,${y}px)`;$('#joystick').classList.toggle('held',gestures.movePointer!==null);}
function releaseInput(){
 const lookId=gestures.lookPointer,moveId=gestures.movePointer;
 gestures.reset();walking={forward:0,side:0};keys.clear();padMove=null;updateStick();
 for(const [element,id] of [[$('#view'),lookId],[$('#joystick'),moveId]])if(id!==null&&element.hasPointerCapture(id))element.releasePointerCapture(id);
 $$('[data-move]').forEach(b=>b.classList.remove('held'));
} 
function setPose(spot){
 camera.position.fromArray(spot.position);const d=new THREE.Vector3().fromArray(spot.target).sub(camera.position).normalize();yaw=Math.atan2(-d.x,-d.z);pitch=Math.asin(d.y);camera.rotation.set(pitch,yaw,0,'YXZ');
}
async function goToRoom(name,instant=false){
 if(!ready||changing)return;releaseInput();changing=true;
 if(!instant){$('#transition').classList.add('active');await new Promise(r=>setTimeout(r,matchMedia('(prefers-reduced-motion: reduce)').matches?0:180));}
 currentRoom=name;level=name==='bedroom'?'loft':'ground';setPose(spots[name]);updateRoomUI();$('#stair-action').hidden=true;
 $('#transition').classList.remove('active');changing=false;$('#view').focus({preventScroll:true});
}
$$('[data-room]').forEach(b=>b.addEventListener('click',()=>goToRoom(b.dataset.room)));
$('#reset').addEventListener('click',()=>goToRoom('living'));$('#stair-action').addEventListener('click',()=>goToRoom('bedroom'));
async function init(){
 try{
  renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.02;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;$('#view').appendChild(renderer.domElement);
  scene=new THREE.Scene();
  camera=new THREE.PerspectiveCamera(innerWidth<620?70:62,innerWidth/innerHeight,.035,65);camera.rotation.order='YXZ';setPose(spots.living);
  const env=new RoomEnvironment();const pmrem=new THREE.PMREMGenerator(renderer);const envTarget=pmrem.fromScene(env,.06);scene.environment=envTarget.texture;scene.environmentIntensity=.24;env.dispose();pmrem.dispose();
  addDaylight(scene);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(90,90),new THREE.MeshStandardMaterial({color:'#babfa2',roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-.13;ground.receiveShadow=true;scene.add(ground);
  const woven=weaveTexture(false);
  const aoExcluded=[];
  const gltf=await new GLTFLoader().loadAsync('./house.glb?v=4e2b53370ad5',e=>{const n=e.total?Math.round(e.loaded/e.total*90):30;$('#load-fill').style.width=n+'%';$('#load-text').textContent=n+' %';});
  const processedMaterials=new Set();
  gltf.scene.traverse(o=>{if(!o.isMesh)return;o.castShadow=true;o.receiveShadow=true;let m=o.material;
   if(/glass/i.test(m.name)){o.castShadow=false;m.side=THREE.DoubleSide;m.depthWrite=false;aoExcluded.push(o);}
   if(/plant/i.test(m.name)){m.side=THREE.DoubleSide;}
   if(processedMaterials.has(m))return;processedMaterials.add(m);m.envMapIntensity=.7;
   for(const key of ['map','normalMap','roughnessMap','metalnessMap'])if(m[key])m[key].anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
   if(/botanical/i.test(m.name)){m.map=botanicalTexture();m.side=THREE.DoubleSide;}
   if(/rattan/i.test(m.name)){m.map=woven;m.bumpMap=woven;m.bumpScale=.006;m.roughness=.92;}
   if(/gravel/i.test(m.name)){m.color.set('#c3c5c7');m.normalScale.set(1,1);}
   if(/paint ivory|plaster/i.test(m.name)){m.side=THREE.DoubleSide;m.roughness=.92;}
  });refineSurfaces(gltf.scene,renderer);scene.add(gltf.scene);
  const target=new THREE.WebGLRenderTarget(innerWidth,innerHeight,{type:THREE.HalfFloatType,samples:2});
  composer=new EffectComposer(renderer,target);composer.setPixelRatio(Math.min(devicePixelRatio,1.5));composer.setSize(innerWidth,innerHeight);
  composer.addPass(new RenderPass(scene,camera));
  aoPass=new SSAOPass(scene,camera,innerWidth,innerHeight,24);aoPass.kernelRadius=.24;aoPass.minDistance=.0005;aoPass.maxDistance=.025;
  // Transparent glass must not become an opaque occluder in the normal pass.
  const baseOverride=aoPass._overrideVisibility.bind(aoPass);
  aoPass._overrideVisibility=()=>{baseOverride();for(const o of aoExcluded)if(o.visible){o.visible=false;aoPass._visibilityCache.push(o);}};
  composer.addPass(aoPass);composer.addPass(new OutputPass());
  fxaaPass=new ShaderPass(FXAAShader);composer.addPass(fxaaPass);resizeEffects();
  ready=true;document.body.dataset.loaded='true';$('#load-fill').style.width='100%';$('#load-text').textContent='100 %';composer.render();renderer.shadowMap.autoUpdate=false;$('#loading').classList.add('done');setTimeout(()=>$('#loading').hidden=true,550);tourReady();
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();ready=false;setSceneActive(false);releaseInput();$('#error').hidden=false;tourFailed();});
 }catch(e){console.error('Tour loading failed',e);$('#loading').hidden=true;$('#error').hidden=false;tourFailed();}
}
const mayNavigate=()=>ready&&!changing&&isExploring()&&!$('dialog[open]');
const view=$('#view'),stick=$('#joystick');
view.addEventListener('pointerdown',e=>{
 if(!mayNavigate()||(e.pointerType==='mouse'&&e.button!==0))return;
 if(gestures.beginLook(e.pointerId,e.clientX,e.clientY)){view.focus({preventScroll:true});view.setPointerCapture(e.pointerId);}
});
view.addEventListener('pointermove',e=>{
 if(!mayNavigate())return;
 const delta=gestures.look(e.pointerId,e.clientX,e.clientY,Math.min(innerWidth,900),camera.fov);
 if(delta){yaw+=delta.yaw;pitch=THREE.MathUtils.clamp(pitch+delta.pitch,-1.35,1.35);}
});
for(const event of ['pointerup','pointercancel','lostpointercapture'])view.addEventListener(event,e=>gestures.endLook(e.pointerId));
stick.addEventListener('pointerdown',e=>{
 e.preventDefault();if(!mayNavigate())return;
 const rect=stick.getBoundingClientRect();
 if(gestures.beginMove(e.pointerId,rect.left+rect.width/2,rect.top+rect.height/2,rect.width*.29)){
  stick.setPointerCapture(e.pointerId);gestures.move(e.pointerId,e.clientX,e.clientY);updateStick();$('#coach').hidden=true;
 }
});
stick.addEventListener('pointermove',e=>{if(mayNavigate()&&gestures.move(e.pointerId,e.clientX,e.clientY))updateStick();});
for(const event of ['pointerup','pointercancel','lostpointercapture'])stick.addEventListener(event,e=>{
 if(gestures.endMove(e.pointerId)){walking={forward:0,side:0};updateStick();}
});
// Keyboard users retain four conventional direction buttons.
stick.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)&&mayNavigate()){e.preventDefault();keys.add(e.code);}});
stick.addEventListener('blur',releaseInput);
const activeCodes=['KeyW','KeyA','KeyS','KeyD','KeyQ','KeyE','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'];
document.addEventListener('keydown',e=>{if(!ready||!isExploring()||$('dialog[open]')||e.ctrlKey||e.metaKey||e.altKey)return;if(e.target.closest('button,a,input,textarea,select'))return;if(activeCodes.includes(e.code)){e.preventDefault();keys.add(e.code);}});
document.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',releaseInput);document.addEventListener('visibilitychange',()=>{if(document.hidden)releaseInput();setSceneActive(isExploring());});
$$('[data-move]').forEach(b=>{
 b.addEventListener('pointerdown',e=>{e.preventDefault();if(!mayNavigate())return;padMove=b.dataset.move;b.classList.add('held');b.setPointerCapture(e.pointerId);});
 const stop=()=>{padMove=null;b.classList.remove('held');};b.addEventListener('pointerup',stop);b.addEventListener('pointercancel',stop);b.addEventListener('lostpointercapture',stop);
 b.addEventListener('click',e=>{if(e.detail===0&&ready){padMove=b.dataset.move;setTimeout(stop,150);}});
});
function animate(now){
 if(!ready||document.hidden||!isExploring())return;const dt=Math.min((now-last)/1000,.04);last=now;
 if(isExploring()&&!$('dialog[open]')&&!changing){
  if(keys.has('KeyQ'))yaw+=dt*1.15;if(keys.has('KeyE'))yaw-=dt*1.15;
  let f=Number(keys.has('KeyW')||keys.has('ArrowUp')||padMove==='forward')-Number(keys.has('KeyS')||keys.has('ArrowDown')||padMove==='back');
  let s=Number(keys.has('KeyD')||keys.has('ArrowRight')||padMove==='right')-Number(keys.has('KeyA')||keys.has('ArrowLeft')||padMove==='left');
  f+=gestures.movement.forward;s+=gestures.movement.side;
  walking=advanceWalking(walking,f,s,dt,reducedMotion.matches);f=walking.forward;s=walking.side;
  if(f||s){const speed=level==='loft'?.65:1.05;const dx=(-Math.sin(yaw)*f+Math.cos(yaw)*s)*dt*speed;const dz=(-Math.cos(yaw)*f-Math.sin(yaw)*s)*dt*speed;camera.position.fromArray(movePosition(camera.position.toArray(),dx,dz,level));
   if(level==='ground'){const next=camera.position.x>1.9?'terrace':camera.position.z<-.8?'kitchen':'living';if(next!==currentRoom){currentRoom=next;updateRoomUI();}}
  }
 }
 camera.rotation.set(pitch,yaw,0,'YXZ');
 const pose=camera.position.toArray().join(',')+','+yaw+','+pitch;
 if(pose===lastRenderedPose)return;lastRenderedPose=pose;
 if(true){const x=12+(camera.position.x+1.8)/3.6*82,z=16+(camera.position.z+2.5)/5*116;$('#map-dot').setAttribute('cx',x.toFixed(2));$('#map-dot').setAttribute('cy',z.toFixed(2));$('#map-view').setAttribute('transform',`translate(${x} ${z}) rotate(${-yaw*180/Math.PI})`);$('#stair-action').hidden=level!=='ground'||Math.hypot(camera.position.x+1.27,camera.position.z+.42)>1.12||changing;}
 composer.render();
}
window.addEventListener('resize',()=>{releaseInput();if(!renderer||!camera)return;camera.aspect=innerWidth/innerHeight;camera.fov=innerWidth<620?70:62;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);if(composer){composer.setSize(innerWidth,innerHeight);resizeEffects();}lastRenderedPose='';});
function resizeEffects(){
 const ratio=renderer.getPixelRatio();
 aoPass.setSize(Math.round(innerWidth*ratio*.75),Math.round(innerHeight*ratio*.75));
 fxaaPass.uniforms.resolution.value.set(1/(innerWidth*ratio),1/(innerHeight*ratio));
}
function weaveTexture(check){
 const canvas=document.createElement('canvas');canvas.width=canvas.height=256;const ctx=canvas.getContext('2d');ctx.fillStyle=check?'#e9ede7':'#b6b7af';ctx.fillRect(0,0,256,256);
 if(check){for(let x=0;x<256;x+=16){ctx.fillStyle='#718b7e66';ctx.fillRect(x,0,8,256);ctx.fillRect(0,x,256,8);}}
 else{for(let y=0;y<256;y+=8)for(let x=0;x<256;x+=16){const offset=y%16?8:0;ctx.fillStyle='#4b524b';ctx.fillRect(x+offset,y,13,3);ctx.fillStyle='#dee0d3';ctx.fillRect(x+offset,y+4,13,2);}}
 const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;map.wrapS=map.wrapT=THREE.RepeatWrapping;map.anisotropy=8;if(!check)map.repeat.set(2,2);return map;
}
function botanicalTexture(){
 const c=document.createElement('canvas');c.width=c.height=512;const ctx=c.getContext('2d');ctx.fillStyle='#e8d7b9';ctx.fillRect(0,0,512,512);
 for(let i=0;i<45;i++){
  const x=rand()*512,y=rand()*512,a=rand()*6.28;ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.strokeStyle='#53624b';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(14,25,0,65);ctx.stroke();
  for(let j=0;j<5;j++){ctx.fillStyle=j%3?'#4c6c53':'#ad624c';ctx.beginPath();ctx.ellipse((j%2?1:-1)*10,j*12,14,5,(j%2?-.6:.6),0,Math.PI*2);ctx.fill();}ctx.restore();
 }
 const map=new THREE.CanvasTexture(c);map.colorSpace=THREE.SRGBColorSpace;map.wrapS=map.wrapT=THREE.RepeatWrapping;return map;
}
const frames=new FrameLoop(animate,requestAnimationFrame.bind(window),cancelAnimationFrame.bind(window));
function setSceneActive(active){if(active&&ready&&!document.hidden){last=performance.now();frames.start();}else frames.stop();}
setupExperience({setSceneActive,t,language:()=>language,gallery,openInfo,releaseInput,prepare:init,changeLanguage});
translate();
