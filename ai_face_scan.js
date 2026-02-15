let isModelLoaded = false;

async function loadAI() {
    const loader = document.getElementById('loading-overlay');
    // محاولة التحميل من مصادر متعددة لضمان الاستمرارية
    const modelSources = [
        'https://justadudewhohacks.github.io/face-api.js/weights/',
        'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/'
    ];

    for (let source of modelSources) {
        try {
            await faceapi.nets.tinyFaceDetector.loadFromUri(source);
            isModelLoaded = true;
            if (loader) loader.style.display = 'none';
            console.log("AI Ready");
            return;
        } catch (e) {
            console.error("Failed source:", source);
        }
    }
    if (loader) loader.innerText = "فشل تحميل المحرك، يرجى التحديث";
}
loadAI();

async function analyzeSkin(source) {
    if (!isModelLoaded) return null;

    // إعدادات حساسة جداً للتعرف على الأطفال والنمش
    const detectorOptions = new faceapi.TinyFaceDetectorOptions({ inputSize: 160, scoreThreshold: 0.1 });
    let detection = await faceapi.detectSingleFace(source, detectorOptions);

    if (!detection) {
        // محاولة ثانية بفلتر تباين إذا فشلت الأولى
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = source.width || source.videoWidth;
        canvas.height = source.height || source.videoHeight;
        ctx.filter = 'contrast(1.4) brightness(1.1)';
        ctx.drawImage(source, 0, 0);
        detection = await faceapi.detectSingleFace(canvas, detectorOptions);
    }

    if (!detection) return null;

    const crop = document.createElement('canvas');
    const cCtx = crop.getContext('2d');
    crop.width = 150; crop.height = 150;
    const { x, y, width, height } = detection.box;
    cCtx.drawImage(source, x, y, width, height, 0, 0, 150, 150);

    const data = cCtx.getImageData(0, 0, 150, 150).data;
    let acne = 0, freckles = 0, rSum = 0, gSum = 0, bSum = 0;

    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];
        rSum += r; gSum += g; bSum += b;
        // خوارزمية رصد الحبوب والنمش
        if (r > g + 55 && r > b + 55) acne++;
        if ((r+g+b)/3 < 125 && r > b + 18) freckles++;
    }

    const avg = (rSum + gSum + bSum) / (data.length * 0.75);
    return {
        indicators: {
            type: avg > 180 ? "dry" : (avg < 130 ? "oily" : "normal"),
            acne: (acne / 5625) * 100 > 0.6,
            pigment: (freckles / 5625) * 100 > 1.5,
            glow: Math.max(20, 100 - (acne + freckles)/150),
            hydration: Math.min(99, avg / 2.3),
            age: Math.floor(18 + (freckles / 2000))
        }
    };
}
