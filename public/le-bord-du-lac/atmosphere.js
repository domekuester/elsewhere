import {addSky} from './sky.js?v=600dd3c2c649';
import * as THREE from 'three';
import {RectAreaLightUniformsLib} from 'three/addons/lights/RectAreaLightUniformsLib.js';

// Warm afternoon lighting is an artistic presentation, not a measured sun study.
// Window positions and the existing bedside lamp are retained.
export function addDaylight(scene){
 RectAreaLightUniformsLib.init();
 scene.background=new THREE.Color('#b5d3e5');
 scene.fog=new THREE.Fog('#d7e4e8',24,55);
 addSky(scene);
 scene.add(new THREE.HemisphereLight('#cce3f3','#bca17f',.48));
 const sun=new THREE.DirectionalLight('#fff0d8',2.65);
 sun.position.set(7,4.8,3.6);sun.target.position.set(0,0,-.4);sun.castShadow=true;
 sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-6,right:6,top:6,bottom:-6,near:.5,far:24});
 sun.shadow.normalBias=.008;sun.shadow.bias=-.00015;sun.shadow.radius=4.0;
 scene.add(sun,sun.target);
 for(const [z,y,width,height,strength] of [[-.92,1.18,1.65,1.95,3.1],[1.22,1.58,1.55,1.0,3.4]]){
  const light=new THREE.RectAreaLight('#f5f4ee',strength,width,height);
  light.position.set(1.70,y,z);light.lookAt(-1.5,y-.25,z+.2);scene.add(light);
 }
 // Approximate warm diffuse bounce from the timber floor, deliberately low energy.
 const bounce=new THREE.RectAreaLight('#f5d9b5',.55,2.6,3.3);
 bounce.position.set(0,.08,-.3);bounce.lookAt(0,2,-.3);scene.add(bounce);
 const loftFill=new THREE.RectAreaLight('#fff0dd',1.15,1.8,1.4);
 loftFill.position.set(.3,3.75,.48);loftFill.lookAt(0,2.3,1.7);scene.add(loftFill);
 // Light from the already modeled bedside lamp; no extra shadow cubemap.
 const bedside=new THREE.PointLight('#ffc084',1.65,2.4,2);
 bedside.position.set(1.15,3.28,2.02);scene.add(bedside);
 return sun;
}

export {refineSurfaces} from './surfaces.js?v=600dd3c2c649';
