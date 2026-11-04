import {revealChapter} from './editorial-motion.js?v=f132706da4f0';
import {JourneyPlayer} from './journey-player.js?v=f132706da4f0';
const frames=[
 {room:'terrace',photo:11,file:'terrace-seating-wide.jpg',position:'50% 50%'},
 {room:'living',photo:5,file:'living-reverse-new.jpg',position:'50% 50%'},
 {room:'kitchen',photo:0,file:'living-new.jpg',position:'50% 50%'},
 {room:'bedroom',photo:13,file:'bedroom-lamp.jpg',position:'50% 50%'},
 {photo:15,file:'water-and-green-hills-sdr.jpg',position:'50% 58%'},
 {photo:17,file:'boats-evening-etang-sale.jpg',position:'50% 50%'}
];
let journey=null;
export function translateJourney(){journey?.translate();}
export function setupJourney(api){
 const section=document.querySelector('#photo-journey');
 if(!section?.querySelector('.journey-stage'))return;
 const stage=section.querySelector('.journey-stage'),layers=[...stage.querySelectorAll('.journey-frame')];
 const play=section.querySelector('[data-journey-play]'),prev=section.querySelector('[data-journey-prev]'),next=section.querySelector('[data-journey-next]');
 const open=section.querySelector('[data-journey-open]'),chapters=[...section.querySelectorAll('[data-chapter]')];
 const entry=section.querySelector('[data-journey-enter]'),entryNote=section.querySelector('.journey-entry-note');
 const status=section.querySelector('.journey-status'),copy=section.querySelector('.journey-copy');
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 let rendered=0,wanted=0,token=0,active=0,imageInView=typeof IntersectionObserver==='undefined',pendingStart=false,touch=null;
 const text=()=>api.t('journey');
 const available=()=>!document.hidden&&document.body.dataset.mode==='welcome'&&!document.querySelector('dialog[open]');
 function translate(){
  const t=text(),chapter=t.chapters[rendered],state=player;
  section.ariaLabel=t.label;
  section.querySelector('.journey-title').textContent=chapter.title;
  section.querySelector('.journey-description').textContent=chapter.text;
  section.querySelector('.journey-location').textContent=rendered>=4?t.surroundings:t.property;
  section.querySelector('.journey-count').textContent=String(rendered+1).padStart(2,'0')+' / 06';
  section.querySelector('.journey-controls').ariaLabel=t.controls;
  section.querySelector('.journey-chapters').ariaLabel=t.choose;
  play.querySelector('span').textContent=state.playing||pendingStart?t.pause:(state.index===5?t.replay:t.play);
  play.setAttribute('aria-pressed',String(state.playing||pendingStart));
  prev.ariaLabel=t.previous;next.ariaLabel=t.next;prev.disabled=wanted===0;next.disabled=wanted===5;
  open.querySelector('span').textContent=t.open;
  open.ariaLabel=api.t('photoNames')[frames[rendered].photo]+' · '+t.open;
  chapters.forEach((b,i)=>{b.querySelector('span').textContent=t.chapters[i].label;b.setAttribute('aria-pressed',String(i===wanted));});
  const strip=section.querySelector('.journey-chapters'),selected=chapters[wanted];
  if(strip.scrollWidth>strip.clientWidth){
   const left=selected.getBoundingClientRect().left-strip.getBoundingClientRect().left+strip.scrollLeft,right=left+selected.offsetWidth;
   if(left<strip.scrollLeft)strip.scrollLeft=left;
   else if(right>strip.scrollLeft+strip.clientWidth)strip.scrollLeft=right-strip.clientWidth;
  }
  layers[active].querySelector('img').alt=api.t('photoNames')[frames[rendered].photo];
  copy.setAttribute('aria-live',state.playing?'off':'polite');
  section.dataset.playing=String(state.playing);
  if(entry){
   const entryState=api.entryState?.()||{},hasRoom=!!frames[rendered].room;
   entry.hidden=!hasRoom;section.querySelector('[data-journey-doorway]').hidden=!hasRoom;if(entryNote)entryNote.hidden=!hasRoom;
   entry.disabled=entryState.failed||(entryState.loading&&entryState.requested)||wanted!==rendered;
   entry.setAttribute('aria-busy',String(!!entryState.loading));
   entry.querySelector('[data-journey-enter-label]').textContent=api.t(entryState.loading&&entryState.requested?'preparingShort':'photoEntry');
   entry.querySelector('[data-journey-enter-detail]').textContent=api.t('photoEntryRooms')[rendered]||'';
  }
 }
 async function render(index){
  const request=++token;wanted=index;
  if(index===rendered){stage.setAttribute('aria-busy','false');player.setReady(true);translate();return;}
  player.setReady(false);stage.setAttribute('aria-busy','true');status.textContent=text().loading;translate();
  // Decode away from the displayed layers. Only the most recent selection can commit.
  const image=new Image();image.src='./photos/'+frames[index].file;
  try{await image.decode();}catch{
   if(request!==token)return;
   wanted=rendered;player.select(rendered);player.setReady(true);stage.setAttribute('aria-busy','false');status.textContent=text().error;return;
  }
  if(request!==token)return;
  const incoming=1-active,layer=layers[incoming],img=layer.querySelector('img');
  img.src=image.src;img.alt=api.t('photoNames')[frames[index].photo];img.style.objectPosition=frames[index].position;
  layers[active].classList.remove('is-current');layers[active].setAttribute('aria-hidden','true');
  layer.classList.add('is-current');layer.removeAttribute('aria-hidden');
  active=incoming;rendered=index;stage.setAttribute('aria-busy','false');status.textContent='';translate();revealChapter(copy);
  player.setReady(true);
 }
 const player=new JourneyPlayer({count:frames.length,delay:10000,onChange:state=>{
  if(state.index!==wanted)void render(state.index);
  translate();
 }});
 journey={translate};translate();
 const pause=()=>{pendingStart=false;player.pause();};
 play.addEventListener('click',()=>{
  api.cancelTourEntry?.();
  if(player.playing||pendingStart){pause();return;}
  if(!available())return;
  if(imageInView){player.start();return;}
  pendingStart=true;translate();
  // Native centering respects the page's scroll-padding for its sticky header.
  // Only this explicit click may request playback once the photograph is visible.
  stage.scrollIntoView({block:'center',behavior:reduced.matches?'auto':'smooth'});
 });
 const select=i=>{api.cancelTourEntry?.();pendingStart=false;status.textContent='';player.select(i);};
 prev.addEventListener('click',()=>select(player.index-1));next.addEventListener('click',()=>select(player.index+1));
 chapters.forEach(b=>b.addEventListener('click',()=>select(Number(b.dataset.chapter))));
 open.addEventListener('click',()=>{pause();api.gallery(frames[rendered].photo);});
 entry?.addEventListener('click',()=>{
  const frame=frames[rendered];if(!frame.room||wanted!==rendered||entry.disabled)return;
  pause();
  const image=layers[active].querySelector('img'),rect=stage.getBoundingClientRect();
  api.enterFromPhoto?.({room:frame.room,trigger:entry,source:{src:image.currentSrc||image.src,position:frame.position,element:stage,rect:{left:rect.left,top:rect.top,width:rect.width,height:rect.height},width:image.naturalWidth,height:image.naturalHeight}});
 });
 section.addEventListener('focusin',e=>{if(e.target!==play&&(player.playing||pendingStart))pause();});
 section.addEventListener('keydown',e=>{
  if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();select(player.index+(e.key==='ArrowRight'?1:-1));}
 });
 stage.addEventListener('touchstart',e=>{if(e.touches.length===1)touch={x:e.touches[0].clientX,y:e.touches[0].clientY};else touch=null;},{passive:true});
 stage.addEventListener('touchend',e=>{if(!touch)return;const end=e.changedTouches[0],dx=end.clientX-touch.x,dy=end.clientY-touch.y;touch=null;if(Math.abs(dx)>48&&Math.abs(dx)>Math.abs(dy)*1.5)select(player.index+(dx<0?1:-1));},{passive:true});
 stage.addEventListener('touchcancel',()=>touch=null,{passive:true});
 const visibility=()=>{
  const allowed=available(),visible=imageInView&&allowed;
  if(!allowed)pendingStart=false;
  // Reading the caption below an off-screen image must not silently advance it.
  // Discard an automatic next frame that is still decoding, but honour manual choices.
  if(!visible&&player.playing&&wanted!==rendered){
   token++;wanted=rendered;stage.setAttribute('aria-busy','false');status.textContent='';player.select(rendered);player.setReady(true);
  }
  player.setVisible(visible);
  if(visible&&pendingStart){pendingStart=false;player.start();}
 };
 section.dataset.imageVisible=String(imageInView);
 if(typeof IntersectionObserver!=='undefined')new IntersectionObserver(entries=>{
  const entry=entries[0];imageInView=entry.isIntersecting&&entry.intersectionRatio>=.3;
  section.dataset.imageVisible=String(imageInView);visibility();
 },{root:document.querySelector('#welcome-screen'),threshold:[0,.3]}).observe(stage);
 visibility();
 document.addEventListener('visibilitychange',visibility);
 new MutationObserver(visibility).observe(document.body,{attributes:true,attributeFilter:['data-mode']});
 reduced.addEventListener('change',pause);
 // Any modal or tour entry pauses the photographic narrative.
 document.addEventListener('click',e=>{if(e.target.closest('[data-start-tour],[data-gallery-index],[data-photo],#welcome-gallery,[data-about]'))pause();});
}
