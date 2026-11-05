import * as T from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';

export type ProductFamily='dryer'|'mirror'|'curler';
export type ProductFinish='graphite'|'champagne'|'pearl';
export type StudioView='product'|'hero'|'detail'|'rear';
export interface StudioController {render:()=>void;setFinish:(finish:ProductFinish)=>void;setAngle:(x:number,y:number)=>void;dispose:()=>void;canvas:HTMLCanvasElement}

/** Original presentation models. These are not production CAD or validated technical specifications. */
export function createStudio(host:HTMLElement,family:ProductFamily,finish:ProductFinish='graphite',view:StudioView='product',fixedSize?:{width:number;height:number}):StudioController{
 const renderer=new T.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:Boolean(fixedSize),powerPreference:'low-power'});
 renderer.setPixelRatio(fixedSize?1:Math.min(devicePixelRatio,1.5));renderer.setClearColor(0,0);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.16;host.append(renderer.domElement);
 const scene=new T.Scene();const camera=new T.OrthographicCamera(-3,3,3,-3,.1,100);camera.position.set(4.4,2.2,8);camera.lookAt(0,0,0);
 const pmrem=new T.PMREMGenerator(renderer),room=new RoomEnvironment();const env=pmrem.fromScene(room,.03);scene.environment=env.texture;scene.environmentIntensity=1.45;room.dispose();pmrem.dispose();
 const lights:[number,number,number,number,number][]=[[0xffffff,4.7,-4,6,5],[0xe7edff,2.5,4,1,-5],[0xffffff,1.7,-1,-2,5]];
 for(const [color,intensity,x,y,z]of lights){const l=new T.DirectionalLight(color,intensity);l.position.set(x,y,z);scene.add(l);}scene.add(new T.AmbientLight(0xffffff,.26));
 const shell=new T.MeshPhysicalMaterial({color:0x33363b,metalness:.82,roughness:.28,clearcoat:.18,clearcoatRoughness:.3,anisotropy:.5});
 const rim=new T.MeshStandardMaterial({color:0x9e694d,metalness:.86,roughness:.27});
 const silver=new T.MeshStandardMaterial({color:0xa6a9ae,metalness:.94,roughness:.24});
 const black=new T.MeshStandardMaterial({color:0x111315,metalness:.28,roughness:.38});
 const darkMetal=new T.MeshStandardMaterial({color:0x4b5057,metalness:.8,roughness:.35});
 const body=new T.Group();scene.add(body);const textures:T.Texture[]=[env.texture];
 const add=(g:T.BufferGeometry,m:T.Material,parent:T.Object3D=body)=>{const mesh=new T.Mesh(g,m);parent.add(mesh);return mesh;};
 const cyl=(r1:number,r2:number,h:number,m:T.Material,x=0,y=0,z=0,axis:'x'|'y'|'z'='y')=>{const mesh=add(new T.CylinderGeometry(r1,r2,h,96),m);if(axis==='x')mesh.rotation.z=Math.PI/2;if(axis==='z')mesh.rotation.x=Math.PI/2;mesh.position.set(x,y,z);return mesh;};
 const label=(text:string,width:number,height:number,color:string='#c6c9cb')=>{const c=document.createElement('canvas');c.width=1024;c.height=128;const ctx=c.getContext('2d')!;ctx.font='500 62px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=color;ctx.fillText(text,512,64);const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;textures.push(texture);return add(new T.PlaneGeometry(width,height),new T.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,side:T.DoubleSide}));};
 const torus=(r:number,tube:number,m:T.Material,x:number,y:number,z:number,axis:'x'|'z'='z')=>{const mesh=add(new T.TorusGeometry(r,tube,8,100),m);if(axis==='x')mesh.rotation.y=Math.PI/2;mesh.position.set(x,y,z);return mesh;};
 if(family==='dryer'){
  const profile=[new T.Vector2(.325,-.86),new T.Vector2(.348,-.835),new T.Vector2(.358,-.77),new T.Vector2(.354,.68),new T.Vector2(.342,.79),new T.Vector2(.32,.835)];
  const barrel=add(new T.LatheGeometry(profile,120),shell);barrel.rotation.z=Math.PI/2;barrel.position.y=.68;
  cyl(.334,.334,.024,rim,-.845,.68,0,'x');cyl(.308,.308,.03,black,-.865,.68,0,'x');
  cyl(.338,.338,.038,silver,.835,.68,0,'x');cyl(.307,.307,.038,black,.86,.68,0,'x');
  for(const x of [-.889,.884]){
   for(let r=.035;r<.30;r+=.023)torus(r,.0021,darkMetal,x,.68,0,'x');
   for(let a=0;a<Math.PI*2;a+=Math.PI/24){const spoke=add(new T.BoxGeometry(.004,.59,.0035),darkMetal);spoke.rotation.x=a;spoke.position.set(x,.68,0);}
   cyl(.038,.038,.009,black,x,.68,0,'x');
  }
  cyl(.168,.154,1.46,shell,-.19,-.30);
  const joint=add(new T.SphereGeometry(.168,48,32),shell);joint.position.set(-.19,.407,0);
  cyl(.156,.154,.21,black,-.19,-1.13);cyl(.158,.158,.02,rim,-.19,-1.018);
  const cap=add(new T.SphereGeometry(.154,48,24),black);cap.scale.y=.23;cap.position.set(-.19,-1.24,0);
  for(let i=0;i<52;i++){const a=i*Math.PI*2/52;const rib=add(new T.BoxGeometry(.005,.165,.005),darkMetal);rib.position.set(-.19+Math.sin(a)*.157,-1.13,Math.cos(a)*.157);}
  const controls=add(new RoundedBoxGeometry(.084,.31,.025,4,.028),black);controls.position.set(-.19,-.14,.166);
  const toggle=add(new RoundedBoxGeometry(.058,.10,.02,4,.018),silver);toggle.position.set(-.19,-.07,.183);
  torus(.015,.002,silver,-.19,-.233,.181);
  const led=add(new T.CircleGeometry(.004,12),new T.MeshBasicMaterial({color:0xf0f2f4}));led.position.set(-.19,-.36,.16);
  const logo=label('A E R L O R',.56,.07);logo.position.set(-.06,.68,.354);
  const cable=new T.CatmullRomCurve3([new T.Vector3(-.19,-1.27,0),new T.Vector3(-.18,-1.47,0),new T.Vector3(.04,-1.61,.015),new T.Vector3(.32,-1.63,.05)]);add(new T.TubeGeometry(cable,44,.014,10,false),black);
  body.rotation.set(-.08,-.28,-.35);body.position.y=.10;
 }else if(family==='mirror'){
  cyl(.64,.62,.09,shell,0,-1.36,0);cyl(.61,.61,.008,silver,0,-1.31,0);cyl(.56,.56,.012,shell,0,-1.30,0);
  cyl(.055,.07,1.20,shell,0,-.69,-.035);
  const ring=add(new T.CylinderGeometry(.86,.86,.065,120),shell);ring.rotation.x=Math.PI/2;ring.position.set(0,.56,0);
  const back=add(new T.CylinderGeometry(.80,.80,.018,120),black);back.rotation.x=Math.PI/2;back.position.set(0,.56,-.042);
  torus(.812,.022,new T.MeshStandardMaterial({color:0xf3f4f6,emissive:0xe8ecf1,emissiveIntensity:.52,roughness:.45}),0,.56,.04);
  const mirror=new T.MeshPhysicalMaterial({color:0xc8d0d5,metalness:1,roughness:.035,envMapIntensity:.62});const glass=add(new T.CircleGeometry(.786,120),mirror);glass.position.set(0,.56,.039);
  // A soft studio reflection is generated locally; it is not a UI or lighting specification.
  const c=document.createElement('canvas');c.width=512;c.height=512;const ctx=c.getContext('2d')!;const g=ctx.createLinearGradient(0,512,512,0);g.addColorStop(0,'rgba(78,88,98,.08)');g.addColorStop(.41,'rgba(255,255,255,.06)');g.addColorStop(.46,'rgba(255,255,255,.5)');g.addColorStop(.57,'rgba(255,255,255,.12)');g.addColorStop(1,'rgba(211,225,235,.1)');ctx.fillStyle=g;ctx.fillRect(0,0,512,512);const t=new T.CanvasTexture(c);textures.push(t);const reflection=add(new T.CircleGeometry(.783,120),new T.MeshBasicMaterial({map:t,transparent:true,depthWrite:false}));reflection.position.set(0,.56,.041);
  const power=torus(.025,.0025,silver,0,-.10,.046);power.material=new T.MeshBasicMaterial({color:0xbfc6cb,transparent:true,opacity:.7});
  const logo=label('A E R L O R',.33,.043);logo.rotation.x=-Math.PI/2;logo.position.set(0,-1.289,.28);
  body.rotation.set(.035,-.28,0);body.position.y=.06;
 }else{
  cyl(.102,.101,1.44,darkMetal,0,.65);cyl(.096,.088,.22,black,0,1.48);const tip=add(new T.SphereGeometry(.088,48,24),black);tip.scale.y=.75;tip.position.y=1.60;
  cyl(.103,.103,.045,rim,0,-.09);cyl(.108,.12,1.13,shell,0,-.67);const end=add(new T.SphereGeometry(.12,48,24),shell);end.scale.y=.4;end.position.y=-1.23;
  cyl(.065,.066,.12,black,0,-1.32);
  const clamp=add(new RoundedBoxGeometry(.031,1.25,.085,4,.018),silver);clamp.position.set(.105,.70,.012);const hinge=add(new T.SphereGeometry(.057,32,20),darkMetal);hinge.position.set(.112,-.015,.012);
  const lever=add(new RoundedBoxGeometry(.06,.30,.065,3,.018),shell);lever.rotation.z=.36;lever.position.set(.16,-.16,0);
  const control=add(new RoundedBoxGeometry(.056,.25,.023,4,.017),black);control.position.set(0,-.53,.108);torus(.013,.0015,silver,0,-.60,.122);
  const logo=label('A E R L O R',.30,.04);logo.rotation.z=Math.PI/2;logo.position.set(0,-.96,.115);
  const cord=new T.CatmullRomCurve3([new T.Vector3(0,-1.39,0),new T.Vector3(.05,-1.55,0),new T.Vector3(.31,-1.58,.06),new T.Vector3(.43,-1.74,.11)]);add(new T.TubeGeometry(cord,40,.012,8,false),black);
  body.rotation.set(-.06,-.25,-.36);body.position.y=.05;
 }
 if(view==='rear')body.rotation.y+=Math.PI;
 if(view==='detail'){body.scale.setScalar(2.2);body.position.y=family==='dryer'?-1.0:family==='mirror'?-1.1:-.8;}
 if(view==='hero'){body.scale.setScalar(1.18);body.rotation.z-=.07;}
 const initialRotation={x:body.rotation.x,y:body.rotation.y,z:body.rotation.z};
 let disposed=false;
 const render=()=>{if(!disposed)renderer.render(scene,camera);};
 const resize=()=>{const w=fixedSize?.width??host.clientWidth,h=fixedSize?.height??host.clientHeight;if(!w||!h)return;const half=view==='detail'?1.2:1.95;camera.left=-half*w/h;camera.right=half*w/h;camera.top=half;camera.bottom=-half;camera.updateProjectionMatrix();renderer.setSize(w,h,false);render();};
 const setFinish=(f:ProductFinish)=>{const values={graphite:{body:0x34383e,rim:0x9e694d,metalness:.84,roughness:.27},champagne:{body:0xb8b7b0,rim:0x987058,metalness:.88,roughness:.26},pearl:{body:0xe6e8eb,rim:0xa4a8ac,metalness:.19,roughness:.3}}[f];shell.color.setHex(values.body);shell.metalness=values.metalness;shell.roughness=values.roughness;rim.color.setHex(values.rim);render();};
 const ro=new ResizeObserver(resize);if(!fixedSize)ro.observe(host);setFinish(finish);resize();
 return {canvas:renderer.domElement,render,setFinish,setAngle(x,y){body.rotation.x=initialRotation.x+y*.12;body.rotation.y=initialRotation.y+x*.4;render();},dispose(){if(disposed)return;disposed=true;ro.disconnect();const gs=new Set<T.BufferGeometry>(),ms=new Set<T.Material>();scene.traverse(o=>{if(o instanceof T.Mesh){gs.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])ms.add(m);}});gs.forEach(g=>g.dispose());ms.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());renderer.dispose();renderer.domElement.remove();}};
}
