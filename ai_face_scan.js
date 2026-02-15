let isModelLoaded = false;
async function initAI() {
    const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/';
    try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        isModelLoaded = true;
        document.getElementById('loading-overlay').style.display = 'none';
    } catch (err) { console.error("AI Error:", err); }
}
initAI();

async function analyzeSkin(source) {
    if (!isModelLoaded) return null;
    const detection = await faceapi.detectSingleFace(source, new faceapi.TinyFaceDetectorOptions());
    if (!detection) return null;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 150; canvas.height = 150;
    
    // --- فلتر معالجة الإضاءة التلقائي قبل التحليل ---
    ctx.filter = 'brightness(1.1) contrast(1.1)'; 
    ctx.drawImage(source, detection.box.x, detection.box.y, detection.box.width, detection.box.height, 0, 0, 150, 150);

    const data = ctx.getImageData(0, 0, 150, 150).data;
    let r = 0, d = 0, vd = 0, s = 0, p = 0, total = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
        let avg = (data[i] + data[i+1] + data[i+2]) / 3;
        
        if (data[i] > data[i+1] + 75) r++; // احمرار/حبوب
        if (avg < 55) d++; // تصبغات (تم تقليل الحساسية لتجاوز الظلال)
        if (avg < 30) vd++; // تصبغات عميقة
        if (avg > 225) s++; // لمعان دهني
        if (avg > 140 && avg < 180) p++; // بهتان/جفاف
    }

    let skinType = "normal";
    if (s/total > 0.22) skinType = "oily";
    else if (p/total > 0.48) skinType = "dry";

    let baseAge = 18;
    let finalAge = Math.floor(baseAge + (r/total)*20 + (vd/total)*40);

    return {
        indicators: {
            type: skinType,
            acne: (r/total)*100 > 5.0, 
            pigment: (d/total)*100 > 15, 
            isDeep: (vd/total)*100 > 6,
            dark_circles: (d/total)*100 > 14,
            hydration: Math.max(45, 100 - (p/total)*110),
            glow: Math.max(35, 100 - (r/total)*160),
            skinAge: finalAge
        }
    };
}
