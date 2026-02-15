const videoElement = document.getElementById('input_video');
const canvasElement = document.getElementById('overlay');
const canvasCtx = canvasElement.getContext('2d', {willReadFrequently:true});
let faceMesh;
let lastResults = null;
let currentImg = null;

async function setupFaceMesh() {
    faceMesh = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });
    faceMesh.setOptions({ maxNumFaces: 1, refineLandmarks: true, minDetectionConfidence: 0.5 });
    faceMesh.onResults(onResults);
    document.getElementById('status').innerText = "المحرك جاهز للفحص ✅";
}
setupFaceMesh();

function onResults(results) {
    lastResults = results;
    canvasElement.width = canvasElement.clientWidth;
    canvasElement.height = (currentImg) ? (currentImg.height*(canvasElement.width/currentImg.width)) : videoElement.videoHeight*(canvasElement.width/videoElement.videoWidth);

    canvasCtx.save();
    canvasCtx.clearRect(0,0,canvasElement.width,canvasElement.height);
    canvasCtx.drawImage(results.image,0,0,canvasElement.width,canvasElement.height);

    if (results.multiFaceLandmarks) {
        for (const landmarks of results.multiFaceLandmarks) {
            drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, {color:'#d4af3744', lineWidth:0.5});
        }
    }
    canvasCtx.restore();
}

async function initCamera() {
    currentImg = null;
    videoElement.classList.remove('hidden');
    const camera = new Camera(videoElement, {
        onFrame: async () => { await faceMesh.send({image:videoElement}); }
    });
    camera.start();
}

function processFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    const img = new Image();
    img.onload = async () => {
        currentImg = img;
        videoElement.classList.add('hidden');
        document.getElementById('status').innerText = "يتم الآن رسم خريطة الوجه...";
        await faceMesh.send({image:img});
    };
    img.src = URL.createObjectURL(file);
}
