import {setupEditorialMotion,blendRoom,latestPhotoRequest} from './editorial-motion.js?v=eab064138910';
import {setupJourney,translateJourney} from './photo-journey.js?v=eab064138910';
// Original-photo landing page. Booking remains an explicit outbound link.
import {bookingUrl} from './i18n.js?v=eab064138910';
const spaces={living:{photo:5,file:'living-reverse-new',caption:0},bedroom:{photo:13,file:'bedroom-lamp',caption:1},terrace:{photo:11,file:'terrace-seating-wide',caption:2}};
let selectedSpace='terrace';
function updateSpace(api){
 const preview=document.querySelector('#space-preview'),choice=spaces[selectedSpace];
 const photo=preview?.querySelector('button'),img=preview?.querySelector('img:not(.room-outgoing)');
 if(!img||!photo)return;
 img.src='./photos/'+choice.file+'.jpg';img.alt=api.t('photoNames')[choice.photo];
 photo.dataset.photo=String(choice.photo);photo.ariaLabel=img.alt+' · '+api.t('openPhoto');
 document.querySelector('[data-space-caption]').textContent=api.t('spaceCaptions')[choice.caption];
 document.querySelector('.space-list').ariaLabel=api.t('spaceChoose');
 document.querySelectorAll('[data-space]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.space===selectedSpace)));
}
export function translateLanding(api){
 document.querySelectorAll('[data-editorial-title]').forEach(el=>{
  const parts=api.t(el.dataset.i18n).split('\n');
  if(parts.length<2)return;
  const accent=document.createElement('em');accent.textContent=parts.slice(1).join(' ');
  el.replaceChildren(document.createTextNode(parts[0]+' '),accent);
 });
 translateJourney();
 updateSpace(api);
 const lang=api.language();
 document.querySelectorAll('[data-booking]').forEach(a=>{a.href=bookingUrl(lang);a.ariaLabel=a.textContent.trim()+'. '+api.t('newWindow');});
 document.querySelectorAll('[data-photo]').forEach(b=>{const img=b.querySelector('img:not(.room-outgoing)');const label=img?api.t('photoNames')[Number(b.dataset.photo)]:b.textContent.trim();b.ariaLabel=label+' · '+api.t('openPhoto');if(img)img.alt=api.t('photoNames')[Number(b.dataset.photo)];});
 document.querySelector('.tour-preview button').ariaLabel=api.t('start');
 document.querySelector('.tour-preview img').alt=api.t('previewTitle');
 document.querySelector('.site-nav').ariaLabel=api.t('siteNavigation');
 document.querySelectorAll('[data-site-language]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.siteLanguage===lang)));
}
export function setupLanding(api){
 setupJourney(api);
 const editorialMotion=setupEditorialMotion();
 const preview=document.querySelector('#space-preview');
 const requestPhoto=latestPhotoRequest(source=>{const image=new Image();image.src=source;return image.decode();});
 document.querySelectorAll('[data-space]').forEach(button=>button.addEventListener('click',()=>{
  const next=button.dataset.space;
  preview.setAttribute('aria-busy','true');
  void requestPhoto('./photos/'+spaces[next].file+'.jpg',()=>{
   const image=preview.querySelector('img:not(.room-outgoing)'),oldSource=image.src;
   const changed=selectedSpace!==next;selectedSpace=next;updateSpace(api);
   preview.removeAttribute('aria-busy');if(changed)blendRoom(image,oldSource);
  },()=>{preview.removeAttribute('aria-busy');preview.querySelector('[data-space-caption]').textContent=api.t('spaceError');});
 }));
 document.querySelectorAll('[data-gallery-index]').forEach(b=>b.addEventListener('click',()=>api.gallery(Number(b.dataset.galleryIndex))));
 document.querySelectorAll('[data-photo]').forEach(b=>b.addEventListener('click',()=>api.gallery(Number(b.dataset.photo))));
 document.querySelectorAll('[data-site-language]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.siteLanguage!==api.language())api.changeLanguage(b.dataset.siteLanguage);}));
 document.querySelectorAll('[data-about]').forEach(b=>b.addEventListener('click',()=>api.openInfo('about')));
 const root=document.querySelector('#welcome-screen');
 // Native scrolling; a single scheduled update keeps the header and section state in sync.
 if(typeof window.requestAnimationFrame==='function'){
  const header=document.querySelector('.site-header');
  const sections=[...document.querySelectorAll('#zuhause,#rundgang,#einblicke')];
  const progress=root.querySelector('.reading-progress');
  let scheduled=false;
  const update=()=>{
   scheduled=false;const edge=header.getBoundingClientRect().bottom+60;
   const active=sections.find(s=>{const rect=s.getBoundingClientRect();return rect.top<=edge&&rect.bottom>edge;});
   const distance=root.scrollHeight-root.clientHeight;
   const fraction=distance>0?Math.max(0,Math.min(1,root.scrollTop/distance)):0;
   editorialMotion.update();
   if(progress)progress.style.transform='scaleX('+fraction.toFixed(4)+')';
   header.classList.toggle('is-scrolled',root.scrollTop>12);
   document.querySelectorAll('.site-nav a').forEach(a=>{if(active&&a.hash==='#'+active.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
  };
  const schedule=()=>{if(!scheduled){scheduled=true;window.requestAnimationFrame(update);}};
  root.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);
  // Lazy photos, translated copy and orientation changes may alter the reading distance.
  root.addEventListener('load',schedule,true);
  if(window.ResizeObserver){const sizes=new ResizeObserver(schedule);root.querySelectorAll(':scope > div,:scope > section,:scope > footer').forEach(element=>sizes.observe(element));}
  schedule();
 }
}
