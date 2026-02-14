const video = document.getElementById('video');
const loading = document.getElementById('loading-overlay');
let sessionData = { ai: null, isSensitive: false, level: 'super' };

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        video.srcObject = stream;
    } catch (err) { alert("يرجى تفعيل الكاميرا"); }
}
startCamera();

document.getElementById('scanBtn').addEventListener('click', async () => {
    loading.style.display = 'flex';
    loading.innerText = "جاري تحليل فيرونا الذكي...";
    sessionData.ai = await analyzeSkin(video);
    loading.style.display = 'none';
    if (sessionData.ai) showQuestions();
});

function showQuestions() {
    const results = document.getElementById("results");
    results.style.display = "block";
    results.innerHTML = `
        <div class="question-card professional-report">
            <h3>🛡️ سؤال الأمان من فيرونا:</h3>
            <p>هل بشرتك تتحسس من العطور أو الكريمات القوية؟</p>
            <button onclick="setStep(true)">نعم (حساسة)</button>
            <button onclick="setStep(false)">لا (عادية)</button>
        </div>`;
    results.scrollIntoView({ behavior: 'smooth' });
}

function setStep(ans) {
    sessionData.isSensitive = ans;
    renderReport();
}

function renderReport() {
    const results = document.getElementById("results");
    results.innerHTML = `
        <div class="professional-report">
            <div class="report-header">
                <h2 style="letter-spacing:2px;">VERONA REPORT</h2>
                <div class="evidence-panel">نمط الجلد: ${sessionData.isSensitive ? 'حساسة 🌿' : 'تتحمل 🔥'}</div>
            </div>
            <div class="level-tabs">
                <button id="b-budget" onclick="updateLvl('budget')">اقتصادي 💰</button>
                <button id="b-super" class="active" onclick="updateLvl('super')">سوبر ⭐</button>
                <button id="b-premium" onclick="updateLvl('premium')">بريميوم 👑</button>
            </div>
            <div id="report-content"></div>
        </div>`;
    updateLvl('super');
}

function updateLvl(lvl) {
    sessionData.level = lvl;
    document.querySelectorAll('.level-tabs button').forEach(b => b.classList.remove('active'));
    document.getElementById('b-' + lvl).classList.add('active');
    
    const content = document.getElementById('report-content');
    const target = sessionData.ai.indicators.pigment === 'High' ? 'pigmentation' : 'acne';
    const data = expertLogic[target];
    const product = data.levels[lvl];

    let html = "";
    [1, 2, 3].forEach(n => {
        const p = phasesInfo[n];
        let item = (n===1) ? "Hyaluronic + Panthenol" : (n===2) ? `<b>${product.name}</b><br><small>${product.why}</small>` : "Sunblock SPF50+";
        html += `<div class="phase-card"><h4>المرحلة ${n}: ${p.name}</h4><div class="p-item">${item}</div></div>`;
    });

    content.innerHTML = html + `<button class="wa-btn" onclick="sendWA()">إرسال التقرير عبر واتساب ✅</button>`;
}
