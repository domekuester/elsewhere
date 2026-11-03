import {advanceWalking} from './motion.js';
import {addDaylight,refineSurfaces} from './atmosphere.js';
import {experienceCopy,setupExperience,isExploring,tourReady,tourFailed,translateExperience} from './experience.js';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import { spots,movePosition } from './navigation.js';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let language='de',currentRoom='living',level='ground',ready=false,changing=false,photoIndex=0,infoMode='about';
const strings={
 de:{photos:'Originalfotos',book:'Auf Booking ansehen',loading:'Ein kleiner Moment …',loadingSub:'Wir öffnen die Türen.',error:'Der Rundgang konnte nicht geladen werden.',errorSub:'Versuche es mit einem aktuellen Browser. Die Originalfotos kannst du trotzdem ansehen.',retry:'Erneut versuchen',orientation:'Orientierung',mapNote:'Schematisch · nicht maßstabsgetreu',living:'Wohnen',kitchen:'Küche',bedroom:'Schlafen',terrace:'Terrasse',draft:'Entwurf · Rekonstruktion nach Fotos',hint:'Ziehen zum Umschauen · Pfeiltasten zum Gehen',reset:'Zurück zum Start',sourcePhotos:'Die Unterkunft in Bildern',photoCredit:'Fotovorlagen aus dem Booking.com-Inserat von Le bord du lac.',upstairs:'Zur Schlafebene',hideMap:'Grundriss ein-/ausblenden',ground:'Erdgeschoss',loft:'Schlafebene',outside:'Im Freien',roomTitles:['Der Wohnbereich','Die kleine Küche','Unter dem Dach','Die Terrasse'],roomDescriptions:['Helles Holz, weiche Stoffe und ein Blick ins Grüne.','Alles an einem Ort. Kochen, essen, zusammen sein.','Ein ruhiger Rückzugsort über dem Wohnbereich.','Ein geschützter Platz zwischen Holz und Grün.'],photoNames:['Wohnbereich und Küche','Esstisch und Zugang zur Terrasse','Terrasse und Außenbereich','Strand in der Umgebung','Schlafebene','Wohnbereich, Treppe und Badezimmertür','Badebucht in der Umgebung'],aboutTitle:'Ein erster räumlicher Eindruck',aboutBody:'<p>Dieser begehbare <strong>Entwurf wurde aus fünf Unterkunftsfotos</strong> nachgebaut. Er zeigt die erkennbare Einrichtung und den ungefähren räumlichen Zusammenhang.</p><p>Maße, Abstände, Raumhöhen, Treppe und nicht sichtbare Details sind geschätzt. Das Badezimmer bleibt geschlossen. Der Entwurf ersetzt keine vermessene oder fotografische 360°-Begehung.</p><p class="note">Die Originalfotos sind über „Originalfotos“ abrufbar. Maßgeblich für die Unterkunft sind die aktuellen Angaben des Gastgebers.</p><a href="https://www.booking.com/hotel/re/le-bord-du-lac.de.html" target="_blank" rel="noopener noreferrer">Unterkunft auf Booking.com ansehen ↗</a>',helpTitle:'Ganz in deinem Tempo',helpBody:'<p><strong>Umschauen:</strong> Ziehe mit der Maus oder dem Finger über das Bild.</p><p><strong>Gehen:</strong> Nutze die Richtungstasten im Bild, die Pfeiltasten oder <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd>. Mit <kbd>Q</kbd> und <kbd>E</kbd> drehst du dich.</p><p><strong>Bereich wechseln:</strong> Wähle unten Wohnen, Küche, Schlafen oder Terrasse. Die Schlafebene erreichst du über diese Auswahl.</p><p class="note">Der kleine Grundriss zeigt deine ungefähre Position. „Zum Ausgangspunkt“ bringt dich in den Wohnbereich.</p>',welcome:'Ziehe über das Bild, um dich umzuschauen.',fullscreenFail:'Vollbild ist in diesem Browser nicht verfügbar.'},
 fr:{photos:'Photos originales',book:'Voir sur Booking',loading:'Un petit instant…',loadingSub:'Nous ouvrons les portes.',error:'La visite n’a pas pu être chargée.',errorSub:'Essayez un navigateur récent. Les photos originales restent disponibles.',retry:'Réessayer',orientation:'Se repérer',mapNote:'Schéma indicatif · non à l’échelle',living:'Salon',kitchen:'Cuisine',bedroom:'Chambre',terrace:'Terrasse',draft:'Ébauche · Reconstitution d’après photos',hint:'Glisser pour regarder · Flèches pour avancer',reset:'Revenir au départ',sourcePhotos:'Le logement en images',photoCredit:'Photos de référence de l’annonce Booking.com de Le bord du lac.',upstairs:'Vers la mezzanine',hideMap:'Afficher/masquer le plan',ground:'Rez-de-chaussée',loft:'Mezzanine',outside:'À l’extérieur',roomTitles:['Le coin salon','La petite cuisine','Sous les toits','La terrasse'],roomDescriptions:['Du bois clair, des matières douces et une ouverture sur le jardin.','Tout à portée de main. Cuisiner, manger, partager.','Un coin paisible au-dessus du salon.','Un espace abrité, entre bois et végétation.'],photoNames:['Salon et cuisine','Table et accès à la terrasse','Terrasse et extérieur','Plage aux alentours','Mezzanine','Salon, escalier et porte de la salle de bains','Baignade aux alentours'],aboutTitle:'Une première impression des volumes',aboutBody:'<p>Cette <strong>ébauche a été reconstituée à partir de cinq photos du logement</strong>. Elle présente le mobilier visible et une approximation de l’organisation des espaces.</p><p>Les dimensions, distances, hauteurs, l’escalier et les détails non visibles sont estimés. La salle de bains reste fermée. Cette ébauche ne remplace pas un relevé ou une visite photographique à 360°.</p><p class="note">Les photos originales sont accessibles depuis le bouton « Photos originales ». Les informations actuelles de l’hôte font référence.</p><a href="https://www.booking.com/hotel/re/le-bord-du-lac.fr.html" target="_blank" rel="noopener noreferrer">Voir le logement sur Booking.com ↗</a>',helpTitle:'À votre rythme',helpBody:'<p><strong>Regarder :</strong> faites glisser la souris ou le doigt sur l’image.</p><p><strong>Se déplacer :</strong> utilisez les boutons directionnels, les flèches du clavier ou <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd>. <kbd>Q</kbd> et <kbd>E</kbd> permettent de tourner.</p><p><strong>Changer d’espace :</strong> choisissez Salon, Cuisine, Chambre ou Terrasse en bas de l’écran. La mezzanine est accessible par ce menu.</p><p class="note">Le petit plan indique votre position approximative. « Au point de départ » vous ramène au salon.</p>',welcome:'Faites glisser l’image pour regarder autour de vous.',fullscreenFail:'Le plein écran n’est pas disponible dans ce navigateur.'}
};
Object.assign(strings.de,experienceCopy.de);Object.assign(strings.fr,experienceCopy.fr);
const roomKeys=Object.keys(spots);
const photoFiles=['living','kitchen','terrace','beach','bedroom','living-reverse','lagoon'];
function t(key){return strings[language][key];}
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
 $('#language').textContent=language==='de'?'FR':'DE';$('#language').ariaLabel=language==='de'?'Passer en français':'Auf Deutsch wechseln';
 $('.book').href=`https://www.booking.com/hotel/re/le-bord-du-lac.${language}.html`;
 const labels=language==='fr'?{forward:'Avancer',back:'Reculer',left:'À gauche',right:'À droite'}:{forward:'Vorwärts',back:'Rückwärts',left:'Nach links',right:'Nach rechts'};
 $$('[data-move]').forEach(b=>b.ariaLabel=labels[b.dataset.move]);
 $$('.close').forEach(b=>b.ariaLabel=language==='fr'?'Fermer':'Schließen');
 $('#fullscreen').ariaLabel=$('#fullscreen').title=language==='fr'?'Plein écran':'Vollbild';
 $('#help').ariaLabel=language==='fr'?'Comment se déplacer':'Bedienung erklären';
 $('#prev-photo').ariaLabel=language==='fr'?'Photo précédente':'Vorheriges Foto';
 $('#next-photo').ariaLabel=language==='fr'?'Photo suivante':'Nächstes Foto';
 updateRoomUI();showPhoto(photoIndex);if($('#information').open)fillInfo();translateExperience();
}
let toastTimer;
function toast(text){clearTimeout(toastTimer);$('#toast').textContent=text;$('#toast').hidden=false;toastTimer=setTimeout(()=>$('#toast').hidden=true,4300);}
$('#language').addEventListener('click',()=>{language=language==='de'?'fr':'de';translate();});
function showPhoto(i){
 photoIndex=(i+photoFiles.length)%photoFiles.length;
 $('#gallery-image').src=`./photos/${photoFiles[photoIndex]}.jpg`;$('#gallery-image').alt=t('photoNames')[photoIndex];$('#photo-caption').textContent=t('photoNames')[photoIndex];$('#photo-counter').textContent=`${photoIndex+1} / ${photoFiles.length}`;
 $$('#photo-thumbs button').forEach((b,j)=>{b.setAttribute('aria-pressed',String(j===photoIndex));b.ariaLabel=t('photoNames')[j];});
}
photoFiles.forEach((name,i)=>{const b=document.createElement('button');b.innerHTML=`<img src="./photos/${name}.jpg" alt="">`;b.addEventListener('click',()=>showPhoto(i));$('#photo-thumbs').appendChild(b);});
function gallery(index){releaseInput();showPhoto(Number.isInteger(index)?index:photoIndex);$('#gallery').showModal();}
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
let renderer,scene,camera,composer,aoPass,fxaaPass,yaw=0,pitch=0,lastRenderedPose='';const keys=new Set();let drag=null,padMove=null,last=performance.now();let walking={forward:0,side:0};const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
function releaseInput(){walking={forward:0,side:0};keys.clear();padMove=null;drag=null;$$('[data-move]').forEach(b=>b.classList.remove('held'));}
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
  const gltf=await new GLTFLoader().loadAsync('./house.glb',e=>{const n=e.total?Math.round(e.loaded/e.total*90):30;$('#load-fill').style.width=n+'%';$('#load-text').textContent=n+' %';});
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
  ready=true;document.body.dataset.loaded='true';$('#load-fill').style.width='100%';$('#load-text').textContent='100 %';composer.render();renderer.shadowMap.autoUpdate=false;$('#loading').classList.add('done');setTimeout(()=>$('#loading').hidden=true,550);tourReady();requestAnimationFrame(animate);
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();ready=false;$('#error').hidden=false;tourFailed();});
 }catch(e){console.error('Tour loading failed',e);$('#loading').hidden=true;$('#error').hidden=false;tourFailed();}
}
$('#view').addEventListener('pointerdown',e=>{if(!ready||changing||!isExploring())return;$('#view').focus({preventScroll:true});drag={id:e.pointerId,x:e.clientX,y:e.clientY};$('#view').setPointerCapture(e.pointerId);});
$('#view').addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;yaw-=(e.clientX-drag.x)*.004;pitch=THREE.MathUtils.clamp(pitch-(e.clientY-drag.y)*.003,-1.1,1.1);drag.x=e.clientX;drag.y=e.clientY;});
$('#view').addEventListener('pointerup',()=>drag=null);$('#view').addEventListener('pointercancel',()=>drag=null);
const activeCodes=['KeyW','KeyA','KeyS','KeyD','KeyQ','KeyE','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'];
document.addEventListener('keydown',e=>{if(!ready||!isExploring()||$('dialog[open]')||e.ctrlKey||e.metaKey||e.altKey)return;if(e.target.closest('button,a,input,textarea,select'))return;if(activeCodes.includes(e.code)){e.preventDefault();keys.add(e.code);}});
document.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',releaseInput);document.addEventListener('visibilitychange',()=>{if(document.hidden)releaseInput();});
$$('[data-move]').forEach(b=>{
 b.addEventListener('pointerdown',e=>{e.preventDefault();if(!ready)return;padMove=b.dataset.move;b.classList.add('held');b.setPointerCapture(e.pointerId);});
 const stop=()=>{padMove=null;b.classList.remove('held');};b.addEventListener('pointerup',stop);b.addEventListener('pointercancel',stop);b.addEventListener('lostpointercapture',stop);
 b.addEventListener('click',e=>{if(e.detail===0&&ready){padMove=b.dataset.move;setTimeout(stop,150);}});
});
function animate(now){
 if(!ready)return;requestAnimationFrame(animate);const dt=Math.min((now-last)/1000,.04);last=now;if(document.hidden)return;
 if(isExploring()&&!$('dialog[open]')&&!changing){
  if(keys.has('KeyQ'))yaw+=dt*1.15;if(keys.has('KeyE'))yaw-=dt*1.15;
  let f=Number(keys.has('KeyW')||keys.has('ArrowUp')||padMove==='forward')-Number(keys.has('KeyS')||keys.has('ArrowDown')||padMove==='back');
  let s=Number(keys.has('KeyD')||keys.has('ArrowRight')||padMove==='right')-Number(keys.has('KeyA')||keys.has('ArrowLeft')||padMove==='left');
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
window.addEventListener('resize',()=>{if(!renderer||!camera)return;camera.aspect=innerWidth/innerHeight;camera.fov=innerWidth<620?70:62;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);if(composer){composer.setSize(innerWidth,innerHeight);resizeEffects();}lastRenderedPose='';});
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
setupExperience({t,language:()=>language,gallery,openInfo,releaseInput,prepare:init,changeLanguage:()=>{language=language==='de'?'fr':'de';translate();}});
translate();
