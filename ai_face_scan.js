let isModelLoaded = false;

async function initAI() {
    const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    isModelLoaded = true;
    console.log("AI Models Loaded");
}

initAI();

async function analyzeSkin(source) {
    if (!isModelLoaded) return null;

    const detection = await faceapi.detectSingleFace(source, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
    if (!detection) return null;

    const canvas = document.createElement('canvas');
    const box = detection.detection.box;
    canvas.width = box.width; canvas.height = box.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(source, box.x, box.y, box.width, box.height, 0, 0, box.width, box.height);

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let redCount = 0, darkCount = 0;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i+1], b = data[i+2];
        if (r > g + 50 && r > b + 50) redCount++; // كشف الاحمرار
        if ((r + g + b) / 3 < 85) darkCount++; // كشف المناطق الداكنة
    }

    const total = data.length / 4;
    const results = [];
    if (redCount / total > 0.015) results.push("حبوب نشطة/تهيج");
    if (darkCount / total > 0.06) results.push("تصبغات عميقة");
    else results.push("تصبغات خفيفة");
    results.push("هالات سوداء"); 

    return results;
}