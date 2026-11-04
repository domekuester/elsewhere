import {setupLanding,translateLanding} from './landing.js?v=eab064138910';
// Guest-facing UI state. The scene remains in app.js; no storage or remote calls.
export {copy as experienceCopy} from './copy.js?v=eab064138910';
let started=false,immersive=false,hasShownCoach=false,available=false,failed=false,api,landingApi;
let requested=false,loading=false,attempted=false,lastLaunch=null,pendingEntry=null;
const $=s=>document.querySelector(s);
const fadingUI='.topbar,.room-label,.map-panel,.movement,.room-nav,.footbar,#help,#fullscreen,#stair-action';
export const isExploring=()=>started;
export function dismissCoach(){$('#coach').hidden=true;}
function focusMode(value){
 api.cancelNavigation?.();api.releaseInput();immersive=value;document.body.classList.toggle('immersive',value);
 document.querySelectorAll(fadingUI).forEach(e=>e.inert=value);
 $('#focus-view').setAttribute('aria-pressed',String(value));translateExperience();dismissCoach();
}
const photoRooms=new Set(['living','kitchen','bedroom','terrace']);
const copyRect=rect=>rect?Object.fromEntries(['x','y','left','top','right','bottom','width','height'].filter(key=>typeof rect[key]==='number').map(key=>[key,rect[key]])):null;
const entryState=()=>({loading,requested,failed,available});
function requestEntry(trigger,entry=null){
 if(failed||started)return false;
 lastLaunch=trigger||$('#welcome-start');pendingEntry=entry;
 if(available){enter();return true;}
 if(attempted){if(loading){requested=true;translateExperience();return true;}return false;}
 attempted=true;requested=true;loading=true;translateExperience();api.prepare();return true;
}
function requestEnter(event){requestEntry(event.currentTarget);}
function enterFromPhoto({room,source,trigger}={}){
 if(!photoRooms.has(room))return false;
 const snapshot=source?{src:source.src,position:source.position,width:Number.isFinite(source.width)&&source.width>0?source.width:undefined,height:Number.isFinite(source.height)&&source.height>0?source.height:undefined,rect:copyRect(source.rect),element:source.element}:null;
 return requestEntry(trigger,{room,source:snapshot});
}
function cancelEntry(){requested=false;pendingEntry=null;translateExperience();}
function enter(){
 if(!available)return;
 // The photograph can move while the model loads. Measure before hiding it,
 // while preserving the original photo and destination chosen by the guest.
 const entry=pendingEntry;pendingEntry=null;
 if(entry?.source){
  const {element}=entry.source;
  if(element?.getBoundingClientRect)entry.source.rect=copyRect(element.getBoundingClientRect());
  delete entry.source.element;
 }
 requested=false;started=true;$('#welcome-screen').hidden=true;$('#tour').inert=false;document.body.dataset.mode='tour';api.setSceneActive(true);
 api.releaseInput();$('#view').focus({preventScroll:true});
 if(!hasShownCoach){$('#coach').hidden=false;hasShownCoach=true;}
 api.onEnter?.(entry);
}
async function welcome(){
 api.cancelNavigation?.();
 if(document.fullscreenElement)try{await document.exitFullscreen();}catch{}
 api.releaseInput();focusMode(false);started=false;api.setSceneActive(false);document.body.dataset.mode='welcome';$('#tour').inert=true;$('#welcome-screen').hidden=false;dismissCoach();(lastLaunch||$('#welcome-start')).focus({preventScroll:true});
}
export function translateExperience(){
 if(!api)return;const t=api.t;
 const status=t(failed?'entryError':available?'prepared':loading?'preparing':'tourHint');
 $('#welcome-status').textContent=status;
 if(typeof matchMedia==='function')$('#coach p').textContent=t(matchMedia('(pointer:coarse), (max-width:900px)').matches?'coachTouch':'coachText');
 document.querySelectorAll('[data-start-tour]').forEach(b=>{b.disabled=failed||(loading&&requested);b.setAttribute('aria-busy',String(loading));});
 document.querySelectorAll('[data-start-label]').forEach(e=>e.textContent=t(loading?'preparingShort':'start'));
 $('#welcome-cancel').hidden=!requested;
 document.querySelectorAll('[data-cancel-loading]').forEach(b=>b.hidden=!requested);
 document.querySelectorAll('.secondary-tour-status').forEach(e=>{e.hidden=!loading&&!failed;e.textContent=status;});
 translateLanding(landingApi||api);
 $('#focus-view').ariaLabel=$('#focus-view').title=t(immersive?'showControls':'freeView');$('#focus-label').textContent=t(immersive?'showControls':'freeView');
 $('#photos').ariaLabel=t('photos');$('.book').ariaLabel=t('book')+'. '+t('newWindow');$('#help').ariaLabel=t('help');
 $('#return-welcome').ariaLabel=t('backWelcome');$('#map-toggle').ariaLabel=t('map');
 $('#tour').ariaLabel=t('tourLabel');$('#view').ariaLabel=t('viewLabel');
 $('.welcome-image img').alt=t('heroAlt');$('.map-panel').ariaLabel=t('planLabel');
 $('.direction-pad').ariaLabel=t('move');$('.room-nav').ariaLabel=t('roomNavigation');
 $('#gallery').ariaLabel=t('galleryLabel');

}
export function tourReady(){available=true;loading=false;failed=false;$('#welcome-retry').hidden=true;translateExperience();if(requested)enter();}
export function tourFailed(){available=false;loading=false;requested=false;pendingEntry=null;failed=true;$('#welcome-retry').hidden=false;translateExperience();}
export function setupExperience(callbacks){
 api=callbacks;
 document.querySelectorAll('[data-start-tour]').forEach(b=>b.addEventListener('click',requestEnter));
 $('#welcome-cancel').addEventListener('click',cancelEntry);
 document.querySelectorAll('[data-cancel-loading]').forEach(b=>b.addEventListener('click',cancelEntry));
 landingApi={...api,enterFromPhoto,cancelTourEntry:cancelEntry,entryState,
  gallery:(index)=>{cancelEntry();api.gallery(index);},
  openInfo:(mode)=>{cancelEntry();api.openInfo(mode);}
 };
 setupLanding(landingApi);
 $('#return-welcome').addEventListener('click',welcome);
 $('#welcome-gallery').addEventListener('click',landingApi.gallery);
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
 return landingApi;
}
