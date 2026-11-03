// Deliberately approximate walkable areas. Furniture footprints include a body margin.
export const spots = {
 living:{position:[-.25,1.48,2.05],target:[.23,1.15,-1.15]},
 kitchen:{position:[1.18,1.52,-1.52],target:[-.15,1.02,-2.15]},
 bedroom:{position:[1.25,3.18,.80],target:[-.30,2.78,1.75]},
 terrace:{position:[3.18,1.52,1.42],target:[3.28,1.0,-1.72]}
};
const inRect=(x,z,[a,b,c,d])=>x>a&&x<b&&z>c&&z<d;
const groundObstacles=[[-.62,1.08,-1.28,-.34],[-.35,.91,-.46,.14],[-1.78,-.65,-1.62,.47],[.69,1.78,.26,2.28],[-1.7,-.7,1.96,2.5],[-.83,-.43,.25,.61],[-1.46,-.9,.29,.79],[-1.8,-1.34,.69,2.02],[-1.65,1.7,-2.5,-1.72],[2.04,3.83,-2.5,-1.37],[3.55,4.58,-1.78,.18],[2.60,3.29,-1.49,-.82],[4.25,4.72,.35,1.18]];
export function canOccupy(x,z,level='ground'){
 if(level==='loft') return inRect(x,z,[-1.54,1.58,.66,2.26])&&!inRect(x,z,[-1.18,.59,.45,2.54])&&!inRect(x,z,[.81,1.48,1.71,2.37]);
 const inside=inRect(x,z,[-1.57,1.57,-2.23,2.27]);
 const threshold=inRect(x,z,[1.37,2.24,-1.57,-.24]);
 const patio=inRect(x,z,[2.04,4.58,-2.26,2.26]);
 return (inside||threshold||patio)&&!groundObstacles.some(r=>inRect(x,z,r));
}
export function movePosition(position,dx,dz,level){
 const p=[...position];
 // Substeps prevent a long frame or a held key from crossing a thin wall.
 const count=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.045));
 for(let i=0;i<count;i++){
  if(canOccupy(p[0]+dx/count,p[2],level))p[0]+=dx/count;
  if(canOccupy(p[0],p[2]+dz/count,level))p[2]+=dz/count;
 }
 return p;
}
