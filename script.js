let scanResult = {};
let videoStream = null;
const video = document.getElementById("video");
const overlay = document.getElementById("overlay");
const ctx = overlay.getContext("2d");
const instructionsDiv = document.getElementById("instructions");
const captureBtn = document.getElementById("captureBtn");

captureBtn.disabled = true;

function chooseMode(mode){
  if(mode==='camera'){
    document.getElementById("fileUpload").classList.add("hidden");
    captureBtn.style.display = 'block';
    initCamera();
  } else {
    captureBtn.style.display = 'none';
    document.getElementById("fileUpload").classList.remove("hidden");
  }
}

async function initCamera() {
  try{
    videoStream = await navigator.mediaDevices.getUserMedia({ video:{facingMode:'user'}, audio:false });
    video.srcObject = videoStream;
    await new Promise(res=>video.onloadedmetadata=res);
    captureBtn.disabled=false;
    requestAnimationFrame(drawOverlay);
  }catch(e){
    alert("❌ لم يتمكن التطبيق من الوصول للكاميرا.");
    console.error(e);
  }
}

function drawOverlay(){
  ctx.clearRect(0,0,overlay.width,overlay.height);
  ctx.strokeStyle='yellow';
  ctx.lineWidth=2;
  ctx.strokeRect(overlay.width*0.25, overlay.height*0.15, overlay.width*0.5, overlay.height*0.7);
  instructionsDiv.classList.remove("hidden");
  instructionsDiv.innerText="⚠️ ضع وجهك داخل المستطيل الأصفر";
  requestAnimationFrame(drawOverlay);
}

function captureImage(){
  if(!video.videoWidth || !video.videoHeight){ alert("❗ الفيديو غير جاهز"); return; }
  const canvas=document.createElement("canvas");
  canvas.width=video.videoWidth; canvas.height=video.videoHeight;
  canvas.getContext("2d").drawImage(video,0,0,canvas.width,canvas.height);
  startScan(canvas);
}

function startScan(imgOrCanvas){
  scanResult=analyzeFace(imgOrCanvas);
  startQuestions();
}

function startQuestions(){
  const q=document.getElementById("questions");
  q.classList.remove("hidden");
  q.innerHTML=`
    <div class="card">
      <p>هل لديك حبوب؟</p>
      <button onclick="answerAcne(true)">نعم</button>
      <button onclick="answerAcne(false)">لا</button>
    </div>
  `;
}

function answerAcne(hasAcne){
  const q=document.getElementById("questions");
  if(!hasAcne){ buildRoutine({acne:false, level:'eco', pigmentation:scanResult.pigmentation>0.4}); return; }
  q.innerHTML=`
    <div class="card">
      <p>نوع الحبوب؟</p>
      <button onclick="buildRoutine({acne:true,type:'inflamed', level:'eco', pigmentation:scanResult.pigmentation>0.4})">ملتهبة</button>
      <button onclick="buildRoutine({acne:true,type:'comedonal', level:'eco', pigmentation:scanResult.pigmentation>0.4})">غير ملتهبة</button>
    </div>
  `;
}

captureBtn.addEventListener("click",captureImage);
window.addEventListener("load",()=>{});
