import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';

// Visualization geometry only; not an engineering CAD model or a performance claim.
const renderer = new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(1.5); renderer.setSize(innerWidth,innerHeight);
renderer.setClearColor(0x000000,0); renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
document.body.appendChild(renderer.domElement);
const scene=new THREE.Scene();
const pmrem=new THREE.PMREMGenerator(renderer);scene.environment=pmrem.fromScene(new RoomEnvironment(),.04).texture;
scene.add(new THREE.HemisphereLight(0xffffff,0x707079,2.3));
for(const [color,power,x,y,z] of [[0xffffff,70,90,140,150],[0xf8eee5,45,-110,30,90],[0xffffff,85,40,80,-140]]){
 const light=new THREE.DirectionalLight(color,power/25);light.position.set(x,y,z);scene.add(light);
}
const camera=new THREE.OrthographicCamera(-135,135,150,-150,.1,2000);
camera.position.set(300,145,500);camera.lookAt(0,-43,0);
let subject;
const palettes={champagne:{body:0xded8cb,metal:0xa89d8b},graphite:{body:0x35383f,metal:0x777c87},pearl:{body:0xe9e8e3,metal:0xb8b9b6},rose:{body:0xc49d97,metal:0xa87972}};
function surface(color,metalness=.4,roughness=.28){return new THREE.MeshPhysicalMaterial({color,metalness,roughness,clearcoat:.35,clearcoatRoughness:.35,envMapIntensity:1.15});}
const dark=surface(0x191b1d,.3,.48),rubber=surface(0x484747,.05,.75);
function add(group,geometry,mat,x=0,y=0,z=0){const m=new THREE.Mesh(geometry,mat);m.position.set(x,y,z);group.add(m);return m;}
function lathe(points,mat){return new THREE.Mesh(new THREE.LatheGeometry(points.map(p=>new THREE.Vector2(...p)),128),mat);}
function tube(group,r,len,mat,x,y,z,axis='y'){
 const m=add(group,new THREE.CylinderGeometry(r,r,len,128,1),mat,x,y,z);if(axis==='x')m.rotation.z=-Math.PI/2;if(axis==='z')m.rotation.x=Math.PI/2;return m;
}
function ring(group,r,thick,mat,x,y,z,axis='x'){
 const m=add(group,new THREE.TorusGeometry(r,thick,12,128),mat,x,y,z);if(axis==='x')m.rotation.y=Math.PI/2;if(axis==='y')m.rotation.x=Math.PI/2;return m;
}
function label(group,text,x,y,z,w,h,color='#77736c'){
 const c=document.createElement('canvas');c.width=1024;c.height=256;const ctx=c.getContext('2d');ctx.clearRect(0,0,1024,256);ctx.fillStyle=color;ctx.textAlign='center';ctx.font='500 86px Arial';ctx.fillText(text,512,150);
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;
 return add(group,new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:t,transparent:true,depthWrite:false}),x,y,z);
}
function dryer(finish='champagne',cord=true){
 const p=palettes[finish],shell=surface(p.body,.42,.27),metal=surface(p.metal,.85,.24),g=new THREE.Group();
 // Softly rounded short barrel; conventional T silhouette, narrow grip.
 const head=lathe([[0,-58],[25.5,-58],[28,-57],[29,-55],[29,48],[28.7,51],[27.5,53],[0,53]],shell);head.rotation.z=-Math.PI/2;head.position.y=43;g.add(head);
 tube(g,29,2.2,metal,-55.5,43,0,'x');ring(g,28.1,.8,metal,53.2,43,0);
 tube(g,26.8,2.1,dark,53.7,43,0,'x');
 for(let i=0;i<56;i++){let a=i*Math.PI*2/56;const b=add(g,new THREE.BoxGeometry(2.1,11,.65),metal,55,43+21*Math.cos(a),21*Math.sin(a));b.rotation.x=a;}
 tube(g,15.5,1.6,metal,56,43,0,'x');ring(g,15.4,.32,metal,57,43,0);
 const grip=lathe([[0,-141],[11,-141],[12.4,-139],[12.8,-135],[13,-111],[13.3,-16],[14,-2],[16,12],[18,17],[0,18]],shell);grip.position.x=-8;g.add(grip);
 // Mesh intake with actual perforation-like geometry at the grip foot.
 tube(g,12.7,29,metal,-8,-122,0);
 const holeMat=surface(0x333433,.1,.7);const holeGeo=new THREE.CircleGeometry(.67,7);
 for(let row=0;row<13;row++)for(let i=0;i<44;i++){
  const a=(i+(row%2)*.5)*Math.PI*2/44,m=add(g,holeGeo,holeMat,-8+12.79*Math.sin(a),-135+row*2.1,12.79*Math.cos(a));m.rotation.y=a;
 }
 ring(g,12.65,.65,metal,-8,-138,0,'y');ring(g,12.7,.55,metal,-8,-106.5,0,'y');
 // Two controls and the narrow status light are spatially consistent across views.
 tube(g,3.9,1.6,metal,-8,-9,13.7,'z');tube(g,3.1,.8,shell,-8,-27,13.5,'z');
 ring(g,3.6,.28,metal,-8,-27,14,'z');
 add(g,new THREE.CapsuleGeometry(.4,4,3,10),new THREE.MeshBasicMaterial({color:0xffffff}),-8,6,15.1);
 label(g,'A E R L O R',-9,43,29.12,40,10,finish==='graphite'?'#aaa9a7':'#78756e');
 if(cord){const strain=lathe([[0,-157],[3,-157],[4,-151],[4.8,-142],[0,-142]],rubber);strain.position.x=-8;g.add(strain);
 const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(-8,-155,0),new THREE.Vector3(-8,-169,0),new THREE.Vector3(-1,-184,0),new THREE.Vector3(22,-190,-1),new THREE.Vector3(57,-191,-3)]);add(g,new THREE.TubeGeometry(curve,48,1.8,10,false),rubber);}
 return g;
}
function mirror(finish='champagne'){
 const p=palettes[finish],metal=surface(p.metal,.9,.22),g=new THREE.Group();
 const back=tube(g,52,5,metal,0,36,-1,'z');
 const glass=new THREE.MeshPhysicalMaterial({color:0xd8e0e2,metalness:1,roughness:.09,envMapIntensity:.8});tube(g,49.5,.8,glass,0,36,2.1,'z');
 ring(g,49.4,1,new THREE.MeshPhysicalMaterial({color:0xfff9ec,emissive:0xfff9ec,emissiveIntensity:.4,metalness:.1,roughness:.3}),0,36,2.8,'z');
 tube(g,3.2,86,metal,0,-51,-1);const base=lathe([[0,-96],[31,-96],[33,-94],[33,-91],[31,-89],[0,-89]],metal);g.add(base);return g;
}
function curler(finish='graphite'){
 const p=palettes[finish],metal=surface(p.metal,.85,.26),shell=surface(p.body,.4,.3),g=new THREE.Group();
 tube(g,9.8,106,metal,0,33,0);tube(g,9,68,shell,0,-55,0);tube(g,10,5,dark,0,-19,0);
 const tip=lathe([[0,84],[7,84],[8,87],[7,97],[0,101]],rubber);g.add(tip);
 const clamp=add(g,new THREE.BoxGeometry(9,83,2),metal,0,29,9);tube(g,3,2,metal,0,-31,9,'z');
 label(g,'AERLOR',0,-62,9.3,12,4,'#b8b8b8');
 const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(0,-90,0),new THREE.Vector3(0,-109,0),new THREE.Vector3(10,-116,0),new THREE.Vector3(36,-116,0)]);add(g,new THREE.TubeGeometry(curve,24,1.5,8,false),rubber);return g;
}
window.renderProduct=async function(kind='dryer',finish='champagne',view='hero'){
 if(subject){scene.remove(subject);subject.traverse(n=>{if(n.isMesh)n.geometry.dispose();});}
 subject=new THREE.Group();scene.add(subject);camera.position.set(300,145,500);camera.lookAt(0,-43,0);
 let extent=160,center=-45;
 if(kind==='collection'){
  const a=dryer('champagne');a.position.set(-6,0,27);a.rotation.z=-.12;subject.add(a);
  const b=mirror('champagne');b.position.set(-96,13,-34);b.scale.setScalar(1.12);b.rotation.y=.2;subject.add(b);
  const c=curler('graphite');c.position.set(94,-30,18);c.rotation.z=-.25;subject.add(c);extent=183;camera.position.set(190,130,600);camera.lookAt(0,-31,0);center=-31;
 }else if(kind==='mirror'){subject.add(mirror(finish));extent=120;center=-6;camera.position.set(100,60,550);camera.lookAt(0,center,0);
 }else if(kind==='curler'){subject.add(curler(finish));extent=132;center=-10;camera.position.set(150,80,550);camera.lookAt(0,center,0);subject.rotation.z=-.16;
 }else{subject.add(dryer(finish));subject.rotation.z=-.18;
  if(view==='side'){camera.position.set(-140,70,550);camera.lookAt(0,-42,0);subject.rotation.z=.05;}
  if(view==='detail'){extent=55;center=39;camera.position.set(390,105,300);camera.lookAt(24,39,0);subject.rotation.z=0;}
  if(view==='controls'){extent=64;center=-48;camera.position.set(80,20,550);camera.lookAt(-8,-48,0);subject.rotation.z=-.12;}
 }
 const aspect=innerWidth/innerHeight;camera.left=-extent*aspect;camera.right=extent*aspect;camera.top=extent;camera.bottom=-extent;camera.updateProjectionMatrix();
 renderer.render(scene,camera);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));renderer.render(scene,camera);return true;
};
window.renderReady=true;
await window.renderProduct();
