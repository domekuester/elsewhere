// Finite photo openings and one scroll-linked panorama. The page owns the scroll scheduler.
const ease='cubic-bezier(.16,1,.3,1)';
const running=new Set(),perElement=new WeakMap();
const reduced=()=>typeof window==='undefined'||window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
function animate(element,frames,duration=420,cleanup=()=>{},delay=0){
 perElement.get(element)?.cancel();
 if(!element?.animate||reduced()){cleanup();return;}
 const animation=element.animate(frames,{duration,delay,easing:ease,fill:'backwards'});
 running.add(animation);perElement.set(element,animation);
 const done=()=>{running.delete(animation);if(perElement.get(element)===animation)perElement.delete(element);cleanup();};
 animation.finished.then(done,done);
}
export function revealChapter(copy){
 animate(copy,[{opacity:.55,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],360);
}
export function blendRoom(image,oldSource){
 if(reduced()||!image?.animate)return;
 // A decorative old layer keeps the previous photo visible while the decoded new one arrives.
 image.parentElement.querySelectorAll('.room-outgoing').forEach(node=>node.remove());
 const old=image.cloneNode(false);old.src=oldSource;old.alt='';old.removeAttribute('id');
 old.className='room-outgoing';old.setAttribute('aria-hidden','true');
 image.before(old);
 animate(image,[{opacity:0},{opacity:1}],440,()=>old.remove());
}
export function setupEditorialMotion(doc=document,win=window){
 const root=doc.querySelector('#welcome-screen');
 const idle={update(){},finish(){}};
 if(!root?.querySelectorAll)return idle;
 const preference=win.matchMedia?.('(prefers-reduced-motion: reduce)');
 const finish=()=>{for(const animation of running){try{animation.finish();}catch{animation.cancel();}}};
 const active=()=>!doc.hidden&&!root.hidden&&doc.body?.dataset.mode!=='tour'&&!doc.querySelector('dialog[open]');
 let observer,panoramaDone=false;
 const panorama=root.querySelector?.('.landscape-window');
 const landscapeImage=panorama?.querySelector('img');
 const finishPanorama=()=>{
  panoramaDone=true;
  panorama?.style.removeProperty('--panorama-inset');
  panorama?.style.removeProperty('--panorama-scale');
 };
 preference?.addEventListener('change',event=>{
  if(event.matches){finish();finishPanorama();observer?.disconnect();}
 });
 doc.addEventListener('visibilitychange',()=>{if(doc.hidden){finish();finishPanorama();}});
 // A direct interaction always takes priority over the photographic opening.
 root.addEventListener?.('pointerdown',finish,{passive:true});
 panorama?.closest('button')?.addEventListener('focus',finishPanorama);
 if(win.MutationObserver){
  new win.MutationObserver(()=>{if(root.hidden){finish();finishPanorama();}}).observe(root,{attributes:true,attributeFilter:['hidden']});
 }
 if(preference?.matches)return idle;
 // The three arrival views open only when decoded AND on screen, including below the fold on phones.
 // No hidden default state: absent APIs, failed images and rapid scrolling all leave content usable.
 if(win.IntersectionObserver){
  const visible=new Set(),pending=new WeakSet(),seen=new WeakSet();
  const frames=[...root.querySelectorAll('.arrival-mosaic .photo-open')];
  observer=new win.IntersectionObserver(entries=>{
   for(const entry of entries){
    const frame=entry.target;
    if(!entry.isIntersecting||entry.intersectionRatio<.18){visible.delete(frame);continue;}
    visible.add(frame);
    if(seen.has(frame)||pending.has(frame)||!active()||preference?.matches)continue;
    const photo=frame.querySelector('img');
    if(!photo)continue;
    pending.add(frame);
    Promise.resolve().then(()=>photo.decode?.()).then(()=>{
     const rect=frame.getBoundingClientRect();
     if(!visible.has(frame)||!active()||preference?.matches||rect.bottom<=0||rect.top>=root.clientHeight||!photo.naturalWidth)return;
     seen.add(frame);observer.unobserve(frame);
     const compact=root.clientWidth<=600;
     animate(photo,[{clipPath:'inset(0 0 '+(compact?5:9)+'% 0)',opacity:.78},{clipPath:'inset(0 0 0% 0)',opacity:1}],compact?520:760,()=>{},compact?0:frames.indexOf(frame)*60);
    }).catch(()=>{}).finally(()=>pending.delete(frame));
   }
  },{root,threshold:[0,.18],rootMargin:'0px 0px -4% 0px'});
  frames.forEach(frame=>observer.observe(frame));
 }
 let lastOpening=0;
 return {finish,update(){
  if(panoramaDone||!panorama||!active())return;
  if(preference?.matches){finishPanorama();return;}
  // Only this landscape opens with the scroll: the wider view follows the invitation to let the eye wander.
  const height=root.clientHeight,rect=panorama.getBoundingClientRect();
  if(rect.top>=height||!landscapeImage?.complete||!landscapeImage.naturalWidth)return;
  const opening=Math.max(lastOpening,Math.min(1,Math.max(0,(height*.94-rect.top)/(height*.58))));
  if(opening>=1){finishPanorama();return;}
  if(opening===lastOpening&&panorama.style.getPropertyValue('--panorama-inset'))return;
  lastOpening=opening;
  const compact=root.clientWidth<=600,remaining=1-opening;
  panorama.style.setProperty('--panorama-inset',((compact?3:7)*remaining).toFixed(3)+'%');
  panorama.style.setProperty('--panorama-scale',(1+(compact?.018:.035)*remaining).toFixed(4));
 }};
}
// Decode requests can finish out of order; only the latest chosen room may commit.
export function latestPhotoRequest(load){
 let current=0;
 return async(source,commit,failed)=>{
  const id=++current;
  try{await load(source);}catch(error){if(id===current)failed?.(error);return false;}
  if(id!==current)return false;
  commit();return true;
 };
}
