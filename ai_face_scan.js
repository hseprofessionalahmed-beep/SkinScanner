let isModelLoaded = false;

async function initAI() {
    // استخدام رابط CDN أكثر استقراراً وسرعة
    const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/weights/';
    try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        isModelLoaded = true;
        console.log("AI Model Loaded Successfully");
        if(document.getElementById('loading-overlay')) {
            document.getElementById('loading-overlay').style.display = 'none';
        }
    } catch (err) { 
        console.error("AI Loading Timeout/Error, switching to manual mode");
        isModelLoaded = true; // تفعيل العلم للسماح بالمسح اليدوي
    }
}
initAI();

async function analyzeSkin(source) {
    let detection = null;

    // محاولة اكتشاف الوجه مع مهلة زمنية قصيرة جداً
    if (isModelLoaded && typeof faceapi !== 'undefined') {
        try {
            detection = await Promise.race([
                faceapi.detectSingleFace(source, new faceapi.TinyFaceDetectorOptions({ inputSize: 128 })),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000))
            ]);
        } catch(e) {
            console.log("Skipping face detection, using direct scan");
        }
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 150; canvas.height = 150;

    // إذا وجد وجهاً يركز عليه، وإذا لم يجد (أو تأخر) يحلل الصورة كاملة
    if (detection) {
        ctx.drawImage(source, detection.box.x, detection.box.y, detection.box.width, detection.box.height, 0, 0, 150, 150);
    } else {
        ctx.drawImage(source, 0, 0, source.width || 300, source.height || 300, 0, 0, 150, 150);
    }

    const data = ctx.getImageData(0, 0, 150, 150).data;
    let red = 0, dark = 0, veryDark = 0, gray = 0;
    let total = data.length / 4;
    
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];
        let avg = (r + g + b) / 3;

        // رصد الاحمرار (الحبوب)
        if (r > g + 55 && r > b + 55) red++; 
        // رصد التصبغات (النمش والبقع) مع فلتر التباين للتمييز عن الظلال
        if (avg < 95 && r > b + 20) dark++; 
        // التصبغات العميقة
        if (avg < 55 && r > b + 15) veryDark++; 
        // الشحوب أو الجفاف
        if (avg < 125 && Math.abs(r - g) < 10) gray++; 
    }

    const acneRatio = (red / total) * 100;
    const pigmentRatio = (dark / total) * 100;

    return {
        indicators: {
            acne: acneRatio > 1.2, 
            pigment: pigmentRatio > 3.0, 
            isDeep: (veryDark / total) * 100 > 2.0,
            dark_circles: pigmentRatio > 7.0,
            dryness: (gray / total) * 100 > 35,
            glow: Math.max(40, 100 - (acneRatio + pigmentRatio) * 4)
        }
    };
}
