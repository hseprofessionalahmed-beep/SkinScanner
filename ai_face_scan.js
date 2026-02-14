let isModelLoaded = false;

// استخدام روابط بديلة وأكثر استقراراً لنماذج face-api
async function initAI() {
    console.log("بدء تحميل نماذج الذكاء الاصطناعي...");
    
    // روابط النماذج من مستودع موثوق
    const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/';
    
    try {
        // تحميل النماذج الأساسية فقط لتقليل وقت الانتظار
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        
        isModelLoaded = true;
        console.log("تم تحميل محرك الذكاء الاصطناعي بنجاح ✅");
        
        // إخفاء رسالة التحليل إذا كانت ظاهرة
        if(document.getElementById('loading-overlay')) {
            document.getElementById('loading-overlay').style.display = 'none';
        }
    } catch (err) {
        console.error("خطأ تقني في تحميل النماذج: ", err);
        alert("فشل تحميل محرك الـ AI. يرجى التأكد من اتصال الإنترنت وتحديث الصفحة.");
    }
}

// البدء فوراً
initAI();

async function analyzeSkin(source) {
    if (!isModelLoaded) {
        alert("المحرك لم يكتمل تحميله بعد، يرجى تحديث الصفحة.");
        return null;
    }

    try {
        // الكشف عن الوجه
        const detection = await faceapi.detectSingleFace(source, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.4 })).withFaceLandmarks();
        
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
        if (dark / total > 0.07) results.push("تصبغات داكنة");
        else results.push("تصبغات خفيفة");
        results.push("هالات تحت العين"); 

        return results;
    } catch (e) {
        console.error("خطأ أثناء التحليل: ", e);
        return null;
    }
}