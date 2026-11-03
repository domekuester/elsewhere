// Pointer ownership stays separate: one thumb may walk while the other looks.
export class TourGestures {
 constructor(){this.reset();}
 reset(){this.lookPointer=null;this.movePointer=null;this.movement={forward:0,side:0};this.offset={x:0,y:0};}
 beginLook(id,x,y){if(this.lookPointer!==null)return false;this.lookPointer=id;this.lookPoint={x,y};return true;}
 look(id,x,y,width,fov){
  if(this.lookPointer!==id)return null;
  const sensitivity=(fov*Math.PI/180)/Math.max(320,width)*.9;
  const clamp=v=>Math.max(-.3,Math.min(.3,v));
  const result={yaw:clamp(-(x-this.lookPoint.x)*sensitivity)||0,pitch:clamp(-(y-this.lookPoint.y)*sensitivity)||0};
  this.lookPoint={x,y};return result;
 }
 endLook(id){if(this.lookPointer!==id)return false;this.lookPointer=null;return true;}
 beginMove(id,x,y,radius){if(this.movePointer!==null)return false;this.movePointer=id;this.origin={x,y};this.radius=Math.max(1,radius);return true;}
 move(id,x,y){
  if(this.movePointer!==id)return false;
  const dx=x-this.origin.x,dy=y-this.origin.y,length=Math.hypot(dx,dy),distance=Math.min(length/this.radius,1);
  const speed=Math.max(0,(distance-.15)/.85);
  this.offset=length?{x:dx/length*distance*this.radius,y:dy/length*distance*this.radius}:{x:0,y:0};
  this.movement=speed?{forward:-dy/length*speed,side:dx/length*speed}:{forward:0,side:0};return true;
 }
 endMove(id){if(this.movePointer!==id)return false;this.movePointer=null;this.movement={forward:0,side:0};this.offset={x:0,y:0};return true;}
}
