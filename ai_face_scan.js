let isModelLoaded = false;

async function initAI() {
    console.log("محاولة تحميل النماذج...");
    
    // روابط النماذج من سيرفر مباشر وموثوق
    const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/weights/';

    try {
        // تحميل النماذج مع التأكد من اكتمال كل واحد
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
        ]);

        isModelLoaded = true;
        console.log("تم التحميل بنجاح! المحرك جاهز.");
        
        // إخفاء رسالة التحميل تلقائياً عند الجاهزية
        const overlay = document.getElementById('loading-overlay');
        if (overlay) overlay.style.display = 'none';

    } catch (err) {
        console.error("فشل التحميل. السبب:", err);
        alert("فشل تحميل محرك AI. تأكد من أنك تفتح الموقع عبر رابط آمن (https) وليس (http).");
    }
}

// بدء التشغيل
initAI();

async function analyzeSkin(source) {
    if (!isModelLoaded) return null;

    try {
        const detection = await faceapi.detectSingleFace(source, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.3 })).withFaceLandmarks();
        
        if (!detection) return null;

        const canvas = document.createElement('canvas');
        const box = detection.detection.box;
        canvas.width = box.width; 
        canvas.height = box.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(source, box.x, box.y, box.width, box.height, 0, 0, box.width, box.height);

        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let red = 0, dark = 0;
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i+1], b = data[i+2];
            if (r > g + 40 && r > b + 40) red++; 
            if ((r + g + b) / 3 < 85) dark++; 
        }

        const total = data.length / 4;
        const results = [];
        if (red / total > 0.015) results.push("حبوب أو تهيج بشرة");
        if (dark / total > 0.06) results.push("تصبغات داكنة");
        else results.push("تصبغات خفيفة");
        results.push("هالات تحت العين"); 

        return results;
    } catch (e) {
        console.error("خطأ تحليل:", e);
        return null;
    }
}