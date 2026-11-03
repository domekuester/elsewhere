import {revealChapter} from './editorial-motion.js?v=a36da1a17d7e';
import {JourneyPlayer} from './journey-player.js?v=a36da1a17d7e';
const frames=[
 {photo:11,file:'terrace-seating-wide.jpg',position:'50% 50%'},
 {photo:5,file:'living-reverse-new.jpg',position:'50% 50%'},
 {photo:1,file:'kitchen-new.jpg',position:'50% 50%'},
 {photo:13,file:'bedroom-lamp.jpg',position:'50% 50%'},
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
 const status=section.querySelector('.journey-status'),copy=section.querySelector('.journey-copy');
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 let rendered=0,wanted=0,token=0,active=0,inView=true,touch=null;
 const text=()=>api.t('journey');
 function translate(){
  const t=text(),chapter=t.chapters[rendered],state=player;
  section.ariaLabel=t.label;
  section.querySelector('.journey-title').textContent=chapter.title;
  section.querySelector('.journey-description').textContent=chapter.text;
  section.querySelector('.journey-location').textContent=rendered>=4?t.surroundings:t.property;
  section.querySelector('.journey-count').textContent=String(rendered+1).padStart(2,'0')+' / 06';
  section.querySelector('.journey-controls').ariaLabel=t.controls;
  section.querySelector('.journey-chapters').ariaLabel=t.choose;
  play.querySelector('span').textContent=state.playing?t.pause:(state.index===5?t.replay:t.play);
  play.setAttribute('aria-pressed',String(state.playing));
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
 play.addEventListener('click',()=>{if(player.playing)player.pause();else player.start();});
 const select=i=>{status.textContent='';player.select(i);};
 prev.addEventListener('click',()=>select(player.index-1));next.addEventListener('click',()=>select(player.index+1));
 chapters.forEach(b=>b.addEventListener('click',()=>select(Number(b.dataset.chapter))));
 open.addEventListener('click',()=>{player.pause();api.gallery(frames[rendered].photo);});
 section.addEventListener('focusin',e=>{if(e.target!==play&&player.playing)player.pause();});
 section.addEventListener('keydown',e=>{
  if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();select(player.index+(e.key==='ArrowRight'?1:-1));}
 });
 stage.addEventListener('touchstart',e=>{if(e.touches.length===1)touch={x:e.touches[0].clientX,y:e.touches[0].clientY};else touch=null;},{passive:true});
 stage.addEventListener('touchend',e=>{if(!touch)return;const end=e.changedTouches[0],dx=end.clientX-touch.x,dy=end.clientY-touch.y;touch=null;if(Math.abs(dx)>48&&Math.abs(dx)>Math.abs(dy)*1.5)select(player.index+(dx<0?1:-1));},{passive:true});
 stage.addEventListener('touchcancel',()=>touch=null,{passive:true});
 const visibility=()=>player.setVisible(inView&&!document.hidden&&document.body.dataset.mode==='welcome');
 if(typeof IntersectionObserver!=='undefined')new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;visibility();},{root:document.querySelector('#welcome-screen'),threshold:0}).observe(section);
 if(typeof IntersectionObserver!=='undefined')new IntersectionObserver(entries=>{section.dataset.imageVisible=String(entries[0].isIntersecting);},{root:document.querySelector('#welcome-screen'),threshold:0}).observe(stage);
 document.addEventListener('visibilitychange',visibility);
 new MutationObserver(visibility).observe(document.body,{attributes:true,attributeFilter:['data-mode']});
 reduced.addEventListener('change',()=>player.pause());
 // Any modal or tour entry pauses the photographic narrative.
 document.addEventListener('click',e=>{if(e.target.closest('[data-start-tour],[data-gallery-index],[data-photo],#welcome-gallery,[data-about]'))player.pause();});
}
