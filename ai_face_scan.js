let isModelLoaded = false;

async function initAI() {
    const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/';
    try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        isModelLoaded = true;
        console.log("AI Ready ✅");
        if(document.getElementById('loading-overlay')) {
            document.getElementById('loading-overlay').style.display = 'none';
        }
    } catch (err) {
        console.error("AI Load Error:", err);
    }
}
initAI();

async function analyzeSkin(source) {
    if (!isModelLoaded) return null;

    // اكتشاف الوجه مع حساسية متوسطة لضمان التقاط الملامح
    const detection = await faceapi.detectSingleFace(source, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 }));
    
    if (!detection) return null;

    const canvas = document.createElement('canvas');
    const box = detection.box;
    canvas.width = 150; 
    canvas.height = 150;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    // رسم منطقة الوجه فقط للتحليل
    ctx.drawImage(source, box.x, box.y, box.width, box.height, 0, 0, 150, 150);

    const imageData = ctx.getImageData(0, 0, 150, 150);
    const data = imageData.data;

    let redSum = 0;
    let darkSum = 0;
    let totalPixels = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i+1], b = data[i+2];

        // كشف الاحمرار (الحبوب): اللون الأحمر أعلى من الأخضر والأزرق بفرق واضح
        if (r > g + 60 && r > b + 60) redSum++;

        // كشف التصبغات (السطوع): قياس مدى قتامة البكسل
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
        if (luminance < 80) darkSum++;
    }

    const redPercent = (redSum / totalPixels) * 100;
    const darkPercent = (darkSum / totalPixels) * 100;

    const problems = [];
    
    // المنطق البرمجي المتغير (النتائج لن تظهر إلا إذا تجاوزت النسب الحدود التالية)
    if (redPercent > 2.5) {
        problems.push("حبوب أو تهيج بشرة");
    }
    
    if (darkPercent > 12) {
        problems.push("تصبغات داكنة");
    } else if (darkPercent > 4) {
        problems.push("تصبغات خفيفة");
    }
    
    if (darkPercent > 7) {
        problems.push("هالات تحت العين");
    }

    // في حال كانت البشرة صافية تماماً
    if (problems.length === 0) {
        problems.push("بشرة صافية (تحتاج روتين نضارة)");
    }

    return problems;
}