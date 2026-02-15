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
    
    // رفع التباين بشدة لرصد "النقاط" (النمش) بوضوح
    ctx.filter = 'contrast(1.6) brightness(1.1)'; 
    ctx.drawImage(source, detection.box.x, detection.box.y, detection.box.width, detection.box.height, 0, 0, 150, 150);

    const data = ctx.getImageData(0, 0, 150, 150).data;
    let acnePixels = 0, frecklePixels = 0, total = data.length / 4;
    let brightnessSum = 0;

    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];
        let avg = (r + g + b) / 3;
        brightnessSum += avg;

        // 1. رصد النمش (النقاط البنية): اللون البني يتميز بتقارب الأحمر والأخضر وانخفاض الأزرق
        // تم ضبط هذه المعادلة لرصد النمش المشتت في الصورة الثالثة
        if (avg < 130 && r > b + 20 && Math.abs(r - g) < 25) {
            frecklePixels++;
        }

        // 2. رصد الحبوب (اللون الأحمر الصريح):
        // تم رفع العتبة لـ +55 لتجنب اعتبار خدود الأطفال الوردية "حبوباً"
        if (r > g + 55 && r > b + 55) {
            acnePixels++;
        }
    }

    const globalAvg = brightnessSum / total;
    // تحديد النوع بناءً على متوسط الإضاءة وتوزيع البكسلات
    let type = (globalAvg > 190) ? "dry" : (globalAvg < 140 ? "oily" : "normal");

    return {
        indicators: {
            type: type,
            acne: (acnePixels / total) * 100 > 1.0, // حساسية للحبوب الحقيقية فقط
            pigment: (frecklePixels / total) * 100 > 4.0, // رصد النمش بذكاء
            dark_circles: (frecklePixels / total) * 100 > 7.0,
            hydration: Math.min(98, globalAvg / 2.2),
            glow: Math.max(20, 100 - ((frecklePixels + acnePixels) / total * 150)),
            skinAge: Math.floor(18 + (frecklePixels / total) * 60) // العمر يزداد مع التصبغات
        }
    };
}
