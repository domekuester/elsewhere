import {createPhotoOpening} from './photo-opening.js?v=eab064138910';
// A finite photographic opening and interruptible room dissolves. No camera animation.
export function createTourMotion(doc,preference){
 const photoOpening=createPhotoOpening(doc,preference);
 const active=new Set(),cover=doc.querySelector('#transition');
 const select=s=>doc.querySelector(s);
 const reduced=()=>preference.matches||doc.hidden;
 let opened=false,generation=0;
 function play(element,frames,duration,{signal,delay=0,hold=false}={}){
  if(!element||signal?.aborted)return Promise.resolve();
  if(reduced()||!element.animate){if(hold)element.style.opacity=frames.at(-1).opacity;return Promise.resolve();}
  const epoch=generation;
  const animation=element.animate(frames,{duration,delay,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'});
  active.add(animation);
  const abort=()=>animation.cancel();signal?.addEventListener('abort',abort,{once:true});
  return animation.finished.catch(()=>{}).then(()=>{
   if(hold&&epoch===generation&&!signal?.aborted)element.style.opacity=frames.at(-1).opacity;
   signal?.removeEventListener('abort',abort);active.delete(animation);animation.cancel();
  });
 }
 function finish(){photoOpening.stop();for(const animation of active){try{animation.finish();}catch{animation.cancel();}}}
 function stop(){photoOpening.stop();generation++;for(const animation of active)animation.cancel();active.clear();if(cover)cover.style.opacity='0';}
 function arrival(source){
  stop();
  if(source&&photoOpening.show(source)){opened=true;return;}
  if(opened||reduced()){opened=true;return;}opened=true;
  // Open the prepared scene like a photograph, then place its quiet controls.
  void play(select('#view'),[{clipPath:'inset(2% 1.5% round 16px)',opacity:.55},{clipPath:'inset(0% 0% round 0px)',opacity:1}],620);
  for(const [selector,delay] of [['.topbar',40],['#room-label',100],['.bottom-ui',160]]){
   void play(select(selector),[{opacity:0,translate:'0 10px'},{opacity:1,translate:'0 0'}],420,{delay});
  }
 }
 async function conceal(signal){
  finish();
  await play(cover,[{opacity:0},{opacity:1}],140,{signal,hold:true});
 }
 async function reveal(signal){
  const label=select('#room-label');
  await Promise.all([
   play(cover,[{opacity:1},{opacity:0}],280,{signal,hold:true}),
   play(label,[{opacity:.3,translate:'0 6px'},{opacity:1,translate:'0 0'}],320,{signal})
  ]);
 }
 preference.addEventListener('change',event=>{if(event.matches)finish();});
 doc.addEventListener('visibilitychange',()=>{if(doc.hidden)stop();});
 // Direct input never waits for the decorative entrance.
 select('#view')?.addEventListener('pointerdown',finish);
 select('#joystick')?.addEventListener('pointerdown',finish);
 return {arrival,conceal,reveal,stop,finish};
}
