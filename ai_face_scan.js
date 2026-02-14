let isModelLoaded = false;
async function initAI() {
    const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/';
    try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        isModelLoaded = true;
        document.getElementById('loading-overlay').style.display = 'none';
    } catch (err) { console.error("Model Load Error", err); }
}
initAI();

async function analyzeSkin(source) {
    if (!isModelLoaded) return null;
    const detection = await faceapi.detectSingleFace(source, new faceapi.TinyFaceDetectorOptions());
    if (!detection) return null;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 150; canvas.height = 150;
    ctx.drawImage(source, detection.box.x, detection.box.y, detection.box.width, detection.box.height, 0, 0, 150, 150);

    const data = ctx.getImageData(0, 0, 150, 150).data;
    let r = 0, d = 0, vd = 0, s = 0, p = 0, total = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
        let avg = (data[i] + data[i+1] + data[i+2]) / 3;
        if (data[i] > data[i+1] + 55) r++; // Acne/Redness
        if (avg < 95) d++; // Pigment
        if (avg < 50) vd++; // Deep Pigment
        if (avg > 190) s++; // Shine/Oily
        if (avg > 120 && avg < 165) p++; // Pale/Dry
    }

    let skinType = "normal";
    if (s/total > 0.12) skinType = "oily";
    else if (p/total > 0.35) skinType = "dry";

    // العمر التقديري للبشرة (معادلة تعتمد على الاحمرار والبهتان)
    let skinAgeBonus = (r/total)*20 + (vd/total)*30;
    let estimatedAge = Math.floor(22 + skinAgeBonus);

    return {
        indicators: {
            type: skinType,
            acne: (r/total)*100 > 2.5,
            pigment: (d/total)*100 > 10,
            isDeep: (vd/total)*100 > 3,
            dark_circles: (d/total)*100 > 7,
            hydration: Math.max(25, 100 - (p/total)*120),
            glow: Math.max(15, 100 - (r/total)*180),
            skinAge: estimatedAge
        }
    };
}
