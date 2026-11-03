import {landingCopy,setupLanding,translateLanding} from './landing.js';
// Guest-facing UI state. The scene remains in app.js; no storage or remote calls.
export const experienceCopy={
 de:{welcomeTitle:'Einfach\nankommen.',welcomeHost:'Willkommen bei Jean Pierre.',welcomeText:'Entdeckt Le bord du lac in eurem eigenen Tempo. Schaut euch um und findet euren Lieblingsplatz.',start:'Rundgang starten',seePhotos:'Erst die Fotos ansehen',preparing:'Der Rundgang wird vorbereitet …',prepared:'Bereit, wenn ihr es seid.',entryNote:'3D-Entwurf nach Fotos · Maße geschätzt',entryPhoto:'Ein Blick in die Unterkunft',freeView:'Freier Blick',showControls:'Bedienung zeigen',move:'Bewegen',help:'So geht’s',map:'Grundriss',coachTitle:'Schaut euch in Ruhe um.',coachText:'Zieht über das Bild zum Umschauen. Mit den Pfeilen bewegt ihr euch; unten wechselt ihr den Bereich.',dismiss:'Verstanden',backWelcome:'Zur Begrüßung',entryError:'Die 3D-Ansicht ist gerade nicht verfügbar. Die Originalfotos könnt ihr trotzdem ansehen.',newWindow:'Öffnet Booking.com in einem neuen Tab.',draft:'3D-Entwurf · Details',reset:'Zum Ausgangspunkt',ground:'Erdgeschoss',loft:'Schlafebene',outside:'Außenbereich'},
 fr:{welcomeTitle:'Prenez\nle temps.',welcomeHost:'Bienvenue chez Jean Pierre.',welcomeText:'Découvrez Le bord du lac à votre rythme. Regardez autour de vous et trouvez votre coin préféré.',start:'Commencer la visite',seePhotos:'Voir d’abord les photos',preparing:'La visite se prépare…',prepared:'Tout est prêt pour vous.',entryNote:'Ébauche 3D d’après photos · Dimensions estimées',entryPhoto:'Un aperçu du logement',freeView:'Vue dégagée',showControls:'Afficher les commandes',move:'Avancer',help:'Mode d’emploi',map:'Le plan',coachTitle:'Prenez le temps de regarder.',coachText:'Glissez sur l’image pour regarder autour de vous. Les flèches permettent d’avancer ; les espaces se choisissent en bas.',dismiss:'Compris',backWelcome:'Revenir à l’accueil',entryError:'La visite 3D est indisponible pour le moment. Les photos originales restent accessibles.',newWindow:'Ouvre Booking.com dans un nouvel onglet.',draft:'Ébauche 3D · Détails',reset:'Au point de départ',ground:'Rez-de-chaussée',loft:'Mezzanine',outside:'À l’extérieur'}
};
Object.assign(experienceCopy.de,landingCopy.de);Object.assign(experienceCopy.fr,landingCopy.fr);
let started=false,immersive=false,hasShownCoach=false,available=false,failed=false,api;
let requested=false,loading=false,attempted=false,lastLaunch=null;
const $=s=>document.querySelector(s);
const fadingUI='.topbar,.room-label,.map-panel,.movement,.room-nav,.footbar,#help,#fullscreen,#stair-action';
export const isExploring=()=>started;
export function dismissCoach(){$('#coach').hidden=true;}
function focusMode(value){
 immersive=value;document.body.classList.toggle('immersive',value);
 document.querySelectorAll(fadingUI).forEach(e=>e.inert=value);
 $('#focus-view').setAttribute('aria-pressed',String(value));translateExperience();dismissCoach();
}
function requestEnter(event){
 lastLaunch=event.currentTarget;
 if(available){enter();return;}
 if(attempted){if(loading){requested=true;translateExperience();}return;}
 attempted=true;requested=true;loading=true;translateExperience();api.prepare();
}
function cancelEntry(){requested=false;translateExperience();}
function enter(){
 if(!available)return;requested=false;started=true;$('#welcome-screen').hidden=true;$('#tour').inert=false;document.body.dataset.mode='tour';
 api.releaseInput();$('#view').focus({preventScroll:true});
 if(!hasShownCoach){$('#coach').hidden=false;hasShownCoach=true;}
}
async function welcome(){
 if(document.fullscreenElement)try{await document.exitFullscreen();}catch{}
 api.releaseInput();focusMode(false);started=false;document.body.dataset.mode='welcome';$('#tour').inert=true;$('#welcome-screen').hidden=false;dismissCoach();(lastLaunch||$('#welcome-start')).focus({preventScroll:true});
}
export function translateExperience(){
 if(!api)return;const t=api.t;
 $('#welcome-language').textContent=api.language()==='de'?'FR':'DE';$('#welcome-language').ariaLabel=api.language()==='de'?'Passer en français':'Auf Deutsch wechseln';
 const status=t(failed?'entryError':available?'prepared':loading?'preparing':'tourHint');
 $('#welcome-status').textContent=status;
 document.querySelectorAll('[data-start-tour]').forEach(b=>{b.disabled=failed||(loading&&requested);b.setAttribute('aria-busy',String(loading));});
 document.querySelectorAll('[data-start-label]').forEach(e=>e.textContent=t(loading?'preparingShort':'start'));
 $('#welcome-cancel').hidden=!requested;
 document.querySelectorAll('[data-cancel-loading]').forEach(b=>b.hidden=!requested);
 document.querySelectorAll('.secondary-tour-status').forEach(e=>{e.hidden=!loading&&!failed;e.textContent=status;});
 translateLanding(api);
 $('#focus-view').ariaLabel=$('#focus-view').title=t(immersive?'showControls':'freeView');$('#focus-label').textContent=t(immersive?'showControls':'freeView');
 $('#photos').ariaLabel=t('photos');$('.book').ariaLabel=t('book')+'. '+t('newWindow');$('#help').ariaLabel=t('help');
 $('#return-welcome').ariaLabel=t('backWelcome');$('#map-toggle').ariaLabel=t('map');
 $('#tour').ariaLabel=api.language()==='de'?'Interaktiver 3D-Rundgang':'Visite 3D interactive';
 $('#view').ariaLabel=api.language()==='de'?'3D-Ansicht. Ziehen zum Umschauen. Pfeiltasten oder W A S D zum Gehen.':'Vue 3D. Glisser pour regarder. Flèches ou W A S D pour avancer.';
 $('.welcome-image img').alt=api.language()==='de'?'Wohnbereich von Le bord du lac mit Küche, Holztreppe und Sofa':'Salon de Le bord du lac, avec cuisine, escalier en bois et canapé';
 $('.map-panel').ariaLabel=api.language()==='de'?'Schematischer Grundriss':'Plan schématique';
 $('.direction-pad').ariaLabel=t('move');$('.room-nav').ariaLabel=api.language()==='de'?'Bereich auswählen':'Choisir un espace';
 $('#gallery').ariaLabel=api.language()==='de'?'Originalfotos der Unterkunft':'Photos originales du logement';
}
export function tourReady(){available=true;loading=false;failed=false;$('#welcome-retry').hidden=true;translateExperience();if(requested)enter();}
export function tourFailed(){available=false;loading=false;requested=false;failed=true;$('#welcome-retry').hidden=false;translateExperience();}
export function setupExperience(callbacks){
 api=callbacks;
 document.querySelectorAll('[data-start-tour]').forEach(b=>b.addEventListener('click',requestEnter));
 $('#welcome-cancel').addEventListener('click',cancelEntry);
 document.querySelectorAll('[data-cancel-loading]').forEach(b=>b.addEventListener('click',cancelEntry));
 const landingApi={...api,
  gallery:(index)=>{cancelEntry();api.gallery(index);},
  openInfo:(mode)=>{cancelEntry();api.openInfo(mode);}
 };
 setupLanding(landingApi);
 $('#return-welcome').addEventListener('click',welcome);
 $('#welcome-gallery').addEventListener('click',landingApi.gallery);
 $('#welcome-language').addEventListener('click',api.changeLanguage);
 $('#welcome-about').addEventListener('click',()=>landingApi.openInfo('about'));
 $('#welcome-retry').addEventListener('click',()=>location.reload());
 $('#focus-view').addEventListener('click',()=>focusMode(!immersive));
 $('#dismiss-coach').addEventListener('click',()=>{dismissCoach();$('#view').focus({preventScroll:true});});
 $('#view').addEventListener('pointerdown',dismissCoach);
 document.querySelectorAll('[data-move],[data-room]').forEach(b=>b.addEventListener('pointerdown',dismissCoach));
 document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&immersive&&!$('dialog[open]')){focusMode(false);$('#focus-view').focus();}
  if(started&&['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d'].includes(e.key))dismissCoach();
 });
 $('#tour').inert=true;document.body.dataset.mode='welcome';
}
