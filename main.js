const canvas=document.querySelector(".canvas");
const infomation=document.querySelector("#infomation");
const ctx=canvas.getContext("2d");
canvas.style.border="2px solid";
var axis="";
var filling=true;
var line=false;
var dead=false;
const mamount=4;
var camera={
    angle:{
    xw:0,
    yw:0,
    zw:0,
    xy:0,
    yz:0,
    xz:0
    },
    position:{
        x:0,
        y:0,
        z:0,
        w:0
    }
}
const rspd=Math.PI/60;
const size={
    x:4,
    y:4,
    z:4,
    w:4
}
var key="";
var info=true;
const obj=[];
const csize=100;
ctx.font = "20px sans-serif";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
function translate(){
        //回転
        if(axis!=""){
            eval(`camera.angle.${axis}=math.mod(camera.angle.${axis}+${180*rspd/Math.PI},360)`);
            for(const o of obj){
                for(const v of o.vertex){
                    const id=o.vertex.indexOf(v);
        const R=mat4.rotationMatrix(rspd,axis);
        o.vertex[id]=vec.matrix(mat.prod(R,mat.vector(v)));
                }
            }
            draw();
        }
        const s=9;
        if(key=="KeyW"){
            camera.position.y-=s;
            draw();
        }
        if(key=="KeyD"){
            camera.position.x+=s;
            draw();
        }
        if(key=="KeyS"){
            camera.position.y+=s;
            draw();
        }
        if(key=="KeyA"){
            camera.position.x-=s;
            draw();
        }
        if(key=="KeyQ"){
            camera.position.z-=s;
            draw();
        }
        if(key=="KeyE"){
            camera.position.z+=s;
            draw();
        }
        if(key=="KeyR"){
            camera.position.w-=s;
            draw();
        }
        if(key=="KeyF"){
            camera.position.w+=s;
            draw();
        }
    requestAnimationFrame(translate);
}
function draw(){
    past=-1;
    updateInfomation();
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(const o of obj){
        if((!o.reveal || o.value>0)){
        for(const v of o.vertex){
            if(o.vertex.indexOf(v)==16 && o.name!="sp"){
            plot(v,o);
        }
    }
    if(filling){
        if(!o.display && !o.reveal && o.name!="sp" && !o.mark){
        for(const p of o.plane){
            fill(o,p);
        }
    }
    }
}
    }
    for(const o of obj){
        if(o.display || o.name=="sp" || o.mark){
        for(const p of o.plane){
        stroke(o,p)
        }
    }
}
    for(const o of obj){
        if(o.display){
        for(const p of o.plane){
        fill(o,p);
        }
    }
    }
}
function fill(o,p){
    ctx.globalAlpha = 0.05;
    ctx.beginPath();
    way(o.vertex[p[0]],o.vertex[p[1]],o.display);
    way(o.vertex[p[1]],o.vertex[p[2]],o.display);
    way(o.vertex[p[2]],o.vertex[p[3]],o.display);
    way(o.vertex[p[3]],o.vertex[p[0]],o.display);
    ctx.fillStyle=o.color;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.closePath();
}
function stroke(o,p){
    ctx.globalAlpha = 0.05;
    ctx.beginPath();
    way(o.vertex[p[0]],o.vertex[p[1]],o.display);
    way(o.vertex[p[1]],o.vertex[p[2]],o.display);
    way(o.vertex[p[2]],o.vertex[p[3]],o.display);
    way(o.vertex[p[3]],o.vertex[p[0]],o.display);
    ctx.stroke();
    ctx.closePath();
    ctx.globalAlpha = 1;
}
function way(a,b,bool){
    ctx.lineTo(fix(a,bool).x,fix(a,bool).y);
    ctx.lineTo(fix(b,bool).x,fix(b,bool).y);
}
function line(a,b){
    ctx.beginPath();
    ctx.lineTo(fix(a).x,fix(a).y);
    ctx.lineTo(fix(b).x,fix(b).y);
    ctx.stroke();
    ctx.closePath();
}
window.addEventListener("keydown",e=>{
    if(e.code=="KeyX"){
        axis="xw";
    }
    if(e.code=="KeyY"){

        axis="yw";
    }
    if(e.code=="KeyZ"){
        axis="zw";
    }
    if(e.code=="KeyI"){
        axis="xy";
    }
    if(e.code=="KeyO"){
        axis="yz";
    }
    if(e.code=="KeyP"){
        axis="xz";
    }
    key=e.code;
});
var past=-1;
canvas.addEventListener("click",e=>{
    const m={
        x:e.offsetX,
        y:e.offsetY
    }
    var min=10000;
    var id=-1;
    for(const o of obj){
        if((!o.reveal || o.value>0) && !o.display && o.name!="sp" && !o.mark){
        const V=o.vertex[16];
        const v=fix(V);
        if(Math.hypot(v.x-m.x,v.y-m.y)<min && !o.reveal){
            id=o.id;
            min=Math.hypot(v.x-m.x,v.y-m.y);
        }
    }
    }
    if(id!=-1 && id==past){
        dig(id);
        draw();
    }else{
        draw();
        plot(obj[id].vertex[16],obj[id],5);
        past=id;
    }
});
canvas.addEventListener("contextmenu",()=>{
    event.preventDefault();
});
canvas.addEventListener("auxclick",e=>{
    const m={
        x:e.offsetX,
        y:e.offsetY
    }
    var min=10000;
    var id=-1;
    for(const o of obj){
        if((!o.reveal || o.value>0) && !o.display && o.name!="sp"){
        const V=o.vertex[16];
        const v=fix(V);
        if(Math.hypot(v.x-m.x,v.y-m.y)<min && !o.reveal){
            id=o.id;
            min=Math.hypot(v.x-m.x,v.y-m.y);
        }
    }
    }
    if(id!=-1 && id==past){
        obj[id].mark=!obj[id].mark;
        draw();
    }else{
        draw();
        plot(obj[id].vertex[16],obj[id],5);
        past=id;
    }
});
window.addEventListener("keyup",e=>{
    axis="";
    key="";
});
function plot(v,o,r){
    if(!r){
        r=2;
    }
    ctx.fillStyle="#000000";
    const a=fix(v,o.display);
    if(o.display){
        ctx.font = "30px sans-serif";
        ctx.fillText(o.name,a.x,a.y);
        ctx.font = "20px sans-serif";
    }else if(!info || !o.reveal){
    ctx.beginPath();
    ctx.arc(a.x,a.y,r,0,2*Math.PI);
    ctx.fill();
    ctx.closePath();
    }else{
        if(o.mine){
            ctx.fillText("💀",a.x,a.y);
        }else{
            ctx.globalAlpha = 0.5;
        ctx.fillText(o.value,a.x,a.y);
        ctx.globalAlpha = 1;
        }
    }
}
function fix(v,bool){
    var c;
    if(bool){
        c=v;
    }else{
        c=vec.sum([camera.position.x,camera.position.y,camera.position.z,camera.position.w],v);
    }
    var b=mat4.perspective4D(c,1000);
    var a=mat4.perspective(b,1000);
    a=new vector(a[0],a[1],a[2]);
    if(bool){
        return new vector(a.x+canvas.width/8,a.y+canvas.height*7/8);
    }else{
    return new vector(a.x+canvas.width/2,a.y+canvas.height/2);
    }
}
function test(id){
    const v=obj[0].vertex[id];
    var b=mat4.perspective4D(v,1000);
    var a=mat4.perspective(b,1000);
    return new vector(a[0],a[1],a[2]);
}
function cube(x,y,z,w,dx,dy,dz,dw,display,name){
    if(!name){
        name="";
    }
    obj.push({
        vertex:[[x,y,z,w],[x+dx,y,z,w],[x+dx,y+dy,z,w],[x,y+dy,z,w],[x,y,z+dz,w],[x+dx,y,z+dz,w],[x+dx,y+dy,z+dz,w],[x,y+dy,z+dz,w],
        [x,y,z,w+dw],[x+dx,y,z,w+dw],[x+dx,y+dy,z,w+dw],[x,y+dy,z,w+dw],[x,y,z+dz,w+dw],[x+dx,y,z+dz,w+dw],[x+dx,y+dy,z+dz,w+dw],[x,y+dy,z+dz,w+dw],
    //重心
    [x+dx/2,y+dy/2,z+dz/2,w+dw/2]],
        plane:[[0,1,2,3],[4,5,6,7],[0,1,5,4],[0,4,7,3],[3,2,6,7],[2,1,5,6],[8,9,10,11],[12,13,14,15],[8,9,13,12],[8,12,15,11],[11,10,14,15],[10,9,13,14],
                [0,8,9,1],[1,5,13,9],[5,6,14,13],[5,4,12,13],[6,7,15,14],[2,6,14,10],[1,2,10,9],[2,3,11,10],[3,7,15,11],[4,7,15,12],[0,4,12,8],[0,3,11,8]],
        color:`rgb(${Math.round(Math.random()*255)},${Math.round(Math.random()*255)},${Math.round(Math.random()*255)})`,
        angle:{
            xw:0,
            yw:0,
            zw:0,
            xy:0,
            yz:0,
            xz:0
        },
        mark:false,
        name:name,
        reveal:false,
        display:display,
        position:[x/csize,y/csize,z/csize,w/csize],
        value:0,
        mine:false,
        id:obj.length
});
}
function generate(mine){
for(let x=-size.x*csize/2; x<size.x*csize/2; x+=csize){
    for(let y=-size.y*csize/2; y<size.y*csize/2; y+=csize){
        for(let z=-size.z*csize/2; z<size.z*csize/2; z+=csize){
            for(let w=-size.w*csize/2; w<size.w*csize/2; w+=csize){
                cube(x,y,z,w,csize,csize,csize,csize,false);
            }
        }
  }
}
//地雷設置
var id=-1;
var n=0;
while((id==-1 || obj[id].mine) && n<mine){
    id=Math.round(Math.random()*(obj.length-1));
    if(!obj[id].mine){
        addMine(obj[id].position);
        obj[id].mine=true;
        n++;
    }
}
}
generate(mamount);
function addMine(p){
    function add(x,y,z,w){
        const id=obj.findIndex(e=>e.position[0]-p[0]==x && e.position[1]-p[1]==y && e.position[2]-p[2]==z && e.position[3]-p[3]==w);
        if(id!=-1){
        obj[id].value++;
        }
    }
    for(let r=-1; r<=1; ++r){
        for(let i=-1; i<=1; ++i){
            for(let j=-1; j<=1; ++j){
                for(let k=-1; k<=1; ++k){
                    add(r,i,j,k);
                }
            }
        }
    }
}
cube(-size.x*csize/2,-size.y*csize/2,-size.z*csize/2,-size.w*csize/2,size.x*csize,size.y*csize,size.z*csize,size.w*csize,false,"sp");
const S=10;
cube(-S/2,-S/2,-S/2,-S/2,8*S,S,S,S,true,"x");
cube(-S/2,-S/2,-S/2,-S/2,S,8*S,S,S,true,"y");
cube(-S/2,-S/2,-S/2,-S/2,S,S,8*S,S,true,"z");
cube(-S/2,-S/2,-S/2,-S/2,S,S,S,8*S,true,"w");

//cube(-50,-50,-50,-50,100,100,100,0);
//cube(100,-50,-50,-50,100,100,0,100);
function pattern(matrix){
    for(let i=0; i<matrix.length; i++){
        for(let j=0; j<matrix[i].length; ++j){
            if(matrix[i][j]==1){
                cube(-50+100*j,-50+100*i,-50,-50,100,100,100,100);
            }
        }
    }
}
function clamp(val){
    if(val<0){
        return 0;
    }
    return val;

}
function dig(id){
    if(!obj[id].reveal){
        obj[id].reveal=true;
        if(obj[id].mine){
            dead=true;
        }
    if(obj[id].value==0){
        function digat(r,i,j,k){
            const I=obj.findIndex(e=>
                e.position[0]==obj[id].position[0]+r && e.position[1]==obj[id].position[1]+i && e.position[2]==obj[id].position[2]+j && e.position[3]==obj[id].position[3]+k);
                if(I!=-1){
            dig(I);
                }
        }
    for(let r=-1; r<=1; ++r){
        for(let i=-1; i<=1; ++i){
            for(let j=-1; j<=1; ++j){
                for(let k=-1; k<=1; ++k){
                    digat(r,i,j,k);
                }
            }
        }
    }
}
}
}
function updateInfomation(){
    function cut(v){
        return Math.round(v*10)/10;
    }
    infomation.innerHTML=`
    正八胞体${size.x}x${size.y}x${size.z}x${size.w}マス<br>
    位相<br>
    (x,y,z,w)=(${cut(camera.position.x)},${cut(camera.position.y)},${cut(camera.position.z)},${cut(camera.position.w)})<br>
    角度<br>
    xw平面:${camera.angle.xw}°(Xキー)<br>
    yw平面:${camera.angle.yw}°(Yキー)<br>
    zw平面:${camera.angle.zw}°(Zキー)<br>
    xy平面:${camera.angle.xy}°(Iキー)<br>
    yz平面:${camera.angle.yz}°(Oキー)<br>
    xz平面:${camera.angle.xz}°(Pキー)`;
}
translate();
draw();