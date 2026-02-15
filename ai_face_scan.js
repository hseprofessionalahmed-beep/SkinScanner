let isModelLoaded = false;

async function loadAI() {
    try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('https://justadudewhohacks.github.io/face-api.js/weights/');
        isModelLoaded = true;
        console.log("AI Ready");
    } catch (e) {
        console.warn("Using Color Scan Mode");
        isModelLoaded = true;
    }
}
loadAI();

async function analyzeSkin(source) {
    let detection = null;
    if (isModelLoaded) {
        try {
            const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 128, scoreThreshold: 0.1 });
            detection = await faceapi.detectSingleFace(source, options);
        } catch(e) {}
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 150; canvas.height = 150;

    if (detection) {
        const { x, y, width, height } = detection.box;
        ctx.drawImage(source, x, y, width, height, 0, 0, 150, 150);
    } else {
        // إذا لم يجد وجهاً، يحلل وسط الصورة تلقائياً
        ctx.drawImage(source, 0, 0, source.width || 300, source.height || 300, 0, 0, 150, 150);
    }

    const data = ctx.getImageData(0, 0, 150, 150).data;
    let rSum = 0, gSum = 0, bSum = 0, acne = 0, pigment = 0;

    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];
        rSum += r; gSum += g; bSum += b;
        if (r > g + 40 && r > b + 40) acne++;
        if ((r + g + b) / 3 < 120 && r > b + 15) pigment++;
    }

    const avg = (rSum + gSum + bSum) / (150 * 150 * 3);
    return {
        indicators: {
            type: avg > 170 ? "جافة" : (avg < 120 ? "دهنية" : "عادية"),
            acne: (acne / 22500) * 100 > 0.5,
            pigment: (pigment / 22500) * 100 > 1.0,
            glow: Math.max(30, 100 - (acne + pigment)/150),
            hydration: Math.min(99, avg / 2.2),
            age: Math.floor(18 + (pigment / 900))
        }
    };
}
