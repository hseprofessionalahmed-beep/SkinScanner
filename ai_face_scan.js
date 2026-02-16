console.log("VERONA AI PRO ENGINE STARTED");

// ===============================
// العناصر الأساسية
// ===============================

const videoElement = document.getElementById('input_video');
const canvasElement = document.getElementById('overlay');
const canvasCtx = canvasElement.getContext('2d', { willReadFrequently: true });

let faceMesh = null;
let detectedLandmarks = null;   // 🔥 الحفظ الثابت للنقاط
let camera = null;

// ===============================
// تهيئة FaceMesh
// ===============================

async function setupFaceMesh() {

    faceMesh = new FaceMesh({
        locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });

    faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        selfieMode: false,
        minDetectionConfidence: 0.3,
        minTrackingConfidence: 0.3
    });

    faceMesh.onResults(onResults);

    document.getElementById('status').innerText =
        "المحرك جاهز للفحص ✅";
}

setupFaceMesh();

// ===============================
// عند استلام النتائج
// ===============================

function onResults(results) {

    if (!results.image) return;

    const width = results.image.width;
    const height = results.image.height;

    canvasElement.width = width;
    canvasElement.height = height;

    canvasCtx.clearRect(0, 0, width, height);
    canvasCtx.drawImage(results.image, 0, 0, width, height);

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {

        detectedLandmarks = results.multiFaceLandmarks[0]; // 🔥 التخزين الصحيح

        drawConnectors(
            canvasCtx,
            detectedLandmarks,
            FACEMESH_TESSELATION,
            { color: '#d4af37', lineWidth: 0.5 }
        );

        document.getElementById('scanBtn').disabled = false;
        document.getElementById('status').innerText =
            "تم اكتشاف الوجه ✅ اضغط تحليل";

    } else {

        detectedLandmarks = null;

        document.getElementById('scanBtn').disabled = true;
        document.getElementById('status').innerText =
            "لم يتم اكتشاف وجه واضح";
    }
}

// ===============================
// تشغيل الكاميرا
// ===============================

function initCamera() {

    detectedLandmarks = null;

    videoElement.classList.remove("hidden");

    camera = new Camera(videoElement, {
        onFrame: async () => {
            await faceMesh.send({ image: videoElement });
        },
        width: 640,
        height: 480
    });

    camera.start();
}

// ===============================
// تحسين الصورة قبل التحليل
// ===============================

function preprocessImage(image) {

    const tempCanvas = document.createElement("canvas");
    const ctx = tempCanvas.getContext("2d");

    const targetWidth = 640;
    const scale = targetWidth / image.width;

    tempCanvas.width = targetWidth;
    tempCanvas.height = image.height * scale;

    ctx.drawImage(image, 0, 0, tempCanvas.width, tempCanvas.height);

    let imgData = ctx.getImageData(
        0,
        0,
        tempCanvas.width,
        tempCanvas.height
    );

    let data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {

        data[i] *= 1.05;
        data[i + 1] *= 1.05;
        data[i + 2] *= 1.05;

        let avg =
            (data[i] + data[i + 1] + data[i + 2]) / 3;

        if (avg < 120) {
            data[i] *= 0.9;
            data[i + 1] *= 0.9;
            data[i + 2] *= 0.9;
        }
    }

    ctx.putImageData(imgData, 0, 0);

    return tempCanvas;
}

// ===============================
// رفع صورة
// ===============================

async function processFile(event) {

    const file = event.target.files[0];
    if (!file) return;

    if (camera) camera.stop();

    const img = new Image();

    img.onload = async () => {

        document.getElementById('status').innerText =
            "تحليل الصورة...";

        const enhancedImage = preprocessImage(img);

        await faceMesh.send({ image: enhancedImage });
    };

    img.src = URL.createObjectURL(file);
}

// ===============================
// التحليل النهائي
// ===============================

function performDiagnosis() {

    if (!detectedLandmarks) {

        document.getElementById('status').innerText =
            "يرجى التقاط وجه واضح أولاً";
        return;
    }

    function checkArea(lm) {
        const x = Math.floor(lm.x * canvasElement.width);
        const y = Math.floor(lm.y * canvasElement.height);
        const pixel = canvasCtx.getImageData(x, y, 1, 1).data;
        return (pixel[0] + pixel[1] + pixel[2]) / 3;
    }

    const forehead = checkArea(detectedLandmarks[10]);
    const cheek = checkArea(detectedLandmarks[205]);
    const eye =
        (checkArea(detectedLandmarks[130]) +
            checkArea(detectedLandmarks[359])) / 2;

    const pigmentDiff = cheek / forehead;
    const eyeDiff = eye / forehead;

    let result = {
        title: "بشرة مثالية ✅",
        desc: "بشرتك متوازنة وصحية",
        score: 96
    };

    if (eyeDiff < 0.85) {
        result = {
            title: "هالات سوداء 👁️",
            desc: "يوجد انخفاض في الإضاءة تحت العين",
            score: 78
        };
    } else if (pigmentDiff < 0.9) {
        result = {
            title: "تصبغات / نمش 🔍",
            desc: "يوجد اختلاف لوني في الوجنتين",
            score: 82
        };
    }

    document.getElementById('resultCard').classList.remove('hidden');
    document.getElementById('resTitle').innerText = result.title;
    document.getElementById('resDetails').innerText = result.desc;
    document.getElementById('scoreBox').innerText =
        "درجة الصحة: " + result.score + "%";
}

// ===============================
// إرسال واتساب
// ===============================

function sendToWA() {

    const text =
        "نتيجة فحص VERONA AI: " +
        document.getElementById('resTitle').innerText;

    window.open(
        `https://wa.me/201063994139?text=${text}`
    );
}
