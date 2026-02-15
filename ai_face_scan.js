let isModelLoaded = false;
async function initAI() {
    const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/';
    try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
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
    canvas.width = 150; canvas.height = 150;
    ctx.drawImage(source, detection.box.x, detection.box.y, detection.box.width, detection.box.height, 0, 0, 150, 150);

    const data = ctx.getImageData(0, 0, 150, 150).data;
    let red = 0, dark = 0, veryDark = 0, gray = 0, total = data.length / 4;
    
    for (let i = 0; i < data.length; i += 4) {
        let avg = (data[i] + data[i+1] + data[i+2]) / 3;
        if (data[i] > data[i+1] + 60) red++; 
        if (avg < 90) dark++; 
        if (avg < 55) veryDark++; 
        if (avg < 125) gray++; 
    }

    return {
        indicators: {
            acne: (red/total)*100 > 2.5,
            pigment: (dark/total)*100 > 10,
            isDeep: (veryDark/total)*100 > 3.5,
            dark_circles: (dark/total)*100 > 8,
            dryness: (gray/total)*100 > 35
        }
    };
}
