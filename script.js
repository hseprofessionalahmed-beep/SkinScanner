const video = document.getElementById('video');
const loading = document.getElementById('loading-overlay');
const imgUpload = document.getElementById('imageUpload');
let sessionData = { ai: null, answers: {}, level: 'super' };

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        video.srcObject = stream;
    } catch (err) { console.log("Camera access blocked"); }
}
startCamera();

document.getElementById('scanBtn').addEventListener('click', () => processSource(video));
imgUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        const img = await faceapi.bufferToImage(file);
        processSource(img);
    }
});

async function processSource(source) {
    loading.style.display = 'flex';
    loading.innerText = "جاري الفحص المجهري الرقمي...";
    sessionData.ai = await analyzeSkin(source);
    loading.style.display = 'none';
    if (sessionData.ai) showDecisionTree();
}

function showDecisionTree() {
    const results = document.getElementById("results");
    results.style.display = "block";
    const ind = sessionData.ai.indicators;
    
    let html = `<div class="professional-report">
                    <div class="confirmed-issues-panel" style="background:#f0f7ff;">
                        <h4>🔍 تقرير رؤية VERONA:</h4>
                        <p>تم رصد: ${ind.pigment ? 'تصبغات ' : ''} ${ind.dark_circles ? '| هالات ' : ''} ${ind.dryness ? '| جفاف' : ''}</p>
                    </div>
                    <div class="q-block"><h3>أسئلة التحقق:</h3>`;
    
    if (ind.pigment) {
        html += `<p>البقع المكتشفة؛ هل هي قديمة وموجودة منذ سنوات؟</p>
                 <button onclick="saveStep('depth', 'deep')">نعم (تصبغ عميق)</button>
                 <button onclick="saveStep('depth', 'surface')">لا (تصبغ سطحي)</button>`;
    } else if (ind.dark_circles) {
        html += `<p>ما هو لون الهالات تحت العين؟</p>
                 <button onclick="saveStep('eye', 'brown')">بنية</button>
                 <button onclick="saveStep('eye', 'blue')">زرقاء/بنفسجية</button>`;
    } else if (ind.dryness) {
        html += `<p>هل تشعرين بخشونة أو قشور في الجلد؟</p>
                 <button onclick="saveStep('dry', 'high')">نعم</button>
                 <button onclick="saveStep('dry', 'low')">لا، بهتان فقط</button>`;
    } else {
        html += `<p>بشرتك تبدو رائعة! هل تريدين روتين حماية ونضارة؟</p>
                 <button onclick="renderFinal()">ابدأ الخطة</button>`;
    }
    results.innerHTML = html + `</div></div>`;
    results.scrollIntoView({ behavior: 'smooth' });
}

function saveStep(key, val) {
    sessionData.answers[key] = val;
    renderFinal();
}

function renderFinal() {
    const results = document.getElementById("results");
    const ind = sessionData.ai.indicators;
    const ans = sessionData.answers;

    let issues = [];
    if (ind.pigment) issues.push(ans.depth === 'deep' ? "تصبغات عميقة" : "تصبغات سطحية");
    if (ind.dark_circles) issues.push("هالات تحت العين");
    if (ind.dryness) issues.push(ans.dry === 'high' ? "جفاف حاد" : "بشرة باهتة (Dull Skin)");

    results.innerHTML = `
        <div class="professional-report" id="report-to-print">
            <header class="report-header"><h2>VERONA SKIN REPORT</h2></header>
            <div class="confirmed-issues-panel">
                <h4>✅ تشخيص الحالة:</h4>
                <ul>${issues.map(i => `<li>${i}</li>`).join('')}</ul>
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
    let key = 'dryness';
    if (ind.pigment) key = sessionData.answers.depth === 'deep' ? 'pigmentation_deep' : 'pigmentation_surface';
    else if (ind.dark_circles) key = 'dark_circles';

    const data = expertLogic[key];
    const p = data.levels[lvl];

    let html = `<div class="mapping-logic">
                    <p><strong>العلاج:</strong> ${data.active}</p>
                    <p>💡 <strong>السبب:</strong> ${data.reason}</p>
                </div>`;

    [1, 2, 3].forEach(n => {
        let item = (n===1) ? "Hyaluronic Acid Wash" : (n===2) ? `<b>${p.name}</b><br><small>${p.why}</small>` : "Sunblock SPF50+ (Verona)";
        html += `<div class="phase-card"><h4>المرحلة ${n}: ${phasesInfo[n].name}</h4><div class="p-item">${item}</div></div>`;
    });

    document.getElementById('report-content').innerHTML = html + `
        <button class="wa-btn" onclick="sendWA()">إرسال واتساب ✅</button>
        <button class="primary-btn" style="width:100%; margin-top:10px; background:#444;" onclick="downloadPDF()">تحميل التقرير PDF 📄</button>
    `;
}

function downloadPDF() {
    const element = document.getElementById("report-to-print");
    const opt = { margin: 0.5, filename: 'Verona_Skin_Report.pdf', image: { type: 'jpeg', quality: 0.98 },
                  html2canvas: { scale: 2 }, jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' } };
    html2pdf().set(opt).from(element).save();
}
