let scanResult = {};
let videoStream = null;
let detector = null;

const video = document.getElementById("video");
const overlay = document.getElementById("overlay");
const ctx = overlay.getContext("2d");
const instructionsDiv = document.getElementById("instructions");

// تشغيل الكاميرا
async function initCamera() {
  try {
    videoStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    video.srcObject = videoStream;

    // تحقق من دعم FaceDetector
    if ('FaceDetector' in window) {
      detector = new FaceDetector({ fastMode: true });
    } else {
      instructionsDiv.classList.remove("hidden");
      instructionsDiv.innerText = "⚠️ جهازك لا يدعم FaceDetector، سيتم استخدام الإطار التوجيهي الأصفر فقط.";
    }

    requestAnimationFrame(drawFaceOverlay);

  } catch (err) {
    alert("❗ لم يتمكن التطبيق من الوصول للكاميرا. تأكد من السماح بالوصول.");
  }
}

// رسم المربع التفاعلي حول الوجه
async function drawFaceOverlay() {
  ctx.clearRect(0, 0, overlay.width, overlay.height);

  let faceDetected = false;
  let color = 'red';
  let message = "";

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

        // تحديد لون المربع وتعليمات
        if (sizeGood && centered) {
          color = 'green';
          message = "👍 وجهك جيد ومستعد للفحص";
        } else {
          color = 'red';
          if (!sizeGood) message = "⚠️ اقترب أكثر للكاميرا";
          else if (!centered) message = "⚠️ ضع وجهك في منتصف الكاميرا";
        }

        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.strokeRect(face.x, face.y, face.width, face.height);
        faceDetected = true;

      } else {
        message = "⚠️ لم يتم التعرف على الوجه، واجه الكاميرا مباشرة";
      }
    } catch (err) {
      console.log("Face detection failed:", err);
    }
  }

  // Fallback: مستطيل أصفر لإرشاد الوجه إذا الجهاز لا يدعم FaceDetector
  if (!detector) {
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 2;
    ctx.strokeRect(overlay.width*0.25, overlay.height*0.15, overlay.width*0.5, overlay.height*0.7);
    message = "⚠️ ضع وجهك داخل المستطيل الأصفر";
  }

  instructionsDiv.classList.remove("hidden");
  instructionsDiv.innerText = message;

  requestAnimationFrame(drawFaceOverlay);
}

// التقاط الصورة والتحقق من الإضاءة
async function captureImage() {
  const canvasCapture = document.createElement("canvas");
  canvasCapture.width = video.videoWidth;
  canvasCapture.height = video.videoHeight;
  const ctxCapture = canvasCapture.getContext("2d");
  ctxCapture.drawImage(video, 0, 0, canvasCapture.width, canvasCapture.height);

  const imageData = ctxCapture.getImageData(0,0,canvasCapture.width,canvasCapture.height);
  let brightness = 0;
  for (let i=0;i<imageData.data.length;i+=4){
    brightness += (imageData.data[i]+imageData.data[i+1]+imageData.data[i+2])/3;
  }
  brightness = brightness / (imageData.data.length/4);
  if (brightness<40){
    alert("⚠️ الإضاءة ضعيفة، حاول زيادة الإضاءة أمام وجهك.");
    return;
  }

  startScan(canvasCapture);
}

// تحليل الوجه بالصورة الملتقطة
function startScan(imgOrCanvas){
  scanResult = analyzeFace(imgOrCanvas);
  startQuestions();
}

// الأسئلة
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

document.getElementById("captureBtn").addEventListener("click", captureImage);
window.addEventListener("load", initCamera);
