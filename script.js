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
    loading.innerText = "جاري تحليل فيرونا الذكي...";
    sessionData.ai = await analyzeSkin(source);
    loading.style.display = 'none';
    if (sessionData.ai) showDecisionTree();
    else alert("يرجى توجيه الوجه جيداً أو رفع صورة واضحة.");
}

function showDecisionTree() {
    const results = document.getElementById("results");
    results.style.display = "block";
    const ind = sessionData.ai.indicators;
    
    let html = `<div class="professional-report">
                    <div class="confirmed-issues-panel" style="background:#f0f7ff; border-color:#bee3f8;">
                        <h4>🔍 نتائج الفحص البصري الأولي:</h4>
                        <p>رصد الـ AI مؤشرات: ${ind.acne ? 'تهيج/حبوب' : ''} ${ind.pigment ? 'بقع/تصبغات' : ''} ${!ind.acne && !ind.pigment ? 'بشرة مستقرة' : ''}</p>
                    </div>
                    <div class="q-block">
                        <h3>تحقق فيرونا الذكي:</h3>`;
    
    if (ind.acne) {
        html += `<p>هل الحبوب المكتشفة ملتهبة أو مؤلمة؟</p>
                 <button onclick="saveStep('inflamed', true)">نعم</button>
                 <button onclick="saveStep('inflamed', false)">لا</button>`;
    } else if (ind.pigment) {
        html += `<p>هل تلاحظين زيادة البقع عند التعرض للشمس؟</p>
                 <button onclick="saveStep('sun', true)">نعم</button>
                 <button onclick="saveStep('sun', false)">لا</button>`;
    } else {
        html += `<p>بشرتك تبدو رائعة، هل ترغبين في خطة وقائية للنضارة؟</p>
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

    let confirmedIssues = [];
    if (ind.acne) confirmedIssues.push(ans.inflamed ? "حبوب نشطة وملتهبة" : "آثار حبوب وتهيّج سطحي");
    if (ind.pigment) confirmedIssues.push(ans.sun ? "تصبغات ناتجة عن الشمس" : "بقع داكنة ناتجة عن عوامل داخلية");
    if (!ind.acne && !ind.pigment) confirmedIssues.push("بشرة مستقرة (تحتاج عناية وقائية)");

    results.innerHTML = `
        <div class="professional-report">
            <header class="report-header"><h2>VERONA REPORT</h2></header>
            <div class="confirmed-issues-panel">
                <h4>✅ مشاكل البشرة المؤكدة:</h4>
                <ul>${confirmedIssues.map(i => `<li>${i}</li>`).join('')}</ul>
                <p class="trust-note">ℹ️ تم الدمج بين رؤية الـ AI وإجاباتك.</p>
            </div>
            <div class="level-tabs">
                <button id="l-budget" onclick="updateLvl('budget')">اقتصادي 💰</button>
                <button id="l-super" class="active" onclick="updateLvl('super')">سوبر ⭐</button>
                <button id="l-premium" onclick="updateLvl('premium')">بريميوم 👑</button>
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
    const target = ind.acne ? 'acne' : 'pigmentation';
    const data = expertLogic[target];
    const product = data.levels[lvl];

    let html = `<div class="mapping-logic">
                    <p><strong>المادة الفعالة:</strong> ${data.active}</p>
                    <p>💡 <strong>لماذا؟</strong> ${data.reason}</p>
                </div>`;

    [1, 2, 3].forEach(n => {
        let item = (n===1) ? "Hyaluronic Acid + Panthenol" : (n===2) ? `<b>${product.name}</b><br><small>${product.why}</small>` : "Sunblock SPF50+ (Verona Edition)";
        html += `<div class="phase-card"><h4>المرحلة ${n}: ${phasesInfo[n].name}</h4><div class="p-item">${item}</div></div>`;
    });

    document.getElementById('report-content').innerHTML = html + `<button class="wa-btn" onclick="sendWA()">إرسال التقرير للواتساب ✅</button>`;
}
