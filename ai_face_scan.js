let isModelLoaded = false;

// استخدام روابط بديلة وأكثر استقراراً للموديلات
async function loadModels() {
    const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/weights/';
    try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        isModelLoaded = true;
        console.log("AI Engine Ready");
        if(document.getElementById('loading-overlay')) {
            document.getElementById('loading-overlay').style.display = 'none';
        }
    } catch (e) {
        console.error("Critical Load Error", e);
        // محاولة التحميل من رابط ثالث في حال فشل الثاني
        await faceapi.nets.tinyFaceDetector.loadFromUri('https://raw.githubusercontent.com/ml5js/ml5-data-and-models/main/models/faceapi/weights/');
        isModelLoaded = true;
    }
}
loadModels();

async function analyzeSkin(source) {
    if (!isModelLoaded) {
        alert("المحرك لا يزال يستعد.. يرجى المحاولة بعد 3 ثواني");
        return null;
    }

    // محاولة التعرف بإعدادات "فائقة الحساسية"
    const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 128, scoreThreshold: 0.1 });
    let detection = await faceapi.detectSingleFace(source, options);
    
    // إذا لم يجد وجهاً (مثل صورة الطفل أو النمش)، سنحاول تكبير وتفتيح الصورة برمجياً
    if (!detection) {
        console.log("محاولة ثانية بتباين أعلى...");
        const boostCanvas = document.createElement('canvas');
        const bCtx = boostCanvas.getContext('2d');
        boostCanvas.width = source.width || source.videoWidth;
        boostCanvas.height = source.height || source.videoHeight;
        bCtx.filter = 'brightness(1.3) contrast(1.5)';
        bCtx.drawImage(source, 0, 0);
        detection = await faceapi.detectSingleFace(boostCanvas, options);
    }

    if (!detection) return null;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 150; canvas.height = 150;
    
    // قص منطقة الوجه بدقة
    const box = detection.box;
    ctx.drawImage(source, box.x, box.y, box.width, box.height, 0, 0, 150, 150);

    const imgData = ctx.getImageData(0, 0, 150, 150).data;
    let acne = 0, pigment = 0, rSum = 0, gSum = 0, bSum = 0;

    for (let i = 0; i < imgData.length; i += 4) {
        let r = imgData[i], g = imgData[i+1], b = imgData[i+2];
        rSum += r; gSum += g; bSum += b;
        
        // رصد الحبوب (أحمر)
        if (r > g + 50 && r > b + 50) acne++;
        // رصد النمش (بني/داكن متباين)
        if ((r+g+b)/3 < 125 && r > b + 15) pigment++;
    }

    const avg = (rSum + gSum + bSum) / (imgData.length * 0.75);
    return {
        indicators: {
            type: avg > 180 ? "dry" : (avg < 130 ? "oily" : "normal"),
            acne: (acne / (imgData.length/4)) * 100 > 0.5,
            pigment: (pigment / (imgData.length/4)) * 100 > 1.5,
            glow: Math.max(20, 100 - (acne + pigment)/500),
            hydration: Math.min(99, avg / 2.2),
            skinAge: Math.floor(20 + (pigment/2000))
        }
    };
}
