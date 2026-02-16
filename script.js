// عناصر الصفحة
const videoElement = document.getElementById('input_video');
const canvasElement = document.getElementById('overlay');
const canvasCtx = canvasElement.getContext('2d', {willReadFrequently:true});
const scanBtn = document.getElementById('scanBtn');
let faceMesh;
let lastResults = null;
let currentImg = null;

// 1️⃣ تهيئة FaceMesh
async function setupFaceMesh(){
    faceMesh = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });
    faceMesh.setOptions({ maxNumFaces:1, refineLandmarks:true, minDetectionConfidence:0.5 });
    faceMesh.onResults(onResults);
    document.getElementById('status').innerText = "المحرك جاهز للفحص ✅";
}
setupFaceMesh();

// 2️⃣ تحديث الرسم وlastResults
function onResults(results){
    lastResults = results; // 🔹 تحديث مستمر

    canvasElement.width = canvasElement.clientWidth;
    canvasElement.height = (currentImg)? (currentImg.height*(canvasElement.width/currentImg.width)) : videoElement.videoHeight*(canvasElement.width/videoElement.videoWidth);

    canvasCtx.save();
    canvasCtx.clearRect(0,0,canvasElement.width,canvasElement.height);
    canvasCtx.drawImage(results.image,0,0,canvasElement.width,canvasElement.height);

    if(results.multiFaceLandmarks){
        for(const landmarks of results.multiFaceLandmarks){
            drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, {color:'#d4af3744', lineWidth:0.5});
        }
        scanBtn.disabled = false; // ✅ تفعيل الزر عند اكتشاف وجه
    } else {
        scanBtn.disabled = true; // تعطيل إذا لم يُكشف وجه
    }

    canvasCtx.restore();
}

// 3️⃣ فتح الكاميرا
async function initCamera(){
    currentImg = null;
    videoElement.classList.remove('hidden');
    const camera = new Camera(videoElement,{
        onFrame: async ()=>{ await faceMesh.send({image:videoElement}); }
    });
    camera.start();
}

// 4️⃣ رفع صورة
function processFile(event){
    const file = event.target.files[0];
    if(!file) return;
    const img = new Image();
    img.onload = async ()=>{
        currentImg = img;
        videoElement.classList.add('hidden');
        await faceMesh.send({image:img});
    };
    img.src = URL.createObjectURL(file);
}

// 5️⃣ تحليل النتائج
function performDiagnosis(){
    if(!lastResults || !lastResults.multiFaceLandmarks){
        return alert("يرجى التقاط وجه واضح أولاً");
    }

    const landmarks = lastResults.multiFaceLandmarks[0];

    // مثال تحليل مناطق البشرة (يمكن توسيعه)
    function checkArea(lm){
        const x = Math.floor(lm.x * canvasElement.width);
        const y = Math.floor(lm.y * canvasElement.height);
        const pixel = canvasCtx.getImageData(x,y,1,1).data;
        return (pixel[0]+pixel[1]+pixel[2])/3;
    }

    const forehead = checkArea(landmarks[10]);
    const cheek = checkArea(landmarks[205]);
    const eye = (checkArea(landmarks[130]) + checkArea(landmarks[350]))/2;

    const pigmentDiff = cheek/forehead;
    const eyeDiff = eye/forehead;

    let res = { title:"بشرة مثالية ✅", desc:"توزيع الصبغات متناسق جداً وبشرتك صافية.", score:98 };

    if(eyeDiff < 0.85){
        res = { title:"هالات سوداء مكتشفة 👁️", desc:"تم رصد تباين لوني تحت العين. ننصح بكريمات تحتوي على الكافيين.", score:76 };
    } else if(pigmentDiff < 0.90){
        res = { title:"تصبغات / نمش نشط 🔍", desc:"رصدنا بقع داكنة في الوجنتين. ننصح بسيروم تفتيح وواقي شمس.", score:82 };
    }

    document.getElementById('resultCard').classList.remove('hidden');
    document.getElementById('resTitle').innerText = res.title;
    document.getElementById('resDetails').innerText = res.desc;
    document.getElementById('scoreBox').innerText = `درجة الصحة: ${res.score}%`;
}

// 6️⃣ إرسال واتساب
function sendToWA(){
    const text = `تقرير فيرونا AI: ${document.getElementById('resTitle').innerText}`;
    window.open(`https://wa.me/201063994139?text=${encodeURIComponent(text)}`);
}
