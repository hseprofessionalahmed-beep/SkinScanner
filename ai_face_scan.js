console.log("Face scan engine loaded.");

let faceMesh;
let lastResults = null;
let currentImg = null;
const videoElement = document.getElementById('input_video');
const canvasElement = document.getElementById('overlay');
const canvasCtx = canvasElement.getContext('2d', {willReadFrequently:true});

// تهيئة FaceMesh
async function setupFaceMesh() {
    faceMesh = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });
    faceMesh.setOptions({maxNumFaces:1, refineLandmarks:true, minDetectionConfidence:0.5});
    faceMesh.onResults(onResults);
    document.getElementById('status').innerText = "المحرك جاهز للفحص ✅";
}
setupFaceMesh();

// رسم الوجه
function onResults(results) {
    lastResults = results;

    canvasElement.width = canvasElement.clientWidth;
    canvasElement.height = currentImg ? currentImg.height * (canvasElement.width / currentImg.width)
                                      : videoElement.videoHeight * (canvasElement.width / videoElement.videoWidth);

    canvasCtx.save();
    canvasCtx.clearRect(0,0,canvasElement.width,canvasElement.height);
    canvasCtx.drawImage(results.image,0,0,canvasElement.width,canvasElement.height);

    if(results.multiFaceLandmarks) {
        for(const landmarks of results.multiFaceLandmarks){
            drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, {color:'#d4af3744', lineWidth:0.5});
        }
        // تفعيل الزر بعد اكتشاف Landmark
        document.getElementById('scanBtn').classList.remove('hidden');
    }
    canvasCtx.restore();
}

// تعزيز التباين لتحسين كشف التصبغات والنمش
function enhanceSkinContrast(ctx, x, y, w, h){
    let imgData = ctx.getImageData(x,y,w,h);
    let data = imgData.data;
    for(let i=0;i<data.length;i+=4){
        data[i+1] = data[i+1]<128 ? data[i+1]*0.8 : data[i+1]*1.2;
    }
    ctx.putImageData(imgData,x,y);
}

// كشف اللون والتصبغات
function analyzeFaceLandmarks(landmarks){
    // مناطق أساسية
    const forehead = checkArea(landmarks[10]);
    const cheek = checkArea(landmarks[205]);
    const eye = (checkArea(landmarks[130])+checkArea(landmarks[350]))/2;
    const pigmentDiff = cheek/forehead;
    const eyeDiff = eye/forehead;

    return {pigmentDiff, eyeDiff};
}

function checkArea(lm){
    const x = Math.floor(lm.x*canvasElement.width);
    const y = Math.floor(lm.y*canvasElement.height);
    const pixel = canvasCtx.getImageData(x,y,1,1).data;
    return (pixel[0]+pixel[1]+pixel[2])/3;
}

// فتح الكاميرا
function initCamera(){
    currentImg = null;
    videoElement.classList.remove('hidden');
    const camera = new Camera(videoElement,{
        onFrame: async()=>{ await faceMesh.send({image:videoElement}); }
    });
    camera.start();
}

// رفع صورة
function processFile(event){
    const file = event.target.files[0];
    if(!file) return;
    const img = new Image();
    img.onload = async()=>{
        currentImg = img;
        videoElement.classList.add('hidden');
        document.getElementById('status').innerText="يتم الآن رسم خريطة الوجه...";
        await faceMesh.send({image:img});
    };
    img.src = URL.createObjectURL(file);
}
