const video = document.getElementById('video');
const loading = document.getElementById('loading-overlay');
const imgUpload = document.getElementById('imageUpload');
let sessionData = { ai: null, answers: {}, level: 'super' };

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        video.srcObject = stream;
    } catch (e) { console.error("Camera access denied"); }
}
startCamera();

document.getElementById('scanBtn').addEventListener('click', () => processSource(video));
imgUpload.addEventListener('change', async (e) => {
    if (e.target.files[0]) {
        const img = await faceapi.bufferToImage(e.target.files[0]);
        processSource(img);
    }
});

async function processSource(source) {
    loading.style.display = 'flex';
    loading.innerText = "تحليل VERONA الرقمي...";
    sessionData.ai = await analyzeSkin(source);
    loading.style.display = 'none';
    if (sessionData.ai) showDecisionTree();
}

function showDecisionTree() {
    const results = document.getElementById("results");
    results.style.display = "block";
    const ind = sessionData.ai.indicators;
    
    // إذا كانت البشرة صافية (تحت حد المشاكل)، اظهر التقرير فوراً
    if (!ind.acne && !ind.pigment && !ind.dark_circles) {
        renderFinal();
        return;
    }

    let html = `<div class="professional-report"><div class="q-block">`;
    if (ind.pigment) {
        html += `<h3>تحليل التصبغات:</h3><p>هل تلاحظين أن البقع تزداد قتامة عند التعرض للشمس؟</p>
                 <button onclick="saveStep('depth', 'deep')">نعم (عميقة)</button>
                 <button onclick="saveStep('depth', 'surface')">لا (سطحية)</button>`;
    } else {
        html += `<p>تم جمع البيانات. هل نعرض التقرير النهائي؟</p>
                 <button onclick="renderFinal()">عرض النتيجة</button>`;
    }
    results.innerHTML = html + `</div></div>`;
}

function saveStep(k, v) { sessionData.answers[k] = v; renderFinal(); }

function renderFinal() {
    const results = document.getElementById("results");
    const ind = sessionData.ai.indicators;
    
    results.innerHTML = `
        <div class="professional-report" id="report-to-print">
            <h2 class="report-title">VERONA SKIN REPORT</h2>
            <div class="analysis-grid">
                <div class="grid-item"><strong>👤 نوع البشرة:</strong> <span>${skinTypeLogic[ind.type].name}</span></div>
                <div class="grid-item"><strong>⏳ عمر البشرة:</strong> <span>${ind.skinAge} سنة</span></div>
                <div class="grid-item"><strong>💧 الترطيب:</strong> <span>${Math.round(ind.hydration)}%</span></div>
                <div class="grid-item"><strong>🌟 النضارة:</strong> <span>${Math.round(ind.glow)}%</span></div>
                <div class="grid-item"><strong>🚫 الحبوب:</strong> <span>${ind.acne ? 'نشطة' : 'صافية'}</span></div>
                <div class="grid-item"><strong>✨ التصبغات:</strong> <span>${ind.pigment ? 'تحتاج علاج' : 'لا يوجد'}</span></div>
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
    const ind = sessionData.ai.indicators;
    
    // حالة البشرة المثالية (التقرير الأخضر)
    if (!ind.acne && !ind.pigment && !ind.dark_circles) {
        document.getElementById('report-content').innerHTML = `
            <div class="treatment-box" style="background:#28a745; border:none;">
                <h4>✅ حالة البشرة: ممتازة</h4>
                <p>بشرتك تبدو رائعة ومستقرة تماماً. الذكاء الاصطناعي لم يرصد أي مشاكل علاجية تستدعي التدخل. استمري على الحماية اليومية SPF للحفاظ على هذا الصفاء.</p>
            </div>
            <button class="wa-btn" onclick="sendWA()">إرسال التقرير ✅</button>
            <button class="primary-btn" style="width:100%; margin-top:10px; background:#444;" onclick="downloadPDF()">تحميل التقرير PDF 📄</button>`;
        return;
    }

    let key = ind.acne ? 'acne' : (ind.pigment ? (sessionData.answers.depth === 'deep' ? 'pigmentation_deep' : 'pigmentation_surface') : 'dark_circles');
    const data = expertLogic[key];
    const p = data.levels[lvl];

    let html = `<div class="treatment-box"><h4>🛡️ الخطة العلاجية:</h4><p>المادة الفعالة: ${data.active}</p></div>`;
    [1, 2, 3].forEach(n => {
        let title = n===1 ? "التهيئة" : (n===2 ? "العلاج" : "الوقاية");
        let desc = n===1 ? `غسول ملائم للبشرة ${skinTypeLogic[ind.type].name}` : (n===2 ? `<b>${p.name}</b><br><small>${p.why}</small>` : "Sunblock SPF50+");
        html += `<div class="phase-card"><h4>مرحلة ${n}: ${title}</h4><div class="p-item">${desc}</div></div>`;
    });

    document.getElementById('report-content').innerHTML = html + `
        <button class="wa-btn" onclick="sendWA()">إرسال واتساب ✅</button>
        <button class="primary-btn" style="width:100%; margin-top:10px; background:#444;" onclick="downloadPDF()">تحميل PDF 📄</button>`;
}

function downloadPDF() {
    const element = document.getElementById("report-to-print");
    html2pdf().from(element).save('Verona_Report.pdf');
}
