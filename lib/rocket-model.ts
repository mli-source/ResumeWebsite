import * as T from "three";
import designJson from "@/content/rocket-design.json";
export type ModelPart="assembly"|"nose"|"recovery"|"body"|"fins"|"motor"|"ring";
export type RocketRecord={id:string;label:string;family:ModelPart;group:T.Group;base:T.Vector3;offset:T.Vector3;anchor:T.Vector3;side:number};
export const modelInfo:Record<ModelPart,{name:string;subtitle:string;dimensions:[string,string][]}>={
 assembly:{name:"Complete rocket",subtitle:"Flight hardware and recovery system",dimensions:[["Overall design length","1,219.4 mm"],["Body diameter","76.2 mm"],["Fin count","3"]]},
 nose:{name:"Nose assembly",subtitle:"Ogive nose, bulkhead, and silver eye bolt",dimensions:[["Nose length","300 mm"],["Base diameter","76.2 mm"],["Shoulder length","75 mm"],["Material","Printed PETG"]]},
 recovery:{name:"Recovery system",subtitle:"Orange-red parachute, shroud lines, and blast protector",dimensions:[["Canopy diameter","36 in / 914.4 mm"],["Shroud lines","8"],["Protector","12 in cloth"],["Display","Folded / illustrative"]]},
 body:{name:"Airframe",subtitle:"Two body tubes, coupler, and rail buttons",dimensions:[["Each body tube","457.2 mm"],["Outer diameter","76.2 mm"],["Coupler length","152.4 mm"]]},
 fins:{name:"Fin set",subtitle:"Three individually separable trapezoidal fins",dimensions:[["Root chord","200 mm"],["Tip chord","130 mm"],["Span per fin","75 mm"],["Thickness","3 mm"]]},
 motor:{name:"Motor & mount",subtitle:"Motor exterior, mount tube, and retainer",dimensions:[["Mount length","220 mm"],["Mount OD / ID","29 / 28 mm"],["Motor","HP-H135W-14"],["Motor geometry","Illustrative"]]},
 ring:{name:"Centering rings",subtitle:"Three annular rings supporting the motor mount",dimensions:[["Outer diameter","72.2 mm"],["Inner diameter","29 mm"],["Thickness","6 mm"],["Material","Birch plywood"]]}
};
function weaveTexture(){const N=128,data=new Uint8Array(N*N*4);for(let y=0;y<N;y++)for(let x=0;x<N;x++){const k=(y*N+x)*4,v=150+((x%4<2)===(y%4<2)?50:-25)+Math.sin(x*1.7+y*2.9)*12;data[k]=data[k+1]=data[k+2]=v;data[k+3]=255;}const tex=new T.DataTexture(data,N,N);tex.wrapS=tex.wrapT=T.RepeatWrapping;tex.repeat.set(8,8);tex.needsUpdate=true;return tex;}
type RopeBore={x:number;y:number;z:number;halfLength:number;radius:number};
function tube(points:T.Vector3[],radius:number,material:T.Material,bores:RopeBore[]=[]){
 const source=new T.CatmullRomCurve3(points);
 // Keep the entire flexible centerline within each bore until it clears its lip.
 // A collar beyond the lip gives the finite-radius rope room to bend outside.
 class RoutedCurve extends T.Curve<T.Vector3>{
  constructor(){super();}
  getPoint(t:number,target=new T.Vector3()){
   source.getPoint(t,target);
   for(const bore of bores){
    const beyond=Math.max(0,Math.abs(target.y-bore.y)-bore.halfLength-.004);
    if(beyond>=.025)continue;
    const dx=target.x-bore.x,dz=target.z-bore.z,d=Math.hypot(dx,dz);
    const safe=bore.radius-radius-.003;
    const blend=T.MathUtils.smoothstep(beyond,0,.025);
    const allowed=T.MathUtils.lerp(safe,Math.max(safe,d),blend);
    if(d>allowed){target.x=bore.x+dx*allowed/d;target.z=bore.z+dz*allowed/d;}
   }
   return target;
  }
 }
 return new T.Mesh(new T.TubeGeometry(new RoutedCurve(),240,radius,6,false),material);
}
function ringGeometry(outer:number,inner:number,height:number){return new T.LatheGeometry([new T.Vector2(inner,-height/2),new T.Vector2(outer,-height/2),new T.Vector2(outer,height/2),new T.Vector2(inner,height/2),new T.Vector2(inner,-height/2)],72);}
export function buildRocket(part:ModelPart,wireframe=false,internals=false){
 const root=new T.Group(),records:RocketRecord[]=[];
 const L=designJson.bodyLength/1000,R=designJson.diameter/2000;
 const mat=(color:number,metalness=0,roughness=.55)=>new T.MeshStandardMaterial({color,metalness,roughness,wireframe,side:T.DoubleSide});
 const paint=new T.MeshPhysicalMaterial({color:0xc5c9ce,metalness:1,roughness:.27,clearcoat:0,anisotropy:.55,anisotropyRotation:Math.PI/2,envMapIntensity:1.5,wireframe,side:T.DoubleSide,transparent:internals,opacity:internals?.09:1,depthWrite:!internals});
 const inner=mat(0xa48d6e,0,.9),silver=mat(0xc9ccd0,.95,.2),black=mat(0x202126,.4,.28),resin=mat(0x333539,.12,.6),wood=mat(0xab8960,0,.9),rope=mat(0xd5c8a5,0,1);
 const tubeInner=inner.clone();tubeInner.side=T.BackSide;tubeInner.transparent=internals;tubeInner.opacity=internals?.06:1;tubeInner.depthWrite=!internals;
 const clothMap=weaveTexture();const orange=new T.MeshStandardMaterial({color:0xd93816,roughness:.95,metalness:0,side:T.DoubleSide,wireframe,bumpMap:clothMap,bumpScale:.00065});
 const make=(id:string,label:string,family:ModelPart,position:number[],offset:number[],side:number,anchor=[0,0,0])=>{const group=new T.Group();group.name=id;group.position.fromArray(position);group.visible=part==="assembly"||part===family;root.add(group);const record={id,label,family,group,base:group.position.clone(),offset:new T.Vector3().fromArray(offset),anchor:new T.Vector3().fromArray(anchor),side};records.push(record);return group;};
 const add=(g:T.Group,geometry:T.BufferGeometry,material:T.Material,x=0,y=0,z=0)=>{const mesh=new T.Mesh(geometry,material);mesh.position.set(x,y,z);g.add(mesh);return mesh;};
 const nose=make('nose','Nose cone','nose',[0,L/2-.3,0],[0,.66,0],-1,[0,.17,0]);
 const rho=(.3*.3+R*R)/(2*R),points=[new T.Vector2(0,0),new T.Vector2(R,0)];for(let i=1;i<=80;i++){const y=.3*i/80;points.push(new T.Vector2(Math.max(0,Math.sqrt(Math.max(0,rho*rho-y*y))+R-rho),y));}
 add(nose,new T.LatheGeometry(points,80),paint);add(nose,new T.CylinderGeometry(.0367,.0367,.075,72),inner,0,-.0375);
 const bulkhead=make('bulkhead','Nose bulkhead','nose',[0,L/2-.375,0],[0,.52,0],1);add(bulkhead,new T.CylinderGeometry(.036,.036,.004,64),wood);
 const eye=make('eye','Silver eye bolt','nose',[0,L/2-.397,0],[.18,.42,0],1);
 add(eye,new T.TorusGeometry(.012,.0027,12,48),silver,0,-.006);add(eye,new T.CylinderGeometry(.003,.003,.026,16),silver,0,.02);add(eye,new T.CylinderGeometry(.006,.006,.004,6),silver,0,.024);
 for(let i=0;i<10;i++){const thread=add(eye,new T.TorusGeometry(.0031,.0005,4,14),silver,0,.009+i*.002);thread.rotation.x=Math.PI/2;}
 const chute=make('parachute','Parachute','recovery',[0,.09,0],[-.32,.32,0],-1);
 const canopyGeo=new T.SphereGeometry(1,64,40,0,Math.PI*2,0,Math.PI);const p=canopyGeo.attributes.position;
 for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),a=Math.atan2(z,x),f=1+.12*Math.sin(a*12+y*18)+.05*Math.sin(a*23-y*12);p.setXYZ(i,x*.025*f,y*.055,z*.025*f);}canopyGeo.computeVertexNormals();
 const canopy=add(chute,canopyGeo,orange);canopy.name='canopy';
 // Eight white suspension lines remain attached to the nose eye during separation.
 const shrouds=new T.Group();shrouds.name='shrouds';root.add(shrouds);records.push({id:'shrouds',label:'Shroud lines',family:'recovery',group:shrouds,base:new T.Vector3(),offset:new T.Vector3(),anchor:new T.Vector3(),side:-1});
 const protector=make('protector','Blast protector','recovery',[0,-.035,0],[.31,.22,.02],1);
 const clothGeo=new T.PlaneGeometry(.3048,.3048,48,48),cp=clothGeo.attributes.position;for(let i=0;i<cp.count;i++){const x=cp.getX(i),y=cp.getY(i);cp.setZ(i,.009*Math.sin(x*53+y*32)+.004*Math.sin(y*94-x*26));}clothGeo.computeVertexNormals();const folded=add(protector,clothGeo,orange);folded.name='protector-cloth';folded.scale.set(.105,.19,.7);folded.rotation.set(-.25,.2,-.18);
 const upper=make('upper','Upper body tube','body',[0,L/2-.3-.4572/2,0],[0,.04,0],-1,[R,.1,0]);
 add(upper,ringGeometry(R,.0372,.4572),paint);add(upper,new T.CylinderGeometry(.03715,.03715,.456,64,1,true),tubeInner);
 const lower=make('lower','Lower body tube','body',[0,L/2-.7572-.4572/2,0],[0,-.28,0],-1,[R,.12,0]);add(lower,ringGeometry(R,.0361,.4572),paint);add(lower,new T.CylinderGeometry(.03605,.03605,.456,64,1,true),tubeInner);
 const coupler=make('coupler','Tube coupler','body',[0,L/2-.761,0],[.26,-.1,0],1);add(coupler,ringGeometry(.0371,.0362,.1524),inner);
 const finStart=-L/2+.2;
 const finShape=new T.Shape();finShape.moveTo(R,0);finShape.lineTo(R+.075,-.075);finShape.lineTo(R+.075,-.205);finShape.lineTo(R,-.2);finShape.lineTo(R,-.13);finShape.lineTo(R-.01,-.13);finShape.lineTo(R-.01,-.07);finShape.lineTo(R,-.07);finShape.closePath();
 const finGeo=new T.ExtrudeGeometry(finShape,{depth:.003,steps:1,bevelEnabled:false});finGeo.translate(0,0,-.0015);
 for(let i=0;i<3;i++){const a=i*2*Math.PI/3,g=make('fin-'+i,'Fin '+(i+1),'fins',[0,finStart,0],[Math.cos(a)*.24,-.33,-Math.sin(a)*.24],i===0?1:-1,[Math.cos(a)*.083,-.13,-Math.sin(a)*.083]);const mesh=add(g,finGeo,paint);mesh.rotation.y=a;}
 const mount=make('mount','Motor mount tube','motor',[0,-L/2+.11,0],[.29,-.39,0],1);add(mount,ringGeometry(.0145,.014,.22),inner);
 const ringPositions=[.215,.1,.01];for(let i=0;i<3;i++){const g=make('ring-'+i,['Forward ring','Middle ring','Aft ring'][i],'ring',[0,-L/2+ringPositions[i]+.003,0],[.51,-.19-i*.035,0],1);add(g,ringGeometry(.0361,.0145,.006),wood);}
 const motor=make('motor','Motor / engine','motor',[0,-L/2+.108,0],[.74,-.38,0],1);add(motor,new T.CylinderGeometry(.0145,.0145,.216,48),black);add(motor,new T.CylinderGeometry(.0137,.0137,.008,48),silver,0,.108);add(motor,new T.CylinderGeometry(.0139,.0139,.009,48),black,0,-.108);
 add(motor,new T.LatheGeometry([new T.Vector2(.004,-.01),new T.Vector2(.009,-.021),new T.Vector2(.012,-.021),new T.Vector2(.012,0),new T.Vector2(.004,0)],48),resin,0,-.108);
 const retainer=make('retainer','Motor retainer','motor',[0,-L/2-.003,0],[0,-.57,0],-1);add(retainer,ringGeometry(.0205,.014,.014),resin);for(let i=0;i<32;i++){const a=i*Math.PI/16;add(retainer,new T.CylinderGeometry(.0009,.0009,.012,5),black,Math.sin(a)*.0205,0,Math.cos(a)*.0205);}
 for(let i=0;i<2;i++){const y=i===0?-.17:-.49,g=make('rail-'+i,'Rail button '+(i+1),'body',[0,y,R+.006],[-.18,-.12-i*.19,.1],-1);for(const [r,h,zz] of [[.008,.003,-.004],[.0045,.007,0],[.008,.003,.005]]){const mesh=add(g,new T.CylinderGeometry(r,r,h,24),resin,0,0,zz);mesh.rotation.x=Math.PI/2;}const screw=add(g,new T.CylinderGeometry(.003,.003,.002,16),silver,0,0,.007);screw.rotation.x=Math.PI/2;}
 // The connecting shock cord is displayed as a flexible tether, not a separation joint.
 const cordGroup=new T.Group();cordGroup.name='shock-cord';root.add(cordGroup);records.push({id:'cord',label:'Shock cord',family:'recovery',group:cordGroup,base:new T.Vector3(),offset:new T.Vector3(),anchor:new T.Vector3(),side:1});
 root.userData={records,part,rope,shrouds,cordGroup,clothMap,selection:part};
 updateRocketSeparation(root,0);
 if(part!=="assembly") {const box=new T.Box3();for(const r of records)if(r.group.visible)box.expandByObject(r.group);const center=box.getCenter(new T.Vector3());root.position.sub(center);}
 return root;
}
export function getRocketRecords(root:T.Group):RocketRecord[]{return root.userData.records as RocketRecord[];}
export function updateRocketSeparation(root:T.Group,amount:number){
 const t=T.MathUtils.clamp(amount,0,1),records=getRocketRecords(root),part=root.userData.part as ModelPart;
 for(const r of records)r.group.position.copy(r.base).addScaledVector(r.offset,t);
 const chute=records.find(r=>r.id==='parachute')!,eye=records.find(r=>r.id==='eye')!,protector=records.find(r=>r.id==='protector')!,lower=records.find(r=>r.id==='lower')!;
 chute.group.getObjectByName('canopy')!.scale.set(1+t*2.1,1+t*.4,1+t*2.1);
 protector.group.getObjectByName('protector-cloth')!.scale.set(.105+t*.895,.19+t*.81,.7+t*.3);
 const shrouds=root.userData.shrouds as T.Group,cord=root.userData.cordGroup as T.Group;
 const clear=(g:T.Group)=>{while(g.children.length){const o=g.children[0] as T.Mesh;g.remove(o);o.geometry?.dispose();}};clear(shrouds);clear(cord);
 shrouds.visible=cord.visible=part==='assembly'||part==='recovery';
 const bores:RopeBore[]=[['upper',.4572,.0372],['lower',.4572,.0361]].map(([id,length,radius])=>{
  const position=records.find(r=>r.id===id)!.group.position;
  return {x:position.x,y:position.y,z:position.z,halfLength:Number(length)/2,radius:Number(radius)};
 });
 const eyePoint=eye.group.position.clone().add(new T.Vector3(0,-.019,0));
 for(let i=0;i<8;i++){const a=i*Math.PI/4,edge=chute.group.position.clone().add(new T.Vector3(Math.cos(a)*(.021+t*.04),-.028,Math.sin(a)*(.021+t*.04)));const mid=eyePoint.clone().lerp(edge,.6);mid.y-=.035+t*.045;shrouds.add(tube([eyePoint,mid,edge],.0009,root.userData.rope,bores));}
 const clothPoint=protector.group.position.clone(),bodyPoint=lower.group.position.clone().add(new T.Vector3(0,.19,0));
 const mid=eyePoint.clone().lerp(clothPoint,.5);mid.z+=.012+t*.108;mid.y-=.04;
 cord.add(tube([eyePoint,mid,clothPoint,bodyPoint.clone().lerp(clothPoint,.5).add(new T.Vector3(.012+t*.028,0,.012+t*.028)),bodyPoint],.0016,root.userData.rope,bores));
 records.find(r=>r.id==='shrouds')!.anchor.copy(eyePoint).lerp(chute.group.position,.62);records.find(r=>r.id==='cord')!.anchor.copy(clothPoint).lerp(bodyPoint,.5).add(new T.Vector3(.025,0,.025));
 root.userData.separation=t;
}
export function disposeModel(object:T.Object3D){const geometries=new Set<T.BufferGeometry>(),materials=new Set<T.Material>(),textures=new Set<T.Texture>();object.traverse(o=>{if(o instanceof T.Mesh||o instanceof T.LineSegments){geometries.add(o.geometry);(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{materials.add(m);for(const v of Object.values(m))if(v instanceof T.Texture)textures.add(v);});}});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());}
