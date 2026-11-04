// A real photograph briefly opens into its reconstructed room. No camera flight.
export function createPhotoOpening(doc,preference){
 let current=null;
 function stop(){
  const run=current;current=null;if(!run)return;
  for(const animation of run.animations)animation.cancel();
  run.node.remove();
 }
 function show(source){
  stop();
  const win=doc.defaultView,rect=source?.rect;
  if(preference.matches||doc.hidden||!rect||!source.src||!doc.createElement)return false;
  const w=win?.innerWidth,h=win?.innerHeight,iw=source.width,ih=source.height;
  if(![w,h,iw,ih,rect.width,rect.height,rect.left,rect.top].every(Number.isFinite)||Math.min(w,h,iw,ih,rect.width,rect.height)<=0)return false;
  const left=Math.max(0,rect.left),top=Math.max(0,rect.top),right=Math.min(w,rect.left+rect.width),bottom=Math.min(h,rect.top+rect.height);
  if(Math.max(0,right-left)*Math.max(0,bottom-top)<rect.width*rect.height*.2)return false;
  const node=doc.createElement('div'),img=doc.createElement('img');
  node.className='photo-opening';node.setAttribute('aria-hidden','true');
  img.alt='';img.src=source.src;img.style.objectPosition=source.position||'50% 50%';node.append(img);
  doc.body.append(node);
  if(!node.animate||!img.animate){node.remove();return false;}
  // Uniform image scaling preserves the photograph's proportions throughout.
  const fullScale=Math.max(w/iw,h/ih);
  img.style.width=iw*fullScale+'px';img.style.height=ih*fullScale+'px';
  const scale=Math.max(rect.width/iw,rect.height/ih)/fullScale;
  const dx=rect.left+rect.width/2-w/2,dy=rect.top+rect.height/2-h/2;
  const run={node,animations:[]};current=run;
  try{
   run.animations.push(node.animate([
    {clipPath:`inset(${top}px ${w-right}px ${h-bottom}px ${left}px)`,opacity:1,offset:0},
    {clipPath:'inset(0px 0px 0px 0px)',opacity:1,offset:.68},
    {clipPath:'inset(0px 0px 0px 0px)',opacity:0,offset:1}
   ],{duration:720,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'}));
   run.animations.push(img.animate([
    {transform:`translate(-50%,-50%) translate(${dx}px,${dy}px) scale(${scale})`},
    {transform:'translate(-50%,-50%) translate(0px,0px) scale(1)'}
   ],{duration:490,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'}));
   void Promise.all(run.animations.map(animation=>animation.finished.catch(()=>{}))).then(()=>{
    if(current===run)stop();
   });
   return true;
  }catch{stop();return false;}
 }
 return {show,stop};
}
