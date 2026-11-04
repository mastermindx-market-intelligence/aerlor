import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export type Finish = 'champagne' | 'graphite' | 'pearl';
export interface SceneController { setFinish: (finish: Finish) => void; setMotion: (enabled: boolean) => void; dispose: () => void; }

/** An original procedural design study, not CAD or a representation of a tested product. */
export async function createProductScene(host: HTMLElement, initial: Finish, reduced: boolean): Promise<SceneController> {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  host.append(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-3, 3, 3, -3, .1, 100);
  camera.position.set(4.7, 2.6, 8);
  camera.lookAt(0, -.12, 0);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const env = pmrem.fromScene(room, .04);
  scene.environment = env.texture;
  scene.environmentIntensity = 1.05;
  room.dispose();
  pmrem.dispose();

  const key = new THREE.DirectionalLight(0xfff4df, 4.2);
  key.position.set(-3, 6, 5); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -4; key.shadow.camera.right = 4;
  key.shadow.camera.top = 4; key.shadow.camera.bottom = -4;
  key.shadow.normalBias = .035; key.shadow.bias = -.0001;
  key.shadow.radius = 4; scene.add(key);
  const fill = new THREE.DirectionalLight(0xe7f0e7, 1.8); fill.position.set(4, 1, -3); scene.add(fill);
  scene.add(new THREE.HemisphereLight(0xfff7e6, 0xa79d86, 1));

  const bodyMaterial = new THREE.MeshPhysicalMaterial({ color:0xc9b58f, metalness:.82, roughness:.29, clearcoat:.18, clearcoatRoughness:.35, anisotropy:.6, anisotropyRotation:Math.PI/2 });
  const ringMaterial = new THREE.MeshStandardMaterial({color:0xd8c6a4,metalness:.92,roughness:.24});
  const dark = new THREE.MeshStandardMaterial({color:0x282e26,metalness:.35,roughness:.48});
  const grilleMetal = new THREE.MeshStandardMaterial({color:0x777866,metalness:.6,roughness:.35});
  const dryer = new THREE.Group();
  dryer.rotation.set(-.05,-.28,-.32); dryer.position.set(.08,.14,0); scene.add(dryer);
  function mesh(geometry: THREE.BufferGeometry, material: THREE.Material, parent: THREE.Object3D = dryer): THREE.Mesh {
    const object = new THREE.Mesh(geometry, material); object.castShadow = true; object.receiveShadow = true; parent.add(object); return object;
  }
  function axisCylinder(radiusTop: number, radiusBottom: number, length: number, x: number, y: number, material: THREE.Material): THREE.Mesh {
    const object = mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, length, 80), material);
    object.rotation.z = Math.PI / 2; object.position.set(x,y,0); return object;
  }
  const barrelProfile = [new THREE.Vector2(.397,-1.03),new THREE.Vector2(.423,-1.01),new THREE.Vector2(.445,-.96),new THREE.Vector2(.451,-.85),new THREE.Vector2(.444,.83),new THREE.Vector2(.435,.94),new THREE.Vector2(.414,.99)];
  const barrel = mesh(new THREE.LatheGeometry(barrelProfile,96), bodyMaterial); barrel.rotation.z = Math.PI/2; barrel.position.y = .67;
  axisCylinder(.423,.425,.045,-.999,.67,ringMaterial);
  axisCylinder(.403,.403,.05,-1.028,.67,dark);
  axisCylinder(.432,.432,.052,1.005,.67,ringMaterial);
  axisCylinder(.395,.395,.055,1.038,.67,dark);
  // Fine concentric grille rings and radial spokes on both closed faces.
  for (const x of [-1.065,1.072]) {
    for(let r=.055;r<.39;r+=.031){const t=mesh(new THREE.TorusGeometry(r,.0035,5,80),grilleMetal);t.rotation.y=Math.PI/2;t.position.set(x,.67,0);}
    for(let a=0;a<Math.PI*2;a+=Math.PI/12){const spoke=mesh(new THREE.BoxGeometry(.006,.74,.007),grilleMetal);spoke.rotation.x=a;spoke.position.set(x,.67,0);}
    axisCylinder(.068,.068,.018,x,.67,dark);
  }
  const handle = mesh(new THREE.CylinderGeometry(.221,.199,1.51,64), bodyMaterial); handle.position.set(-.2,-.32,0);
  const joint = mesh(new THREE.SphereGeometry(.22,48,32),bodyMaterial); joint.position.set(-.2,.42,0);
  const base = mesh(new THREE.CylinderGeometry(.203,.198,.29,64),dark);base.position.set(-.2,-1.22,0);
  const handleRim = mesh(new THREE.CylinderGeometry(.207,.207,.025,64),ringMaterial);handleRim.position.set(-.2,-1.075,0);
  const baseCap = mesh(new THREE.SphereGeometry(.198,48,24),dark);baseCap.scale.y=.35;baseCap.position.set(-.2,-1.364,0);
  for(let a=0;a<Math.PI*2;a+=Math.PI/25){const rib=mesh(new THREE.BoxGeometry(.008,.235,.008),grilleMetal);rib.position.set(-.2+Math.sin(a)*.204,-1.22,Math.cos(a)*.204);}
  const control = mesh(new RoundedBoxGeometry(.105,.37,.032,3,.035),dark);control.position.set(-.2,-.12,.217);
  const toggle = mesh(new RoundedBoxGeometry(.078,.14,.025,3,.025),ringMaterial);toggle.position.set(-.2,-.025,.239);
  const buttonRing = mesh(new THREE.TorusGeometry(.022,.002,6,32),ringMaterial);buttonRing.position.set(-.2,-.226,.237);
  const indicator = mesh(new THREE.CircleGeometry(.009,24),new THREE.MeshBasicMaterial({color:0xcbd8ae}));indicator.position.set(-.2,-.44,.207);
  const cordPath = new THREE.CatmullRomCurve3([new THREE.Vector3(-.2,-1.41,0),new THREE.Vector3(-.18,-1.63,.02),new THREE.Vector3(.12,-1.72,.06),new THREE.Vector3(.42,-1.74,.10)]);
  mesh(new THREE.TubeGeometry(cordPath,40,.018,8,false),dark);

  const logoCanvas=document.createElement('canvas');logoCanvas.width=1024;logoCanvas.height=128;
  const logoCtx=logoCanvas.getContext('2d')!;
  logoCtx.font='500 68px Arial';logoCtx.textAlign='center';logoCtx.textBaseline='middle';logoCtx.fillStyle='#534a3b';
  logoCtx.fillText('A E R L O R',512,64);
  const logoTexture = new THREE.CanvasTexture(logoCanvas);logoTexture.colorSpace=THREE.SRGBColorSpace;
  const logoMaterial=new THREE.MeshBasicMaterial({map:logoTexture,transparent:true,depthWrite:false,side:THREE.DoubleSide,opacity:.85});
  const logo=mesh(new THREE.PlaneGeometry(.88,.11),logoMaterial);logo.position.set(-.05,.69,.447);

  // Travertine-inspired presentation plinth. All texture data is generated locally.
  const stoneCanvas=document.createElement('canvas');stoneCanvas.width=1024;stoneCanvas.height=512;
  const ctx=stoneCanvas.getContext('2d')!;ctx.fillStyle='#cfc1a6';ctx.fillRect(0,0,1024,512);
  let seed=5731;const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
  for(let i=0;i<1600;i++){const y=random()*512;ctx.strokeStyle=`rgba(${random()>.5?'107,94,68':'245,235,212'},${.025+random()*.06})`;ctx.lineWidth=.3+random()*1.8;ctx.beginPath();ctx.moveTo(0,y);for(let x=0;x<=1024;x+=40)ctx.lineTo(x,y+Math.sin(x*.009+i)*3+random()*2);ctx.stroke();}
  const stoneTexture=new THREE.CanvasTexture(stoneCanvas);stoneTexture.colorSpace=THREE.SRGBColorSpace;stoneTexture.wrapS=THREE.RepeatWrapping;stoneTexture.repeat.set(1.5,1);
  const stoneMaterial=new THREE.MeshStandardMaterial({map:stoneTexture,color:0xe4d7bd,roughness:.9,metalness:0});
  const plinth=mesh(new THREE.CylinderGeometry(1.53,1.53,.19,96),stoneMaterial,scene);plinth.position.set(.08,-1.83,0);plinth.receiveShadow=true;
  const shadowCanvas=document.createElement('canvas');shadowCanvas.width=256;shadowCanvas.height=256;
  const sctx=shadowCanvas.getContext('2d')!;const gradient=sctx.createRadialGradient(128,128,8,128,128,128);gradient.addColorStop(0,'rgba(65,51,29,.24)');gradient.addColorStop(.4,'rgba(65,51,29,.13)');gradient.addColorStop(1,'rgba(65,51,29,0)');sctx.fillStyle=gradient;sctx.fillRect(0,0,256,256);
  const shadowTexture=new THREE.CanvasTexture(shadowCanvas);
  const groundShadow=mesh(new THREE.PlaneGeometry(5.6,3.9),new THREE.MeshBasicMaterial({map:shadowTexture,transparent:true,depthWrite:false}),scene);groundShadow.rotation.x=-Math.PI/2;groundShadow.position.set(.2,-1.938,.05);groundShadow.castShadow=false;

  let enabled=!reduced, visible=true, disposed=false, raf=0;
  let pointerX=0,pointerY=0;
  const baseRotation={x:-.05,y:-.28,z:-.32};
  const resize=()=>{
    const width=host.clientWidth,height=host.clientHeight;if(!width||!height)return;
    const aspect=width/height;
    const halfHeight=2.6;
    camera.left=-halfHeight*aspect;camera.right=halfHeight*aspect;camera.top=halfHeight;camera.bottom=-halfHeight;
    camera.updateProjectionMatrix();renderer.setSize(width,height);render(performance.now());
  };
  const render=(time:number)=>{
    if(disposed)return;
    if(enabled){dryer.position.y=.14+Math.sin(time*.00065)*.035;dryer.rotation.y=baseRotation.y+pointerX*.12+Math.sin(time*.00018)*.025;dryer.rotation.x=baseRotation.x+pointerY*.06;}
    renderer.render(scene,camera);
  };
  const tick=(time:number)=>{raf=0;if(disposed||!visible||document.hidden)return;render(time);if(enabled)raf=requestAnimationFrame(tick);};
  const request=()=>{if(!disposed&&!raf&&visible&&!document.hidden)raf=requestAnimationFrame(tick);};
  const visibility=()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else request();};
  const onPointer=(event:PointerEvent)=>{if(event.pointerType==='touch'||!enabled)return;const rect=host.getBoundingClientRect();pointerX=(event.clientX-rect.left)/rect.width-.5;pointerY=(event.clientY-rect.top)/rect.height-.5;request();};
  const pointerLeave=()=>{pointerX=0;pointerY=0;};
  const finishColors:Record<Finish,{body:number;ring:number;metalness:number;roughness:number}>={champagne:{body:0xc7b491,ring:0xd3c2a3,metalness:.82,roughness:.3},graphite:{body:0x485047,ring:0x72786b,metalness:.78,roughness:.31},pearl:{body:0xe8e5d8,ring:0xd3d1c4,metalness:.12,roughness:.36}};
  const setFinish=(finish:Finish)=>{const f=finishColors[finish];bodyMaterial.color.setHex(f.body);bodyMaterial.metalness=f.metalness;bodyMaterial.roughness=f.roughness;ringMaterial.color.setHex(f.ring);logoMaterial.color.setHex(finish==='graphite'?0xe8dfcb:0xffffff);request();};
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);
  const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;if(visible)request();else{cancelAnimationFrame(raf);raf=0;}},{rootMargin:'50px'});observer.observe(host);
  document.addEventListener('visibilitychange',visibility);host.addEventListener('pointermove',onPointer);host.addEventListener('pointerleave',pointerLeave);
  renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();host.parentElement?.classList.remove('scene-ready');cancelAnimationFrame(raf);raf=0;},{once:true});
  setFinish(initial);resize();request();
  return {
    setFinish,
    setMotion(value){enabled=value;if(!enabled){cancelAnimationFrame(raf);raf=0;render(performance.now());}else request();},
    dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(raf);resizeObserver.disconnect();observer.disconnect();document.removeEventListener('visibilitychange',visibility);host.removeEventListener('pointermove',onPointer);host.removeEventListener('pointerleave',pointerLeave);scene.traverse(object=>{if(object instanceof THREE.Mesh){object.geometry.dispose();const materials=Array.isArray(object.material)?object.material:[object.material];materials.forEach(material=>material.dispose());}});logoTexture.dispose();stoneTexture.dispose();shadowTexture.dispose();env.dispose();renderer.dispose();renderer.domElement.remove();}
  };
}
