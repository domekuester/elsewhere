import {addSky} from './sky.js?v=1d11232b9f40';
import * as THREE from 'three';
import {RectAreaLightUniformsLib} from 'three/addons/lights/RectAreaLightUniformsLib.js';

// Warm afternoon lighting is an artistic presentation, not a measured sun study.
// Window positions and the existing bedside lamp are retained. Window light
// carries the form; low room fill preserves the shaded corners in the photos.
export function addDaylight(scene){
 RectAreaLightUniformsLib.init();
 scene.background=new THREE.Color('#b5d3e5');
 scene.fog=new THREE.Fog('#d7e4e8',24,55);
 addSky(scene);
 scene.add(new THREE.HemisphereLight('#d3e4ed','#aa9b87',.34));
 const sun=new THREE.DirectionalLight('#fff3df',2.45);
 sun.position.set(7,4.8,3.6);sun.target.position.set(0,0,-.4);sun.castShadow=true;
 sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-6,right:6,top:6,bottom:-6,near:.5,far:24});
 sun.shadow.normalBias=.008;sun.shadow.bias=-.00015;sun.shadow.radius=4.0;
 scene.add(sun,sun.target);
 for(const [z,y,width,height,strength] of [[-.92,1.18,1.65,1.95,3.5],[1.22,1.58,1.55,1.0,3.9]]){
  const light=new THREE.RectAreaLight('#f2f5f5',strength,width,height);
  light.position.set(1.70,y,z);light.lookAt(-1.5,y-.25,z+.2);scene.add(light);
 }
 // Approximate warm diffuse bounce from the timber floor, deliberately low energy.
 const bounce=new THREE.RectAreaLight('#e5d6c0',.28,2.6,3.3);
 bounce.position.set(0,.08,-.3);bounce.lookAt(0,2,-.3);scene.add(bounce);
 const loftFill=new THREE.RectAreaLight('#f5f1e8',.85,1.8,1.4);
 loftFill.position.set(.3,3.75,.48);loftFill.lookAt(0,2.3,1.7);scene.add(loftFill);
 // Light from the already modeled bedside lamp; no extra shadow cubemap.
 const bedside=new THREE.PointLight('#ffe0b5',1.9,2.4,2);
 bedside.position.set(1.15,3.28,2.02);scene.add(bedside);
 return sun;
}

export {refineSurfaces} from './surfaces.js?v=1d11232b9f40';
