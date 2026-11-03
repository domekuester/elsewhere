// Original-photo landing page. Booking remains an explicit outbound link.
import {bookingUrl} from './i18n.js?v=810e0b0cecca';
export function translateLanding(api){
 const lang=api.language();
 document.querySelectorAll('[data-booking]').forEach(a=>{a.href=bookingUrl(lang);a.ariaLabel=a.textContent.trim()+'. '+api.t('newWindow');});
 document.querySelectorAll('[data-photo]').forEach(b=>{const img=b.querySelector('img');const label=img?api.t('photoNames')[Number(b.dataset.photo)]:b.textContent.trim();b.ariaLabel=label+' · '+api.t('openPhoto');if(img)img.alt=api.t('photoNames')[Number(b.dataset.photo)];});
 document.querySelector('.tour-preview button').ariaLabel=api.t('start');
 document.querySelector('.tour-preview img').alt=api.t('previewTitle');
 document.querySelector('.site-nav').ariaLabel=api.t('siteNavigation');
 document.querySelectorAll('[data-site-language]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.siteLanguage===lang)));
}
export function setupLanding(api){
 document.querySelectorAll('[data-gallery-index]').forEach(b=>b.addEventListener('click',()=>api.gallery(Number(b.dataset.galleryIndex))));
 document.querySelectorAll('[data-photo]').forEach(b=>b.addEventListener('click',()=>api.gallery(Number(b.dataset.photo))));
 document.querySelectorAll('[data-site-language]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.siteLanguage!==api.language())api.changeLanguage(b.dataset.siteLanguage);}));
 document.querySelectorAll('[data-about]').forEach(b=>b.addEventListener('click',()=>api.openInfo('about')));
 const root=document.querySelector('#welcome-screen');
 const sections=[...document.querySelectorAll('#zuhause,#rundgang,#einblicke')];
 if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){document.querySelectorAll('.site-nav a').forEach(a=>{if(a.hash==='#'+entry.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}},{root,rootMargin:'-15% 0px -55% 0px'});sections.forEach(s=>observer.observe(s));}
}
