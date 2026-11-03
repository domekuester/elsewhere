// Finite photographic motion: no scroll handlers, timers or animation loop.
const ease='cubic-bezier(.16,1,.3,1)';
const running=new Set(),perElement=new WeakMap();
const reduced=()=>typeof window==='undefined'||window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
function animate(element,frames,duration=420,cleanup=()=>{}){
 perElement.get(element)?.cancel();
 if(!element?.animate||reduced()){cleanup();return;}
 const animation=element.animate(frames,{duration,easing:ease});
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
export function setupEditorialMotion(){
 const root=document.querySelector('#welcome-screen');
 if(!root?.querySelectorAll)return;
 const finish=()=>{for(const animation of running)animation.finish();};
 window.matchMedia?.('(prefers-reduced-motion: reduce)').addEventListener('change',event=>{if(event.matches)finish();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)finish();});
 if(reduced()||root.scrollTop>24||document.hidden)return;
 // One arrival sequence: the three real views open like a photographic spread.
 root.querySelectorAll('.arrival-mosaic .photo-open').forEach((frame,index)=>{
  animate(frame,[{clipPath:'inset(0 0 7% 0)',opacity:.72,transform:'translateY('+[10,18,24][index]+'px)'},{clipPath:'inset(0 0 0% 0)',opacity:1,transform:'translateY(0)'}],560+index*70);
 });
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
