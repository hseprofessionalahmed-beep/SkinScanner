let isModelLoaded = false;
async function initAI() {
    const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/';
    try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        isModelLoaded = true;
        document.getElementById('loading-overlay').style.display = 'none';
    } catch (err) { console.error("AI Error", err); }
}
initAI();

async function analyzeSkin(source) {
    if (!isModelLoaded) return null;
    const detection = await faceapi.detectSingleFace(source, new faceapi.TinyFaceDetectorOptions());
    if (!detection) return null;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 100; canvas.height = 100;
    ctx.drawImage(source, detection.box.x, detection.box.y, detection.box.width, detection.box.height, 0, 0, 100, 100);

    const data = ctx.getImageData(0, 0, 100, 100).data;
    let r = 0, d = 0, total = data.length / 4;
    for (let i = 0; i < data.length; i += 4) {
        if (data[i] > data[i+1] + 60) r++;
        if ((data[i] + data[i+1] + data[i+2]) / 3 < 75) d++;
    }

    return {
        indicators: {
            acne: (r/total)*100 > 3 ? 'High' : 'Low',
            pigment: (d/total)*100 > 12 ? 'High' : 'Low'
        }
    };
}
