const modal = document.getElementById("loveModal");
const openBtn = document.getElementById("openLove");
const closeBtn = document.getElementById("closeLove");
const wishBtn = document.getElementById("wishBtn");
const toast = document.getElementById("toast");

function openLoveNote(){modal.classList.add("open");modal.setAttribute("aria-hidden","false");}
function closeLoveNote(){modal.classList.remove("open");modal.setAttribute("aria-hidden","true");}
openBtn.addEventListener("click",openLoveNote);
closeBtn.addEventListener("click",closeLoveNote);
modal.addEventListener("click",e=>{if(e.target.classList.contains("modal-backdrop"))closeLoveNote();});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeLoveNote();});

// Starfield canvas: tiny, slow-moving stars for a soft night-sky atmosphere.
const canvas=document.getElementById("sparkleCanvas");
const ctx=canvas.getContext("2d");
let stars=[];
function resizeCanvas(){
  const dpr=Math.min(window.devicePixelRatio||1,2);
  canvas.width=window.innerWidth*dpr;canvas.height=window.innerHeight*dpr;
  canvas.style.width=window.innerWidth+"px";canvas.style.height=window.innerHeight+"px";
  ctx.setTransform(dpr,0,0,dpr,0,0);
  stars=Array.from({length:Math.min(95,Math.floor(window.innerWidth/9))},()=>({
    x:Math.random()*window.innerWidth,y:Math.random()*window.innerHeight,
    r:Math.random()*1.35+.25,a:Math.random()*.65+.15,s:Math.random()*.006+.002
  }));
}
function drawStars(){
  ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
  for(const star of stars){
    star.a+=Math.sin(Date.now()*star.s)*.003;
    ctx.beginPath();ctx.arc(star.x,star.y,star.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(255,220,239,${Math.max(.08,Math.min(.85,star.a))})`;ctx.fill();
  }
  requestAnimationFrame(drawStars);
}
window.addEventListener("resize",resizeCanvas);resizeCanvas();drawStars();

// A small burst of hearts and stars when she makes a wish.
wishBtn.addEventListener("click",()=>{
  wishBtn.innerHTML="Your wish is out there, Dipuu ♥";
  toast.classList.add("show");
  for(let i=0;i<34;i++){
    const particle=document.createElement("span");
    particle.textContent=Math.random()>.45?"✦":"♥";
    const x=Math.random()*100;
    particle.style.cssText=`position:fixed;left:${x}vw;bottom:${8+Math.random()*22}vh;color:${Math.random()>.5?"#ffdca8":"#ff9bc5"};font-size:${12+Math.random()*19}px;z-index:40;pointer-events:none;animation:rise 2.8s ease-out forwards;`;
    document.body.appendChild(particle);setTimeout(()=>particle.remove(),2900);
  }
  setTimeout(()=>toast.classList.remove("show"),2600);
});
const animationStyle=document.createElement("style");
animationStyle.textContent="@keyframes rise{to{transform:translateY(-70vh) rotate(240deg) scale(.4);opacity:0}}";
document.head.appendChild(animationStyle);

// Interactive 3D photo card tilt (disabled for touch screens).
const scene=document.getElementById("photoScene");
const photo=document.getElementById("photoCard");
scene.addEventListener("pointermove",e=>{
  if(e.pointerType==="touch")return;
  const r=scene.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
  photo.style.transform=`rotateY(${x*24}deg) rotateX(${-y*18}deg) rotateZ(${-x*3}deg) translateY(-7px)`;
});
scene.addEventListener("pointerleave",()=>photo.style.transform="");


// First-screen gift unboxing: she taps to reveal the full birthday site.
const intro=document.getElementById("giftIntro");
const unwrapBtn=document.getElementById("unwrapBtn");
// Start Dipuu's song from the exact gift-opening interaction. The same audio
// element is reused throughout the experience, so it never restarts between sections.
const musicToggle=document.getElementById("musicToggle");
const birthdayAudio=new Audio("birthday-song.mp3");
birthdayAudio.loop=true;
let musicOn=false;
async function startBirthdaySong(){
  try{
    await birthdayAudio.play();
    musicOn=true;
    musicToggle.innerHTML='♫ <span>sound on</span>';
  }catch(err){
    musicToggle.innerHTML='♫ <span>tap to play song</span>';
  }
}
unwrapBtn.addEventListener("click",()=>{
  if(intro.classList.contains("opened")) return;
  startBirthdaySong();
  intro.classList.add("opening");
  unwrapBtn.textContent="Your song is playing, Dipuu! ♥";
  const introCopy=intro.querySelector(".intro-copy");
  if(introCopy) introCopy.textContent="A little song, made with all my love. ❤️";
  setTimeout(()=>{
    intro.classList.remove("opening");
    intro.classList.add("opened");
  },950);
});

// Openable envelope with a keepsake note.
const envelopeButton=document.getElementById("envelopeButton");
const letterModal=document.getElementById("letterModal");
const closeLetter=document.getElementById("closeLetter");
envelopeButton.addEventListener("click",()=>{
  envelopeButton.classList.add("opened");
  setTimeout(()=>{
    letterModal.classList.add("open");
    letterModal.setAttribute("aria-hidden","false");
  },500);
});
function closeKeepsake(){
  letterModal.classList.remove("open");
  letterModal.setAttribute("aria-hidden","true");
}
closeLetter.addEventListener("click",closeKeepsake);
letterModal.addEventListener("click",e=>{if(e.target.classList.contains("modal-backdrop"))closeKeepsake();});

// Persistent music control: pause/resume the same song without restarting it.
musicToggle.addEventListener("click",async()=>{
  try{
    if(!musicOn){
      await birthdayAudio.play();
      musicOn=true;
      musicToggle.innerHTML='♫ <span>sound on</span>';
    }else{
      birthdayAudio.pause();
      musicOn=false;
      musicToggle.innerHTML='♫ <span>sound off</span>';
    }
  }catch(err){
    musicToggle.innerHTML='♫ <span>tap to play song</span>';
  }
});

// Tap-to-blow birthday candles. Once all are out, celebrate her wish with confetti.
const candles=[...document.querySelectorAll(".candle")];
const cakeStatus=document.getElementById("cakeStatus");
const blowCandles=document.getElementById("blowCandles");
function updateCake(){
  const lit=candles.filter(c=>c.classList.contains("lit")).length;
  cakeStatus.textContent=lit===0?"Wish made, Dipuu! May it all come true. ❤️":`${lit} little ${lit===1?"wish":"wishes"} still glowing for you`;
  if(lit===0){
    blowCandles.textContent="Your wish is on its way ✨";
    cakeConfetti();
  }
}
function cakeConfetti(){
  for(let i=0;i<28;i++){
    const bit=document.createElement("span");
    bit.textContent=Math.random()>.5?"✦":"♥";
    bit.style.cssText=`position:fixed;left:${Math.random()*100}vw;top:${35+Math.random()*35}vh;color:${Math.random()>.5?"#ffdca8":"#ff9bc5"};font-size:${12+Math.random()*18}px;z-index:45;pointer-events:none;animation:rise 2.6s ease-out forwards`;
    document.body.appendChild(bit);setTimeout(()=>bit.remove(),2700);
  }
}
candles.forEach(c=>c.addEventListener("click",()=>{c.classList.remove("lit");updateCake();}));
blowCandles.addEventListener("click",()=>{candles.forEach(c=>c.classList.remove("lit"));updateCake();});
