let scanResult = {};
let videoStream = null;
let detector = null;

const video = document.getElementById("video");
const overlay = document.getElementById("overlay");
const ctx = overlay.getContext("2d");
const instructionsDiv = document.getElementById("instructions");
const captureBtn = document.getElementById("captureBtn");

captureBtn.disabled = true;

async function initCamera() {
  try {
    videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
    video.srcObject = videoStream;

    await new Promise(resolve => { video.onloadedmetadata = () => { video.play(); resolve(); }; });

    captureBtn.disabled = false;

    if ('FaceDetector' in window) detector = new FaceDetector({ fastMode: true });

    requestAnimationFrame(drawOverlay);
  } catch (e) {
    alert("❌ لم يتمكن التطبيق من الوصول للكاميرا.");
    console.error(e);
  }
}

async function drawOverlay() {
  ctx.clearRect(0, 0, overlay.width, overlay.height);
  let color = 'red';
  let message = '';

  if (detector) {
    try {
      const faces = await detector.detect(video);
      if (faces.length > 0) {
        const face = faces[0].boundingBox;
        const faceArea = face.width * face.height;
        const frameArea = overlay.width * overlay.height;
        const centerX = face.x + face.width / 2;
        const centerY = face.y + face.height / 2;
        const sizeGood = faceArea >= frameArea * 0.1;
        const centered = Math.abs(centerX - overlay.width/2) < overlay.width*0.2 &&
                         Math.abs(centerY - overlay.height/2) < overlay.height*0.2;

        color = (sizeGood && centered) ? 'green' : 'red';
        message = (sizeGood && centered) ? "👍 وجهك جيد" : "⚠️ قرب وجهك أو ضع في منتصف الكاميرا";
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.strokeRect(face.x, face.y, face.width, face.height);
      } else message = "⚠️ لم يتم التعرف على الوجه";
    } catch(e) { console.log(e); }
  } else {
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 2;
    ctx.strokeRect(overlay.width*0.25, overlay.height*0.15, overlay.width*0.5, overlay.height*0.7);
    message = "⚠️ ضع وجهك داخل المستطيل الأصفر";
  }

  instructionsDiv.classList.remove("hidden");
  instructionsDiv.innerText = message;
  requestAnimationFrame(drawOverlay);
}

function captureImage() {
  if (!video.videoWidth || !video.videoHeight) {
    alert("❗ الفيديو غير جاهز، انتظر قليلاً");
    return;
  }

  const canvasCapture = document.createElement("canvas");
  canvasCapture.width = video.videoWidth;
  canvasCapture.height = video.videoHeight;
  canvasCapture.getContext("2d").drawImage(video, 0, 0, canvasCapture.width, canvasCapture.height);

  startScan(canvasCapture);
}

function startScan(imgOrCanvas){
  scanResult = analyzeFace(imgOrCanvas);
  startQuestions();
}

function startQuestions() {
  const q = document.getElementById("questions");
  q.classList.remove("hidden");
  q.innerHTML = `
    <div class="card">
      <p>هل لديك حبوب؟</p>
      <button onclick="answerAcne(true)">نعم</button>
      <button onclick="answerAcne(false)">لا</button>
    </div>
  `;
}

function answerAcne(hasAcne){
  const q = document.getElementById("questions");
  if (!hasAcne){ buildRoutine({acne:false}); return; }
  q.innerHTML = `
    <div class="card">
      <p>نوع الحبوب؟</p>
      <button onclick="buildRoutine({acne:true,type:'inflamed'})">ملتهبة</button>
      <button onclick="buildRoutine({acne:true,type:'comedonal'})">غير ملتهبة</button>
    </div>
  `;
}

captureBtn.addEventListener("click", captureImage);
window.addEventListener("load", initCamera);
