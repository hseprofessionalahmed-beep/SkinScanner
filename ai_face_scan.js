console.log("VERONA PRO Face Engine Loaded");

// =======================
// العناصر الأساسية
// =======================

const videoElement = document.getElementById('input_video');
const canvasElement = document.getElementById('overlay');
const canvasCtx = canvasElement.getContext('2d', { willReadFrequently: true });

let faceMesh = null;
let lastResults = null;
let currentImg = null;

// =======================
// تهيئة FaceMesh - وضع PRO
// =======================

async function setupFaceMesh() {

    faceMesh = new FaceMesh({
        locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });

    faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,

        // حساسية عالية
        minDetectionConfidence: 0.35,
        minTrackingConfidence: 0.35
    });

    faceMesh.onResults(onResults);

    document.getElementById('status').innerText =
        "المحرك الذكي جاهز للفحص ✅";
}

setupFaceMesh();

// =======================
// معالجة النتائج
// =======================

function onResults(results) {

    lastResults = results;

    if (!results.image) return;

    const width = results.image.width;
    const height = results.image.height;

    canvasElement.width = width;
    canvasElement.height = height;

    canvasCtx.clearRect(0, 0, width, height);
    canvasCtx.drawImage(results.image, 0, 0, width, height);

    if (
        results.multiFaceLandmarks &&
        results.multiFaceLandmarks.length > 0
    ) {

        for (const landmarks of results.multiFaceLandmarks) {
            drawConnectors(
                canvasCtx,
                landmarks,
                FACEMESH_TESSELATION,
                { color: '#d4af37', lineWidth: 0.5 }
            );
        }

        document.getElementById('scanBtn').disabled = false;
        document.getElementById('status').innerText =
            "تم اكتشاف الوجه ✅ جاهز للتحليل";

    } else {

        document.getElementById('scanBtn').disabled = true;
        document.getElementById('status').innerText =
            "لم يتم اكتشاف وجه واضح، حاول إضاءة أمامية مباشرة";
    }
}

// =======================
// تحسين الصورة قبل التحليل
// =======================

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

        // تفتيح خفيف
        data[i] *= 1.05;
        data[i + 1] *= 1.05;
        data[i + 2] *= 1.05;

        // رفع التباين في المناطق الداكنة
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

// =======================
// تضخيم تباين البشرة
// =======================

function enhanceSkinContrast(ctx, x, y, w, h) {

    let imgData = ctx.getImageData(x, y, w, h);
    let data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {

        data[i + 1] =
            data[i + 1] < 128
                ? data[i + 1] * 0.8
                : data[i + 1] * 1.2;
    }

    ctx.putImageData(imgData, x, y);
}

// =======================
// تشغيل الكاميرا
// =======================

function initCamera() {

    currentImg = null;
    videoElement.classList.remove('hidden');

    const camera = new Camera(videoElement, {
        onFrame: async () => {
            await faceMesh.send({ image: videoElement });
        },
        width: 640,
        height: 480
    });

    camera.start();
}

// =======================
// رفع صورة
// =======================

async function processFile(event) {

    const file = event.target.files[0];
    if (!file) return;

    const img = new Image();

    img.onload = async () => {

        currentImg = img;

        document.getElementById('status').innerText =
            "تحسين الصورة وتحليل الوجه...";

        const enhancedImage = preprocessImage(img);

        await faceMesh.send({ image: enhancedImage });
    };

    img.src = URL.createObjectURL(file);
}

// =======================
// التحليل النهائي
// =======================

function performDiagnosis() {

    if (
        !lastResults ||
        !lastResults.multiFaceLandmarks ||
        lastResults.multiFaceLandmarks.length === 0
    ) {
        document.getElementById('status').innerText =
            "لم يتم التقاط الوجه بوضوح";
        return;
    }

    const landmarks =
        lastResults.multiFaceLandmarks[0];

    function checkArea(lm) {
        const x = Math.floor(lm.x * canvasElement.width);
        const y = Math.floor(lm.y * canvasElement.height);
        const pixel =
            canvasCtx.getImageData(x, y, 1, 1).data;
        return (pixel[0] + pixel[1] + pixel[2]) / 3;
    }

    const forehead = checkArea(landmarks[10]);
    const cheek = checkArea(landmarks[205]);
    const eye =
        (checkArea(landmarks[130]) +
            checkArea(landmarks[359])) / 2;

    const pigmentDiff = cheek / forehead;
    const eyeDiff = eye / forehead;

    let res = {
        title: "بشرة مثالية ✅",
        desc: "بشرتك متوازنة جداً",
        score: 96
    };

    if (eyeDiff < 0.85) {
        res = {
            title: "هالات سوداء 👁️",
            desc: "رصد تباين تحت العين",
            score: 78
        };
    } else if (pigmentDiff < 0.9) {
        res = {
            title: "تصبغات / نمش 🔍",
            desc: "يوجد اختلاف لوني في الوجنتين",
            score: 82
        };
    }

    document.getElementById('resultCard')
        .classList.remove('hidden');

    document.getElementById('resTitle').innerText =
        res.title;

    document.getElementById('resDetails').innerText =
        res.desc;

    document.getElementById('scoreBox').innerText =
        "درجة الصحة: " + res.score + "%";
}

// =======================
// واتساب
// =======================

function sendToWA() {

    const text =
        "تقرير VERONA AI: " +
        document.getElementById('resTitle')
            .innerText;

    window.open(
        `https://wa.me/201063994139?text=${text}`
    );
}
