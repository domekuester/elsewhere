// A short acceleration/deceleration ramp; no head bob, forced pan or camera tilt.
export function advanceWalking(previous,forward,side,dt,reducedMotion=false){
 const length=Math.hypot(forward,side);
 if(length>1){forward/=length;side/=length;}
 const alpha=reducedMotion?1:1-Math.exp(-14*Math.max(0,Math.min(dt,.05)));
 const next={forward:previous.forward+(forward-previous.forward)*alpha,side:previous.side+(side-previous.side)*alpha};
 if(Math.abs(next.forward)<.002)next.forward=0;
 if(Math.abs(next.side)<.002)next.side=0;
 return next;
}
