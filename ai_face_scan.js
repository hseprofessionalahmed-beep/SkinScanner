let isModelLoaded = false;

// تحميل المكتبة مع روابط بديلة سريعة
async function loadAI() {
    const loader = document.getElementById('loading-overlay');
    try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('https://justadudewhohacks.github.io/face-api.js/weights/');
        isModelLoaded = true;
        if (loader) loader.style.display = 'none';
        console.log("محرك VERONA جاهز");
    } catch (e) {
        console.warn("المحرك الذكي يتأخر، سيتم تفعيل المحلل اللوني البديل");
        isModelLoaded = true; // نعتبرها محملة لتفعيل المسار البديل
    }
}
loadAI();

async function analyzeSkin(source) {
    let detection = null;
    
    // محاولة ذكية أولى (إذا فشلت لن يتوقف البرنامج)
    try {
        const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 128, scoreThreshold: 0.1 });
        detection = await faceapi.detectSingleFace(source, options);
    } catch(e) { console.log("تحول للمسح اللوني المباشر"); }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 150; canvas.height = 150;

    if (detection) {
        const { x, y, width, height } = detection.box;
        ctx.drawImage(source, x, y, width, height, 0, 0, 150, 150);
    } else {
        // الحل السحري: إذا لم يجد وجهاً (مثل صورة الطفل أو النمش)، يحلل مركز الصورة
        ctx.drawImage(source, 0, 0, source.width || 300, source.height || 300, 0, 0, 150, 150);
    }

    const data = ctx.getImageData(0, 0, 150, 150).data;
    let rSum = 0, gSum = 0, bSum = 0, redPoints = 0, darkPoints = 0;

    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];
        rSum += r; gSum += g; bSum += b;
        
        // رصد الاحمرار (حبوب)
        if (r > g + 45 && r > b + 45) redPoints++; 
        // رصد النمش والتصبغات الداكنة
        if ((r + g + b) / 3 < 115 && r > b + 15) darkPoints++; 
    }

    const totalPixels = 150 * 150;
    const avgBright = (rSum + gSum + bSum) / (totalPixels * 3);

    return {
        indicators: {
            type: avgBright > 175 ? "جافة" : (avgBright < 125 ? "دهنية" : "عادية"),
            acne: (redPoints / totalPixels) * 100 > 0.5,
            pigment: (darkPoints / totalPixels) * 100 > 1.2,
            glow: Math.max(25, 100 - (redPoints + darkPoints) / 180),
            hydration: Math.min(99, avgBright / 2.2),
            age: Math.floor(18 + (darkPoints / 800))
        }
    };
}
