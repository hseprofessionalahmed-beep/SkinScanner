let isModelLoaded = false;

async function initAI() {
    const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks.github.io/face-api.js/weights/';
    try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        isModelLoaded = true;
        document.getElementById('loading-overlay').style.display = 'none';
    } catch (err) { 
        console.error("AI Error", err); 
        // في حال فشل التحميل، نفعل العلم للسماح بالتحليل اللوني المباشر
        isModelLoaded = true; 
    }
}
initAI();

async function analyzeSkin(source) {
    if (!isModelLoaded) return null;
    
    // محاولة اكتشاف الوجه
    const detection = await faceapi.detectSingleFace(source, new faceapi.TinyFaceDetectorOptions());
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 150; canvas.height = 150;

    if (detection) {
        ctx.drawImage(source, detection.box.x, detection.box.y, detection.box.width, detection.box.height, 0, 0, 150, 150);
    } else {
        // إذا لم يجد وجهاً (مثل بعض صور الأطفال)، يحلل مركز الصورة كخطة بديلة
        ctx.drawImage(source, 0, 0, source.width || 300, source.height || 300, 0, 0, 150, 150);
    }

    const data = ctx.getImageData(0, 0, 150, 150).data;
    let red = 0, dark = 0, veryDark = 0, gray = 0;
    let total = data.length / 4;
    
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];
        let avg = (r + g + b) / 3;

        // 1. رصد الاحمرار (الحبوب) - تم رفع العتبة لتقليل الخطأ
        if (r > g + 55 && r > b + 55) red++; 
        
        // 2. رصد التصبغات (النمش والبقع) - إضافة شرط التباين اللوني r > b + 20 
        // لتمييز التصبغ البني عن الظلال الرمادية في وجه الطفل
        if (avg 
