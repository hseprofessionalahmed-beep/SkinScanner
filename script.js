// script.js
console.log("Main skin scan script loaded.");

// عناصر DOM
const scanBtn = document.getElementById('scanBtn');
const resultCard = document.getElementById('resultCard');
const resTitle = document.getElementById('resTitle');
const resDetails = document.getElementById('resDetails');
const scoreBox = document.getElementById('scoreBox');

// تفعيل زر التحليل فقط بعد التقاط صورة أو تفعيل الكاميرا
function enableScanButton() {
    scanBtn.disabled = false;
    scanBtn.style.opacity = 1;
}

// مراقبة lastResults لتفعيل الزر تلقائياً
setInterval(() => {
    if (window.lastResults && window.lastResults.multiFaceLandmarks) {
        enableScanButton();
    }
}, 500);

// 1️⃣ دالة تحليل البشرة بدقة
function performDiagnosis() {
    if (!window.lastResults || !window.lastResults.multiFaceLandmarks) {
        return alert("يرجى التقاط وجه واضح أولاً");
    }

    const landmarks = window.lastResults.multiFaceLandmarks[0];
    const ctx = document.getElementById('overlay').getContext('2d');
    const canvas = document.getElementById('overlay');

    // تحسين دقة التصبغات في الوجنتين
    const cheekX = Math.floor(landmarks[205].x * canvas.width);
    const cheekY = Math.floor(landmarks[205].y * canvas.height);
    enhanceSkinContrast(ctx, cheekX-20, cheekY-20, 40, 40);

    // مناطق التحليل
    const forehead = getAverageLum(landmarks[10], ctx, canvas);
    const cheek = getAverageLum(landmarks[205], ctx, canvas);
    const eye = (getAverageLum(landmarks[130], ctx, canvas) + getAverageLum(landmarks[350], ctx, canvas)) / 2;

    const pigmentDiff = cheek / forehead;
    const eyeDiff = eye / forehead;

    let res = {
        title: "بشرة مثالية ✅",
        desc: "توزيع الصبغات متناسق جداً وبشرتك صافية.",
        score: 98,
        routine: buildRoutine([])
    };

    // اكتشاف الهالات
    if (eyeDiff < 0.85) {
        res.title = "هالات سوداء تحت العين 👁️";
        res.desc = "تم رصد تباين لوني تحت العين. ننصح باستخدام كريمات تحتوي على الكافيين أو فيتامين K.";
        res.score = 76;
        res.routine = buildRoutine(['dark_circles']);
    }
    // اكتشاف التصبغات / نمش
    else if (pigmentDiff < 0.90) {
        res.title = "تصبغات / نمش نشط 🔍";
        res.desc = "رصدنا بقع داكنة في الوجنتين. ننصح بسيروم تفتيح وواقي شمس عالي الحماية.";
        res.score = 82;
        res.routine = buildRoutine(['pigmentation']);
    }

    // عرض النتائج
    resultCard.classList.remove('hidden');
    resTitle.innerText = res.title;
    resDetails.innerText = res.desc;
    scoreBox.innerText = `درجة الصحة: ${res.score}%`;

    // تخزين الروتين النهائي للواتساب
    window.finalRoutine = res.routine;
}

// 2️⃣ دالة لحساب متوسط الإضاءة في نقطة
function getAverageLum(lm, ctx, canvas) {
    const x = Math.floor(lm.x * canvas.width);
    const y = Math.floor(lm.y * canvas.height);
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    return (pixel[0] + pixel[1] + pixel[2]) / 3;
}

// 3️⃣ بناء روتين حسب المشكلة
function buildRoutine(issues) {
    let routine = "🧴 روتين البشرة المخصص لك:\n\n";
    
    // المراحل الأساسية
    routine += "🌟 مرحلة الترطيب:\n";
    routine += "- سيروم فيتامين C + Hyaluronic Acid\n";
    routine += "- كريم مرطب يومي\n\n";

    routine += "🔬 مرحلة العلاج:\n";
    if (issues.includes('dark_circles')) {
        routine += "- كريم هالات الكافيين/فيتامين K مرتين يومياً\n";
    }
    if (issues.includes('pigmentation')) {
        routine += "- سيروم Alpha Arbutin / Tranexamic Acid صباحاً ومساء\n";
    }
    if (issues.length === 0) {
        routine += "- لا مشاكل ملحوظة، استمر بالترطيب اليومي\n";
    }
    routine += "\n☀️ مرحلة الحماية:\n";
    routine += "- واقي شمس SPF50 يومياً\n";

    return routine;
}

// 4️⃣ إرسال الروتين واتساب
function sendToWA() {
    if (!window.finalRoutine) return alert("لا يوجد روتين لإرساله بعد.");
    const text = encodeURIComponent(`تقرير فيرونا AI:\n${document.getElementById('resTitle').innerText}\n\n${window.finalRoutine}`);
    window.open(`https://wa.me/201063994139?text=${text}`, "_blank");
}
