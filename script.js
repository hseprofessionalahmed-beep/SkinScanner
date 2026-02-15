// 1. قاعدة بيانات المنتجات والمنطق (كانت مفقودة)
const skinTypeLogic = {
    oily: { name: "دهنية", traits: "لمعان ومسام واسعة" },
    dry: { name: "جافة", traits: "ملمس مشدود وقشور" },
    combined: { name: "مختلطة", traits: "T-Zone دهنية" },
    normal: { name: "عادية", traits: "متوازنة" }
};

const expertLogic = {
    pigmentation_surface: {
        title: "تصبغات سطحية / نمش",
        active: "Alpha Arbutin + Vitamin C",
        levels: {
            budget: { name: "Garnier Fast Bright", why: "تفتيح اقتصادي." },
            super: { name: "Natavis Whitening Serum", why: "علاج مركز لتوحيد اللون." },
            premium: { name: "La Roche-Posay Pure Vit C10", why: "نضارة فرنسية طبية." }
        }
    },
    acne: {
        title: "بشرة معرضة للحبوب",
        active: "Salicylic Acid (BHA)",
        levels: {
            budget: { name: "Starville Acne Soap", why: "تنظيف عميق للمسام." },
            super: { name: "Starville Acne Serum", why: "علاج الحبوب وتهدئة البشرة." },
            premium: { name: "Effaclar Duo(+)", why: "علاج متكامل للحبوب والآثار." }
        }
    },
    dark_circles: {
        title: "هالات وإجهاد العين",
        active: "Caffeine + Hyaluronic",
        levels: {
            budget: { name: "Garnier Eye Roll-on", why: "ترطيب وتبريد." },
            super: { name: "Starville Eye Contour", why: "تقليل الهالات والانتفاخ." },
            premium: { name: "Vichy Mineral 89 Eyes", why: "إصلاح حاجز البشرة حول العين." }
        }
    }
};

// 2. متغيرات الجلسة
const video = document.getElementById('video');
const loading = document.getElementById('loading-overlay');
const imgUpload = document.getElementById('imageUpload');
let sessionData = { ai: null, answers: {}, level: 'super' };

// 3. تشغيل الكاميرا
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        video.srcObject = stream;
    } catch (e) { 
        if(loading) loading.innerText = "يرجى السماح بالكاميرا أو رفع صورة";
    }
}
startCamera();

// 4. معالجة الصور
document.getElementById('scanBtn').addEventListener('click', () => processSource(video));
imgUpload.addEventListener('change', async (e) => {
    if (e.target.files[0]) {
        const img = await faceapi.bufferToImage(e.target.files[0]);
        processSource(img);
    }
});

async function processSource(source) {
    loading.style.display = 'flex';
    loading.innerText = "جاري الفحص المجهري...";
    // التأكد من وجود دالة analyzeSkin في الملف الآخر
    if (typeof analyzeSkin === "function") {
        sessionData.ai = await analyzeSkin(source);
        loading.style.display = 'none';
        if (sessionData.ai) showDecisionTree();
    } else {
        alert("خطأ: محرك التحليل لم يتم تحميله بعد.");
    }
}

function showDecisionTree() {
    const results = document.getElementById("results");
    results.style.display = "block";
    const ind = sessionData.ai.indicators;
    
    // إذا كانت البشرة صافية تماماً (مثل حالة الطفل السليم)
    if (!ind.acne && !ind.pigment && ind.glow > 85) {
        renderFinal();
        return;
    }

    let html = `<div class="professional-report"><div class="q-block">`;
    if (ind.pigment) {
        html += `<h3>تحليل البقع المكتشفة:</h3><p>هل تلاحظين أن النمش يزداد وضوحاً مع الشمس؟</p>
                 <button onclick="saveStep('depth', 'surface')">نعم</button>
                 <button onclick="saveStep('depth', 'deep')">لا، بقع ثابتة</button>`;
    } else {
        html += `<p>اكتمل التحليل. عرض النتائج؟</p><button onclick="renderFinal()">نعم</button>`;
    }
    results.innerHTML = html + `</div></div>`;
    results.scrollIntoView({ behavior: 'smooth' });
}

function saveStep(k, v) { sessionData.answers[k] = v; renderFinal(); }

function renderFinal() {
    const results = document.getElementById("results");
    const ind = sessionData.ai.indicators;
    
    results.innerHTML = `
        <div class="professional-report" id="report-to-print">
            <h2 class="report-title">VERONA AI REPORT</h2>
            <div class="analysis-grid">
                <div class="grid-item"><strong>👤 النوع:</strong> <span>${skinTypeLogic[ind.type].name}</span></div>
                <div class="grid-item"><strong>⏳ العمر:</strong> <span>${ind.skinAge} سنة</span></div>
                <div class="grid-item"><strong>💧 الترطيب:</strong> <span>${Math.round(ind.hydration)}%</span></div>
                <div class="grid-item"><strong>🌟 النضارة:</strong> <span>${Math.round(ind.glow)}%</span></div>
                <div class="grid-item"><strong>🚫 الحبوب:</strong> <span>${ind.acne ? 'مرصودة' : 'صافية'}</span></div>
                <div class="grid-item"><strong>✨ التصبغات:</strong> <span>${ind.pigment ? 'موجودة' : 'لا يوجد'}</span></div>
            </div>
            <div class="level-tabs">
                <button id="l-budget" onclick="updateLvl('budget')">اقتصادي</button>
                <button id="l-super" class="active" onclick="updateLvl('super')">سوبر</button>
                <button id="l-premium" onclick="updateLvl('premium')">بريميوم</button>
            </div>
            <div id="report-content"></div>
        </div>`;
    updateLvl('super');
}

function updateLvl(lvl) {
    sessionData.level = lvl;
    document.querySelectorAll('.level-tabs button').forEach(b => b.classList.remove('active'));
    document.getElementById('l-' + lvl).classList.add('active');

    const ind = sessionData.ai.indicators;
    
    if (!ind.acne && !ind.pigment && ind.glow > 85) {
        document.getElementById('report-content').innerHTML = `
            <div class="treatment-box" style="background:#28a745;">
                <h4>بشرة مثالية ✨</h4>
                <p>بشرتك صحية جداً. ننصح فقط بواقي الشمس SPF50.</p>
            </div>`;
        return;
    }

    let key = ind.acne ? 'acne' : (ind.pigment ? 'pigmentation_surface' : 'dark_circles');
    const data = expertLogic[key];
    const p = data.levels[lvl];

    let html = `<div class="treatment-box"><h4>🛡️ الخطة العلاجية:</h4><p>المادة الفعالة: ${data.active}</p></div>`;
    [1, 2, 3].forEach(n => {
        let title = n===1 ? "غسول" : (n===2 ? "علاج" : "حماية");
        let desc = n===1 ? `مناسب للبشرة ${skinTypeLogic[ind.type].name}` : (n===2 ? `<b>${p.name}</b>` : "Sunblock SPF50+");
        html += `<div class="phase-card"><h4>مرحلة ${n}</h4><p>${desc}</p></div>`;
    });
    document.getElementById('report-content').innerHTML = html;
}
