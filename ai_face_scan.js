let isModelLoaded = false;

async function initAI() {
    const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/';
    try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        isModelLoaded = true;
        document.getElementById('loading-overlay').style.display = 'none';
        console.log("AI Engine Ready ✅");
    } catch (err) {
        console.error("AI Load Error:", err);
        document.getElementById('loading-overlay').innerText = "فشل تحميل المحرك. يرجى التحديث.";
    }
}

initAI();

async function analyzeSkin(source) {
    if (!isModelLoaded) return null;

    const detection = await faceapi.detectSingleFace(source, new faceapi.TinyFaceDetectorOptions({
        inputSize: 160,
        scoreThreshold: 0.4
    }));

    if (!detection) return null;

    const canvas = document.createElement('canvas');
    const box = detection.box;
    canvas.width = 200;
    canvas.height = 200;
    
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(source, box.x, box.y, box.width, box.height, 0, 0, 200, 200);

    const data = ctx.getImageData(0, 0, 200, 200).data;
    let red = 0, dark = 0, total = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i+1], b = data[i+2];
        if (r > g + 45 && r > b + 45) red++; 
        if ((r + g + b) / 3 < 80) dark++; 
    }

    const redRatio = (red / total) * 100;
    const darkRatio = (dark / total) * 100;
    const problems = [];

    if (redRatio > 1.2) problems.push("حبوب أو تهيج بشرة");
    if (darkRatio > 7) problems.push("تصبغات داكنة");
    else if (darkRatio > 2.0) problems.push("تصبغات خفيفة");
    if (darkRatio > 3.5) problems.push("هالات تحت العين");
    
    return problems.length > 0 ? problems : ["بشرة مستقرة (تحتاج عناية روتينية)"];
}