import * as THREE from 'three';

// A lightweight static sky, aligned with the afternoon sun. No scenery is invented.
// Geometry sits behind the house; the real covered part of the terrace stays covered.
export function addSky(scene){
 const sky=new THREE.Mesh(new THREE.SphereGeometry(54,32,16),new THREE.ShaderMaterial({
  side:THREE.BackSide,depthWrite:false,fog:false,
  uniforms:{zenith:{value:new THREE.Color('#5c9dce')},horizon:{value:new THREE.Color('#dee9ec')},sunDirection:{value:new THREE.Vector3(7,4.8,4).normalize()}},
  vertexShader:`varying vec3 direction;void main(){direction=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
  fragmentShader:`
   uniform vec3 zenith,horizon,sunDirection;varying vec3 direction;
   float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
   float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
   void main(){
    vec3 d=normalize(direction);float elevation=max(d.y,0.);
    vec3 color=mix(horizon,zenith,pow(elevation,.48));
    vec2 p=d.xz/(max(d.y,.12)+.3)*3.;
    float n=noise(p)*.56+noise(p*2.03+7.)*.28+noise(p*4.11)*.16;
    float cloud=smoothstep(.56,.8,n)*smoothstep(.06,.27,d.y)*.32;
    color=mix(color,vec3(.91,.92,.91),cloud);
    float glow=pow(max(dot(d,sunDirection),0.),24.);
    color+=vec3(.23,.17,.09)*glow;
    gl_FragColor=vec4(color,1.);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
   }`
 }));
 sky.name='Afternoon sky';sky.renderOrder=-10;scene.add(sky);return sky;
}
