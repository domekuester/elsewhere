// One owner for animation scheduling; a stopped scene has no pending frame.
export class FrameLoop {
 constructor(step,request,cancel){this.step=step;this.request=request;this.cancel=cancel;this.active=false;this.pending=null;}
 start(){if(this.active)return;this.active=true;this.schedule();}
 stop(){this.active=false;if(this.pending!==null)this.cancel(this.pending);this.pending=null;}
 schedule(){this.pending=this.request(now=>{this.pending=null;if(!this.active)return;this.step(now);if(this.active)this.schedule();});}
}
