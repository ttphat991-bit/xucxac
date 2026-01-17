/* ===== BUILD DICE ===== */
const facePatterns = {
  1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]
};

function createFace(num, cls){
  const f=document.createElement("div");
  f.className="face "+cls;
  for(let i=0;i<9;i++){
    const d=document.createElement("span");
    if(!facePatterns[num].includes(i)) d.style.visibility="hidden";
    f.appendChild(d);
  }
  return f;
}

function buildDice(cube){
  cube.append(
    createFace(1,"front"),
    createFace(6,"back"),
    createFace(3,"right"),
    createFace(4,"left"),
    createFace(2,"top"),
    createFace(5,"bottom")
  );
}

["dice1","dice2","dice3"].forEach(id =>
  buildDice(document.getElementById(id))
);

/* ===== ROLL CUBE (SYNC SOUND) ===== */
function rollCube(cube){
  const v = Math.floor(Math.random() * 6) + 1;

  // GÓC CHUẨN – ĐẢM BẢO NGAY HÀNG
  const finalRot = {
    1: "rotateX(0deg) rotateY(0deg) translateZ(0)",
    2: "rotateX(-90deg) rotateY(0deg) translateZ(0)",
    3: "rotateX(0deg) rotateY(-90deg) translateZ(0)",
    4: "rotateX(0deg) rotateY(90deg) translateZ(0)",
    5: "rotateX(90deg) rotateY(0deg) translateZ(0)",
    6: "rotateX(180deg) rotateY(0deg) translateZ(0)"
  };

  /* ==== XOAY LOẠN ==== */
  cube.style.transition = "none";
  cube.style.transform =
    `rotateX(${Math.random() * 360}deg)
     rotateY(${Math.random() * 360}deg)
     rotateZ(${Math.random() * 360}deg)`;

  cube.offsetHeight; // ép render

  cube.style.transition =
    "transform 1.6s cubic-bezier(.36,.07,.19,.97)";
  cube.style.transform =
    `rotateX(1080deg) rotateY(900deg) rotateZ(720deg)`;

  /* ==== DỪNG NGAY HÀNG ==== */
  setTimeout(() => {
    cube.style.transform = finalRot[v];
  }, 1400);

  return v;
}


/* ===== GAME LOGIC ===== */
let roadmap=[],tai=0,xiu=0,round=0;

function renderRoad(){
  const rm=document.getElementById("roadmap");
  rm.innerHTML="";
  roadmap.forEach(c=>{
    const col=document.createElement("div");
    col.className="road-col";
    c.forEach(v=>{
      const d=document.createElement("div");
      d.className="road-dot "+(v==="TÀI"?"road-tai":"road-xiu");
      col.appendChild(d);
    });
    rm.appendChild(col);
  });
}

function rollAll(){
  const audio=document.getElementById("diceSound");
  audio.currentTime=0;
  audio.play();

  let total=0;
  [dice1,dice2,dice3].forEach(d=>total+=rollCube(d));

  setTimeout(()=>{
    const isTai=total>=11;
    isTai?tai++:xiu++; round++;

    document.getElementById("result").innerText="Tổng: "+total;
    document.getElementById("tx").innerText=isTai?"TÀI":"XỈU";
    document.getElementById("tx").className="tx "+(isTai?"tai":"xiu");

    document.getElementById("taiCount").innerText=tai;
    document.getElementById("xiuCount").innerText=xiu;
    document.getElementById("totalRound").innerText=round;
    document.getElementById("taiPercent").innerText=((tai/round)*100).toFixed(1);
    document.getElementById("xiuPercent").innerText=((xiu/round)*100).toFixed(1);

    const h=document.getElementById("history");
    h.innerHTML=
      `<div class="history-item">
        <span>#${round}</span>
        <span>${total}</span>
        <b style="color:${isTai?"green":"red"}">${isTai?"TÀI":"XỈU"}</b>
      </div>` + h.innerHTML;

    if(!roadmap.length || roadmap.at(-1).length>=6) roadmap.push([]);
    roadmap.at(-1).push(isTai?"TÀI":"XỈU");
    renderRoad();

    localStorage.setItem("save",
      JSON.stringify({roadmap,tai,xiu,round,history:h.innerHTML})
    );
  },1600);
}

function resetData(){
  if(confirm("Reset toàn bộ dữ liệu?")){
    localStorage.clear();
    location.reload();
  }
}

/* ===== LOAD ===== */
/* ===== LOAD ===== */
const saved = JSON.parse(localStorage.getItem("save"));
if (saved) {
  roadmap = saved.roadmap || [];
  tai = saved.tai || 0;
  xiu = saved.xiu || 0;
  round = saved.round || 0;

  document.getElementById("history").innerHTML = saved.history || "";

  // render roadmap
  renderRoad();

  // ===== RESTORE THỐNG KÊ =====
  document.getElementById("taiCount").innerText = tai;
  document.getElementById("xiuCount").innerText = xiu;
  document.getElementById("totalRound").innerText = round;

  document.getElementById("taiPercent").innerText =
    round ? ((tai / round) * 100).toFixed(1) : 0;

  document.getElementById("xiuPercent").innerText =
    round ? ((xiu / round) * 100).toFixed(1) : 0;
}
