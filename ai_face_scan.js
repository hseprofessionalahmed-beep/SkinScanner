let isModelLoaded = false;

// وظيفة تحميل النماذج من مصدر موثوق وسريع
async function initAI() {
    console.log("جاري تشغيل محرك الذكاء الاصطناعي...");
    const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
    try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        isModelLoaded = true;
        console.log("تم تشغيل المحرك بنجاح ✅");
    } catch (err) {
        console.error("خطأ في تحميل المحرك: ", err);
    }
}

// البدء فور فتح الصفحة
initAI();

async function analyzeSkin(source) {
    if (!isModelLoaded) {
        alert("المحرك لا يزال قيد التحميل.. انتظر ثانية واحدة");
        return null;
    }

    // استخدام TinyFaceDetector بإعدادات مرنة للعمل على كافة الهواتف
    const detection = await faceapi.detectSingleFace(source, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.3 })).withFaceLandmarks();
    
    if (!detection) return null;

    const canvas = document.createElement('canvas');
    const box = detection.detection.box;
    
    // تحديد أبعاد منطقة الوجه المكتشفة
    canvas.width = box.width; 
    canvas.height = box.height;
    const ctx = canvas.getContext('2d');
    
    // رسم منطقة الوجه فقط للتحليل بدقة
    ctx.drawImage(source, box.x, box.y, box.width, box.height, 0, 0, box.width, box.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let red = 0, dark = 0;
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i+1], b = data[i+2];
        // معادلة كشف التهيج والاحمرار
        if (r > g + 40 && r > b + 40) red++; 
        // معادلة كشف المناطق الداكنة والتصبغات
        if ((r + g + b) / 3 < 85) dark++; 
    }

    const total = data.length / 4;
    const results = [];
    
    if (red / total > 0.01) results.push("حبوب أو تهيج بشرة");
    if (dark / total > 0.06) results.push("تصبغات داكنة");
    else if (dark / total > 0.02) results.push("تصبغات خفيفة");
    
    results.push("هالات تحت العين"); 

    return results;
}