import {setupJourney,translateJourney} from './photo-journey.js?v=e0813cbbc0a4';
// Original-photo landing page. Booking remains an explicit outbound link.
import {bookingUrl} from './i18n.js?v=e0813cbbc0a4';
const spaces={living:{photo:5,file:'living-reverse-new',caption:0},bedroom:{photo:13,file:'bedroom-lamp',caption:1},terrace:{photo:11,file:'terrace-seating-wide',caption:2}};
let selectedSpace='terrace';
function updateSpace(api){
 const preview=document.querySelector('#space-preview'),choice=spaces[selectedSpace];
 const photo=preview?.querySelector('button'),img=preview?.querySelector('img');
 if(!img||!photo)return;
 img.src='./photos/'+choice.file+'.jpg';img.alt=api.t('photoNames')[choice.photo];
 photo.dataset.photo=String(choice.photo);photo.ariaLabel=img.alt+' · '+api.t('openPhoto');
 document.querySelector('[data-space-caption]').textContent=api.t('spaceCaptions')[choice.caption];
 document.querySelector('.space-list').ariaLabel=api.t('spaceChoose');
 document.querySelectorAll('[data-space]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.space===selectedSpace)));
}
export function translateLanding(api){
 translateJourney();
 updateSpace(api);
 const lang=api.language();
 document.querySelectorAll('[data-booking]').forEach(a=>{a.href=bookingUrl(lang);a.ariaLabel=a.textContent.trim()+'. '+api.t('newWindow');});
 document.querySelectorAll('[data-photo]').forEach(b=>{const img=b.querySelector('img');const label=img?api.t('photoNames')[Number(b.dataset.photo)]:b.textContent.trim();b.ariaLabel=label+' · '+api.t('openPhoto');if(img)img.alt=api.t('photoNames')[Number(b.dataset.photo)];});
 document.querySelector('.tour-preview button').ariaLabel=api.t('start');
 document.querySelector('.tour-preview img').alt=api.t('previewTitle');
 document.querySelector('.site-nav').ariaLabel=api.t('siteNavigation');
 document.querySelectorAll('[data-site-language]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.siteLanguage===lang)));
}
export function setupLanding(api){
 setupJourney(api);
 document.querySelectorAll('[data-space]').forEach(b=>b.addEventListener('click',()=>{selectedSpace=b.dataset.space;updateSpace(api);}));
 document.querySelectorAll('[data-gallery-index]').forEach(b=>b.addEventListener('click',()=>api.gallery(Number(b.dataset.galleryIndex))));
 document.querySelectorAll('[data-photo]').forEach(b=>b.addEventListener('click',()=>api.gallery(Number(b.dataset.photo))));
 document.querySelectorAll('[data-site-language]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.siteLanguage!==api.language())api.changeLanguage(b.dataset.siteLanguage);}));
 document.querySelectorAll('[data-about]').forEach(b=>b.addEventListener('click',()=>api.openInfo('about')));
 const root=document.querySelector('#welcome-screen');
 // Native scrolling; a single scheduled update keeps the header and section state in sync.
 if(typeof window.requestAnimationFrame==='function'){
  const header=document.querySelector('.site-header');
  const sections=[...document.querySelectorAll('#zuhause,#rundgang,#einblicke')];
  let scheduled=false;
  const update=()=>{
   scheduled=false;const edge=header.getBoundingClientRect().bottom+60;
   const active=sections.find(s=>{const rect=s.getBoundingClientRect();return rect.top<=edge&&rect.bottom>edge;});
   header.classList.toggle('is-scrolled',root.scrollTop>12);
   document.querySelectorAll('.site-nav a').forEach(a=>{if(active&&a.hash==='#'+active.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
  };
  const schedule=()=>{if(!scheduled){scheduled=true;window.requestAnimationFrame(update);}};
  root.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);schedule();
 }
}
