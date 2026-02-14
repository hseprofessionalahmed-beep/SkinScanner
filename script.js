const video = document.getElementById('video');
const loading = document.getElementById('loading-overlay');
const imgUpload = document.getElementById('imageUpload');
let sessionData = { ai: null, answers: {}, level: 'super' };

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        video.srcObject = stream;
    } catch (e) { console.log("Camera Blocked"); }
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
    sessionData.ai = await analyzeSkin(source);
    loading.style.display = 'none';
    if (sessionData.ai) showDecisionTree();
}

function showDecisionTree() {
    const results = document.getElementById("results");
    results.style.display = "block";
    const ind = sessionData.ai.indicators;
    
    let html = `<div class="professional-report">
        <div class="confirmed-issues-panel" style="background:#f0f7ff; border-color:#bee3f8;">
            <h4>🔍 تحليل فيرونا الأولي:</h4>
            <p>تم رصد مؤشرات لـ: ${ind.pigment ? 'تصبغات' : ''} ${ind.acne ? '| حبوب' : ''} ${ind.dark_circles ? '| هالات' : ''}</p>
        </div>
        <div class="q-block">`;
    
    if (ind.pigment) {
        html += `<h3>أسئلة التصبغات:</h3><p>هل البقع الداكنة قديمة وموجودة منذ سنوات؟</p>
                 <button onclick="saveStep('depth', 'deep')">نعم (عميقة)</button>
                 <button onclick="saveStep('depth', 'surface')">لا (سطحية)</button>`;
    } else if (ind.dark_circles) {
        html += `<h3>أسئلة الهالات:</h3><p>ما هو لون منطقة تحت العين الغالب؟</p>
                 <button onclick="saveStep('eye', 'brown')">بني</button>
                 <button onclick="saveStep('eye', 'blue')">أزرق/إرهاق</button>`;
    } else {
        html += `<p>بشرتك تبدو رائعة! هل ننتقل لعرض التقرير؟</p>
                 <button onclick="renderFinal()">عرض التحليل النهائي</button>`;
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
            <h2 class="report-title">VERONA ADVANCED ANALYSIS</h2>
            <div class="analysis-grid">
                <div class="grid-item"><strong>👤 نوع البشرة:</strong> <span>${skinTypeLogic[ind.type].name}</span></div>
                <div class="grid-item"><strong>⏳ عمر البشرة:</strong> <span>${ind.skinAge} سنة</span></div>
                <div class="grid-item"><strong>💧 الترطيب:</strong> <span>${Math.round(ind.hydration)}%</span></div>
                <div class="grid-item"><strong>🌟 النضارة:</strong> <span>${Math.round(ind.glow)}%</span></div>
                <div class="grid-item"><strong>🚫 الحبوب:</strong> <span>${ind.acne ? 'مكتشفة' : 'لا يوجد'}</span></div>
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
    document.querySelectorAll('.level-tabs button').forEach(b => b.classList.remove('active'));
    document.getElementById('l-' + lvl).classList.add('active');
    
    const ind = sessionData.ai.indicators;
    let key = ind.acne ? 'acne' : (ind.pigment ? (sessionData.answers.depth === 'deep' ? 'pigmentation_deep' : 'pigmentation_surface') : 'dark_circles');
    if (!expertLogic[key]) key = 'dark_circles'; // fallback

    const data = expertLogic[key];
    const p = data.levels[lvl];

    let html = `<div class="treatment-box">
        <h4>🛡️ خطة العلاج (بشرة ${skinTypeLogic[ind.type].name}):</h4>
        <p><strong>الهدف:</strong> ${data.title}</p>
        <p><strong>المادة الفعالة:</strong> ${data.active}</p>
    </div>`;

    [1, 2, 3].forEach(n => {
        let title = n===1 ? "التهيئة" : (n===2 ? "العلاج" : "الحماية");
        let desc = n===1 ? `غسول ${skinTypeLogic[ind.type].name}` : (n===2 ? `<b>${p.name}</b><br><small>${p.why}</small>` : "Sunblock SPF50+");
        html += `<div class="phase-card"><h4>مرحلة ${n}: ${title}</h4><div class="p-item">${desc}</div></div>`;
    });

    document.getElementById('report-content').innerHTML = html + `
        <button class="wa-btn" onclick="sendWA()">إرسال واتساب ✅</button>
        <button class="primary-btn" style="width:100%; margin-top:10px; background:#333;" onclick="downloadPDF()">تحميل التقرير PDF 📄</button>`;
}

function downloadPDF() {
    const element = document.getElementById("report-to-print");
    const opt = { margin: 0.5, filename: 'Verona_Analysis.pdf', image: { type: 'jpeg', quality: 0.98 },
                  html2canvas: { scale: 2 }, jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' } };
    html2pdf().set(opt).from(element).save();
}
