let isModelLoaded = false;

async function loadModels() {
    const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/';
    try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        isModelLoaded = true;
        document.getElementById('loading-overlay').style.display = 'none';
        console.log("Models Loaded");
    } catch (e) {
        console.error("Model Load Fail", e);
    }
}
loadModels();

async function analyzeSkin(source) {
    if (!isModelLoaded) return null;
    const detection = await faceapi.detectSingleFace(source, new faceapi.TinyFaceDetectorOptions());
    if (!detection) return null;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 150; canvas.height = 150;
    
    // تصحيح تباين الصورة لرصد النمش (الصورة 3) بوضوح
    ctx.filter = 'contrast(1.5) brightness(1.1)';
    ctx.drawImage(source, detection.box.x, detection.box.y, detection.box.width, detection.box.height, 0, 0, 150, 150);

    const imgData = ctx.getImageData(0, 0, 150, 150).data;
    let rSum = 0, gSum = 0, bSum = 0;
    let acneCount = 0, pigmentCount = 0, total = imgData.length / 4;

    for (let i = 0; i < imgData.length; i += 4) {
        let r = imgData[i], g = imgData[i+1], b = imgData[i+2];
        let avg = (r + g + b) / 3;
        rSum += r; gSum += g; bSum += b;

        // رصد الحبوب (أحمر صريح قوي - يمنع خطأ صورة الطفل)
        if (r > g + 60 && r > b + 60) acneCount++;

        // رصد النمش والتصبغات (درجات البني والداكن المتباين)
        if (avg < 110 && r > b + 15) pigmentCount++;
    }

    const avgBright = (rSum + gSum + bSum) / (total * 3);
    let type = avgBright > 180 ? "dry" : (avgBright < 130 ? "oily" : "normal");

    return {
        indicators: {
            type: type,
            acne: (acneCount / total) * 100 > 1.2,
            pigment: (pigmentCount / total) * 100 > 3.5, // حساسية للنمش
            glow: Math.max(10, 100 - (acneCount + pigmentCount) / total * 300),
            hydration: Math.min(99, avgBright / 2.2),
            skinAge: Math.floor(18 + (pigmentCount / total) * 70)
        }
    };
}
