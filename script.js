const videoElement = document.getElementById('input_video');
const canvasElement = document.getElementById('overlay');
const canvasCtx = canvasElement.getContext('2d', {willReadFrequently: true});
const scanBtn = document.getElementById('scanBtn');

let faceMesh, lastResults = null, currentImg = null;

// 1️⃣ تهيئة FaceMesh
async function setupFaceMesh() {
    faceMesh = new FaceMesh({locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`});
    faceMesh.setOptions({ maxNumFaces: 1, refineLandmarks: true, minDetectionConfidence: 0.5 });
    faceMesh.onResults(onResults);
    document.getElementById('status').innerText = "المحرك جاهز للفحص ✅";
}
setupFaceMesh();

// 2️⃣ تحديث النتائج ورسم الوجوه
function onResults(results) {
    lastResults = results;

    canvasElement.width = canvasElement.clientWidth;
    canvasElement.height = (currentImg) ? (currentImg.height * (canvasElement.width / currentImg.width)) 
                                        : videoElement.videoHeight * (canvasElement.width / videoElement.videoWidth);

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        scanBtn.disabled = false;
        document.getElementById('status').innerText = "الوجه مكتشف ✅ اضغط على تحليل النتائج";
        for (const landmarks of results.multiFaceLandmarks) {
            drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, {color: '#d4af3744', lineWidth: 0.5});
        }
    }
    canvasCtx.restore();
}

// 3️⃣ تشغيل الكاميرا
async function initCamera() {
    currentImg = null;
    videoElement.classList.remove('hidden');
    const camera = new Camera(videoElement, {
        onFrame: async () => { await faceMesh.send({image: videoElement}); }
    });
    camera.start();
}

// 4️⃣ رفع صورة
function processFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    const img = new Image();
    img.onload = async () => {
        currentImg = img;
        videoElement.classList.add('hidden');
        document.getElementById('status').innerText = "يتم الآن رسم خريطة الوجه...";
        await faceMesh.send({image: img});
    };
    img.src = URL.createObjectURL(file);
}

// 5️⃣ تحليل النتائج
async function performDiagnosis() {
    if (!lastResults || !lastResults.multiFaceLandmarks || lastResults.multiFaceLandmarks.length === 0) {
        return alert("لم يتم اكتشاف الوجه بعد. تأكد من وضوح الوجه والإضاءة الجيدة.");
    }

    const lm = lastResults.multiFaceLandmarks[0];

    function checkArea(indices) {
        let sum = 0;
        for (const idx of indices) {
            const x = Math.floor(idx.x * canvasElement.width);
            const y = Math.floor(idx.y * canvasElement.height);
            const pixel = canvasCtx.getImageData(x, y, 1, 1).data;
            sum += (pixel[0]+pixel[1]+pixel[2])/3;
        }
        return sum/indices.length;
    }

    const forehead = checkArea([10, 338, 297]);
    const cheeks = checkArea([205, 425, 431]);
    const eyes = checkArea([130, 359, 386, 159]);

    const pigmentDiff = cheeks/forehead;
    const eyeDiff = eyes/forehead;

    let res = {title:"بشرة مثالية ✅", desc:"توزيع الصبغات متناسق جداً وبشرتك صافية.", score:98, routine: buildRoutine("عام")};

    if (eyeDiff < 0.85) {
        res = {title:"هالات سوداء 👁️", desc:"تم رصد تباين تحت العين. ننصح بكريمات تحتوي الكافيين.", score:76, routine: buildRoutine("الهالات")};
    } else if (pigmentDiff < 0.90) {
        res = {title:"تصبغات / نمش 🔍", desc:"تم رصد بقع داكنة على الخدين. ننصح بسيروم تفتيح وواقي شمس.", score:82, routine: buildRoutine("تصبغات")};
    }

    document.getElementById('resultCard').classList.remove('hidden');
    document.getElementById('resTitle').innerText = res.title;
    document.getElementById('resDetails').innerText = res.desc;
    document.getElementById('routineBox').innerHTML = res.routine;
}

// 6️⃣ إرسال واتساب
function sendToWA() {
    const text = `تقرير فيرونا AI: ${document.getElementById('resTitle').innerText}\n${document.getElementById('resDetails').innerText}`;
    window.open(`https://wa.me/201063994139?text=${encodeURIComponent(text)}`);
}
