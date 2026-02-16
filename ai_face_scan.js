console.log("Face scan engine loaded.");

// العناصر
const videoElement = document.getElementById('input_video');
const canvasElement = document.getElementById('overlay');
const canvasCtx = canvasElement.getContext('2d', {willReadFrequently: true});

let faceMesh = null;
let lastResults = null;
let currentImg = null;

// تهيئة FaceMesh
async function setupFaceMesh() {
    faceMesh = new FaceMesh({locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`});
    faceMesh.setOptions({ maxNumFaces: 1, refineLandmarks: true, minDetectionConfidence: 0.5 });
    faceMesh.onResults(onResults);
    document.getElementById('status').innerText = "المحرك جاهز للفحص ✅";
}
setupFaceMesh();

// معالجة النتائج
function onResults(results) {
    lastResults = results;

    canvasElement.width = canvasElement.clientWidth;
    canvasElement.height = (currentImg) ? (currentImg.height * (canvasElement.width / currentImg.width)) : videoElement.videoHeight * (canvasElement.width / videoElement.videoWidth);

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        for (const landmarks of results.multiFaceLandmarks) {
            drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, {color: '#d4af3744', lineWidth: 0.5});
        }
        // تم اكتشاف الوجه – تفعيل الزر
        document.getElementById('scanBtn').disabled = false;
        document.getElementById('status').innerText = "تم اكتشاف الوجه! يمكنك الآن الضغط على زر التحليل.";
    }

    canvasCtx.restore();
}

// الكاميرا
function initCamera() {
    currentImg = null;
    videoElement.classList.remove('hidden');

    const camera = new Camera(videoElement, {
        onFrame: async () => { await faceMesh.send({image: videoElement}); },
        width: 480,
        height: 360
    });
    camera.start();
}

// رفع صورة
function processFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    const img = new Image();
    img.onload = async () => {
        currentImg = img;
        videoElement.classList.add('hidden');
        document.getElementById('status').innerText = "جاري تحليل الوجه...";
        await faceMesh.send({image: img});
        document.getElementById('scanBtn').disabled = false;
        document.getElementById('status').innerText = "تم اكتشاف الوجه! يمكنك الآن الضغط على زر التحليل.";
    };
    img.src = URL.createObjectURL(file);
}

// تضخيم تباين البشرة لتحسين اكتشاف التصبغات
function enhanceSkinContrast(ctx, x, y, w, h) {
    let imgData = ctx.getImageData(x, y, w, h);
    let data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i+1] = data[i+1] < 128 ? data[i+1] * 0.8 : data[i+1] * 1.2;
    }
    ctx.putImageData(imgData, x, y);
}

// التحليل + تشخيص سريع
function performDiagnosis() {
    if (!lastResults || !lastResults.multiFaceLandmarks) {
        return alert("يرجى وضع وجه واضح أولاً");
    }

    const landmarks = lastResults.multiFaceLandmarks[0];

    // تحليل مناطق محددة
    const forehead = checkArea(landmarks[10]);
    const cheek = checkArea(landmarks[205]);
    const eye = (checkArea(landmarks[130]) + checkArea(landmarks[350])) / 2;

    const pigmentDiff = cheek / forehead;
    const eyeDiff = eye / forehead;

    let res = { title: "بشرة مثالية ✅", desc: "توزيع الصبغات متناسق جداً وبشرتك صافية.", score: 98 };

    if (eyeDiff < 0.85) {
        res = { title: "هالات سوداء مكتشفة 👁️", desc: "تم رصد تباين لوني تحت العين. ننصح بكريمات تحتوي على الكافيين.", score: 76 };
    } else if (pigmentDiff < 0.90) {
        res = { title: "تصبغات / نمش نشط 🔍", desc: "رصدنا بقع داكنة في الوجنتين. ننصح بسيروم تفتيح وواقي شمس.", score: 82 };
    }

    // عرض النتيجة
    document.getElementById('resultCard').classList.remove('hidden');
    document.getElementById('resTitle').innerText = res.title;
    document.getElementById('resDetails').innerText = res.desc;
    document.getElementById('scoreBox').innerText = `درجة الصحة: ${res.score}%`;

    function checkArea(lm) {
        const x = Math.floor(lm.x * canvasElement.width);
        const y = Math.floor(lm.y * canvasElement.height);
        const pixel = canvasCtx.getImageData(x, y, 1, 1).data;
        return (pixel[0] + pixel[1] + pixel[2]) / 3;
    }
}

// إرسال واتساب
function sendToWA() {
    const text = `تقرير فيرونا AI: ${document.getElementById('resTitle').innerText}`;
    window.open(`https://wa.me/201063994139?text=${text}`);
}
