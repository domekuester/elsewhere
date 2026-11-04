// Own each transition explicitly: cancelled work must never move the camera,
// steal focus, or remove the visual state belonging to a newer room request.
export function createRoomTransition({conceal,reveal,commit,allowed,cleanup}){
 let active=null;
 function finish(run){
  if(active!==run)return;
  active=null;
  cleanup();
 }
 function cancel(){
  const run=active;if(!run)return;
  run.controller.abort();
  finish(run);
 }
 async function stage(action,signal){
  if(signal.aborted)return false;
  let stop;
  const cancelled=new Promise(resolve=>{
   stop=()=>resolve(false);signal.addEventListener('abort',stop,{once:true});
  });
  try{
   // Settle cancellation even if a visual adapter does not settle its own
   // promise. Promise.race also observes any later rejection from that adapter.
   return await Promise.race([Promise.resolve(action(signal)).then(()=>true),cancelled]);
  }finally{signal.removeEventListener('abort',stop);}
 }
 async function go(name,{instant=false}={}){
  cancel();
  if(!allowed())return false;
  const run={controller:new AbortController()};active=run;
  const signal=run.controller.signal;
  try{
   if(!instant&&!await stage(conceal,signal))return false;
   if(active!==run||signal.aborted||!allowed())return false;
   commit(name);
   if(!instant&&!await stage(reveal,signal))return false;
   return active===run&&!signal.aborted;
  }catch(error){
   if(signal.aborted)return false;
   throw error;
  }finally{finish(run);}
 }
 return {go,cancel,get busy(){return active!==null;}};
}
