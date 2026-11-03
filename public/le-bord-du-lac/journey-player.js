// A deliberate, finite slideshow: manual input and loss of visibility always pause.
export class JourneyPlayer {
 constructor({count,onChange,schedule=(fn,ms)=>setTimeout(fn,ms),cancel=id=>clearTimeout(id),delay=7000}) {
  this.count=count;this.onChange=onChange;this.schedule=schedule;this.cancel=cancel;this.delay=delay;
  this.index=0;this.playing=false;this.visible=true;this.ready=true;this.timer=null;
 }
 clear(){if(this.timer!==null)this.cancel(this.timer);this.timer=null;}
 arm(){this.clear();if(this.playing&&this.visible&&this.ready)this.timer=this.schedule(()=>{
  this.timer=null;
  if(this.index===this.count-1){this.pause();return;}
  this.index++;this.emit();
 },this.delay);}
 emit(){this.onChange({index:this.index,playing:this.playing});this.arm();}
 start(){if(!this.visible)return;if(this.index===this.count-1)this.index=0;this.playing=true;this.emit();}
 pause(){this.playing=false;this.emit();}
 select(index){this.playing=false;this.index=Math.max(0,Math.min(this.count-1,index));this.emit();}
 setReady(ready){this.ready=ready;this.arm();}
 setVisible(visible){this.visible=visible;if(!visible)this.pause();}
}
