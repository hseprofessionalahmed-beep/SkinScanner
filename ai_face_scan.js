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
    const detection = await faceapi.detectSingleFace(source, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 }));
    if (!detection) return null;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    canvas.width = 100; canvas.height = 100;
    ctx.drawImage(source, detection.box.x, detection.box.y, detection.box.width, detection.box.height, 0, 0, 100, 100);

    const data = ctx.getImageData(0, 0, 100, 100).data;
    let rPixels = 0, dPixels = 0, total = data.length / 4;
    for (let i = 0; i < data.length; i += 4) {
        if (data[i] > data[i+1] + 65) rPixels++; // حساس للاحمرار
        if ((data[i] + data[i+1] + data[i+2]) / 3 < 75) dPixels++; // حساس للتصبغ
    }

    const redP = (rPixels / total) * 100, darkP = (dPixels / total) * 100;
    let problems = [];
    if (redP > 3.5) problems.push("حبوب أو تهيج");
    if (darkP > 15) problems.push("تصبغات داكنة");
    else if (darkP > 6) problems.push("تصبغات خفيفة");
    if (darkP > 10) problems.push("هالات");

    return { 
        problems: problems.length > 0 ? problems : ["بشرة صحية ومستقرة ✨"], 
        sensitivity: redP > 6 ? "حساسة" : "تتحمل" 
    };
}
