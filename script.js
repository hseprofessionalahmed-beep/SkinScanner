let scanResult = {};
let videoStream = null;
let detector = null;

// تشغيل الكاميرا عند تحميل الصفحة
async function initCamera() {
  const video = document.getElementById("video");
  try {
    videoStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    video.srcObject = videoStream;

    // تحقق من دعم FaceDetector
    if ('FaceDetector' in window) {
      detector = new FaceDetector({ fastMode: true });
    } else {
      alert("⚠️ جهازك لا يدعم FaceDetector، الصورة لن يتم تحليلها بشكل دقيق.");
    }
  } catch (err) {
    alert("❗ لم يتمكن التطبيق من الوصول للكاميرا. تأكد من السماح بالوصول.");
  }
}

// التقاط الصورة والتحقق من الجودة
async function captureImage() {
  const video = document.getElementById("video");
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // التحقق من الإضاءة
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let brightness = 0;
  for (let i = 0; i < imageData.data.length; i += 4) {
    brightness += (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
  }
  brightness = brightness / (imageData.data.length / 4);
  if (brightness < 40) {
    alert("⚠️ الإضاءة ضعيفة، حاول زيادة الإضاءة أمام وجهك.");
    return;
  }

  // التحقق من الوجه (إن وجد FaceDetector)
  if (detector) {
    try {
      const faces = await detector.detect(canvas);
      if (faces.length === 0) {
        alert("⚠️ لم يتم التعرف على الوجه، تأكد من مواجهة الكاميرا مباشرة.");
        return;
      }

      // نتحقق من حجم الوجه بالنسبة للإطار
      const face = faces[0].boundingBox;
      const faceArea = face.width * face.height;
      const frameArea = canvas.width * canvas.height;
      if (faceArea < frameArea * 0.1) {
        alert("⚠️ وجهك بعيد جداً، اقترب أكثر للكاميرا.");
        return;
      }

      // تحذير لو الوجه غير مركزي
      const centerX = face.x + face.width / 2;
      const centerY = face.y + face.height / 2;
      if (Math.abs(centerX - canvas.width / 2) > canvas.width * 0.2 ||
          Math.abs(centerY - canvas.height / 2) > canvas.height * 0.2) {
        alert("⚠️ حاول وضع وجهك في منتصف الكاميرا.");
        return;
      }

    } catch (err) {
      console.log("Face detection failed:", err);
    }
  }

  // كل شيء جيد -> نبدأ الفحص
  startScan(canvas);
}

// تحليل الوجه بالصورة الملتقطة
function startScan(imgOrCanvas) {
  scanResult = analyzeFace(imgOrCanvas);
  startQuestions();
}

// الأسئلة (تبقى كما هي)
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

function answerAcne(hasAcne) {
  const q = document.getElementById("questions");
  if (!hasAcne) {
    buildRoutine({ acne: false });
    return;
  }

  q.innerHTML = `
    <div class="card">
      <p>نوع الحبوب؟</p>
      <button onclick="buildRoutine({acne:true,type:'inflamed'})">ملتهبة</button>
      <button onclick="buildRoutine({acne:true,type:'comedonal'})">غير ملتهبة</button>
    </div>
  `;
}

// عند الضغط على زر التقاط الصورة
document.getElementById("captureBtn").addEventListener("click", captureImage);

// بدء الكاميرا تلقائي عند تحميل الصفحة
window.addEventListener("load", initCamera);
