let isModelLoaded = false;

async function loadAI() {
    const loader = document.getElementById('loading-overlay');
    try {
        // تحميل موديل خفيف جداً وسريع
        await faceapi.nets.tinyFaceDetector.loadFromUri('https://justadudewhohacks.github.io/face-api.js/weights/');
        isModelLoaded = true;
        if (loader) loader.style.display = 'none';
        console.log("محرك VERONA جاهز");
    } catch (e) {
        if (loader) loader.innerText = "فشل في الاتصال بالمحرك، يرجى التحديث";
    }
}
loadAI();

async function analyzeSkin(source) {
    if (!isModelLoaded) return null;

    // خفض مستوى الثقة لـ 0.05 (يعني سيتعرف على الوجه حتى لو كان غير واضح تماماً)
    const detectorOptions = new faceapi.TinyFaceDetectorOptions({ inputSize: 128, scoreThreshold: 0.05 });
    
    let detection = await faceapi.detectSingleFace(source, detectorOptions);

    // إذا فشل، سنقوم بتصغير الصورة يدوياً (هذا هو الحل السحري لمشاكل المعرض)
    if (!detection) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 300; // حجم قياسي للفحص
        canvas.height = 300;
        ctx.drawImage(source, 0, 0, 300, 300);
        detection = await faceapi.detectSingleFace(canvas, detectorOptions);
        source = canvas; // استخدام الصورة المصغرة في التحليل اللوني
    }

    if (!detection) return null;

    // التحليل اللوني (الحبوب والنمش)
    const crop = document.createElement('canvas');
    const cCtx = crop.getContext('2d');
    crop.width = 100; crop.height = 100;
    const box = detection.box;
    cCtx.drawImage(source, box.x, box.y, box.width, box.height, 0, 0, 100, 100);

    const data = cCtx.getImageData(0, 0, 100, 100).data;
    let acne = 0, pigment = 0, rSum = 0, gSum = 0, bSum = 0;

    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];
        rSum += r; gSum += g; bSum += b;
        if (r > g + 50 && r > b + 50) acne++; // رصد الاحمرار
        if ((r+g+b)/3 < 115 && r > b + 15) pigment++; // رصد التصبغات/النمش
    }

    const avg = (rSum + gSum + bSum) / (data.length * 0.75);
    return {
        indicators: {
            type: avg > 180 ? "جافة" : (avg < 130 ? "دهنية" : "عادية"),
            acne: (acne / 2500) * 100 > 0.5,
            pigment: (pigment / 2500) * 100 > 1.2,
            glow: Math.max(30, 100 - (acne + pigment)/50),
            hydration: Math.min(99, avg / 2.3),
            age: Math.floor(18 + (pigment / 500))
        }
    };
}
