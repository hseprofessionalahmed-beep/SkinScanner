let isModelLoaded = false;

async function initAI() {
    const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/weights/';
    try {
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
        ]);
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
    const box = detection.box;
    canvas.width = 200;
    canvas.height = 200;
    
    // تفعيل willReadFrequently لتحسين أداء قراءة البكسلات
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(source, box.x, box.y, box.width, box.height, 0, 0, 200, 200);

    const data = ctx.getImageData(0, 0, 200, 200).data;
    let red = 0, dark = 0, total = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i+1], b = data[i+2];
        if (r > g + 50 && r > b + 50) red++; 
        if ((r + g + b) / 3 < 85) dark++; 
    }

    const redRatio = (red / total) * 100;
    const darkRatio = (dark / total) * 100;
    const problems = [];

    if (redRatio > 1.5) problems.push("حبوب أو تهيج بشرة");
    if (darkRatio > 8) problems.push("تصبغات داكنة");
    else if (darkRatio > 2.5) problems.push("تصبغات خفيفة");
    if (darkRatio > 4) problems.push("هالات تحت العين");
    
    return problems.length > 0 ? problems : ["بشرة مستقرة (تحتاج عناية روتينية)"];
}