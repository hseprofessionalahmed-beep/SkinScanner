let isModelLoaded = false;

async function loadModels() {
    // تحميل المكتبة من سيرفرات سريعة لضمان عدم التعليق
    const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/';
    try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        isModelLoaded = true;
        const loader = document.getElementById('loading-overlay');
        if(loader) loader.style.display = 'none';
        console.log("VERONA AI Engine: Ready");
    } catch (e) {
        console.error("Models failed to load", e);
    }
}
loadModels();

async function analyzeSkin(source) {
    if (!isModelLoaded) return null;

    // خفض عتبة الحساسية (scoreThreshold) لضمان التعرف على وجه الطفل والنمش
    const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.2 });
    const detection = await faceapi.detectSingleFace(source, options);
    
    if (!detection) return null;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 150; canvas.height = 150;
    
    // فلتر (contrast) لإبراز النمش الباهت في الصورة الثالثة
    ctx.filter = 'contrast(1.5) brightness(1.1)';
    ctx.drawImage(source, detection.box.x, detection.box.y, detection.box.width, detection.box.height, 0, 0, 150, 150);

    const imgData = ctx.getImageData(0, 0, 150, 150).data;
    let rSum = 0, gSum = 0, bSum = 0;
    let acneCount = 0, pigmentCount = 0, total = imgData.length / 4;

    for (let i = 0; i < imgData.length; i += 4) {
        let r = imgData[i], g = imgData[i+1], b = imgData[i+2];
        let avg = (r + g + b) / 3
