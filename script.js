const video = document.getElementById('video');
const loading = document.getElementById('loading-overlay');
let skinData = null;

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        video.srcObject = stream;
    } catch (err) { console.log("Camera access error"); }
}
startCamera();

document.getElementById('scanBtn').addEventListener('click', async () => {
    loading.style.display = 'flex';
    loading.innerText = "جاري مسح طبقات الجلد...";
    skinData = await analyzeSkin(video);
    loading.style.display = 'none';
    
    if (skinData) {
        askSmartQuestions();
    } else {
        alert("يرجى توجيه الوجه جيداً للكاميرا");
    }
});

function askSmartQuestions() {
    const resultsDiv = document.getElementById("results");
    resultsDiv.style.display = "block";
    resultsDiv.innerHTML = `
        <div class="card question-card">
            <h3>🛡️ سؤال الأمان:</h3>
            <p>هل تلاحظين تحسس بشرتك من العطور أو منتجات التفتيح القوية؟</p>
            <div style="display:flex; gap:10px; justify-content:center;">
                <button onclick="finalDecision(true)" style="background:#e53e3e; color:white;">نعم (حساسة)</button>
                <button onclick="finalDecision(false)" style="background:#3182ce; color:white;">لا (عادية)</button>
            </div>
        </div>`;
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

function finalDecision(isSensitive) {
    const finalSensitivity = isSensitive ? "حساسة" : skinData.sensitivity;
    renderRoutine(skinData.problems, finalSensitivity);
}

function renderRoutine(problems, sensitivity) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = `
        <div class="status-bar ${sensitivity === 'حساسة' ? 'warn' : 'safe'}">
            نمط الجلد: <strong>${sensitivity}</strong> | النتائج: ${problems.join(" - ")}
        </div>
        <div class="tabs-container">
            <button id="btn-budget" onclick="showLevel('budget')">اقتصادي 💰</button>
            <button id="btn-super" onclick="showLevel('super')">سوبر ⭐</button>
            <button id="btn-premium" onclick="showLevel('premium')">بريميوم 👑</button>
        </div>
        <div id="routine-body"></div>
    `;
    showLevel('super');
}

function showLevel(level) {
    document.querySelectorAll('.tabs-container button').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-' + level).classList.add('active');
    
    const body = document.getElementById("routine-body");
    const data = productsDb.levels[level];
    let html = "";

    [1, 2, 3].forEach(num => {
        const phase = productsDb.phases[num];
        let items = "";
        if(num === 1) items = `<div class="p-item">Hyaluronic Acid + Panthenol (صباحاً ومساءً)</div>`;
        if(num === 2) items = `
            <div class="p-item">${data.vitC.name} <small>(صباحاً)</small></div>
            <div class="p-item">${data.arbutin.name} <small>(مساءً)</small></div>
            <div class="p-item">${data.correction.name} <small>(علاج مكثف)</small></div>`;
        if(num === 3) items = `<div class="p-item">${data.sunblock.name} <small>(واقي شمس يومي)</small></div>`;

        html += `
            <div class="phase-box">
                <h4>${phase.name}</h4>
                <small>${phase.goal}</small>
                ${items}
            </div>`;
    });

    body.innerHTML = html + `
        <div class="final-warning">
            ⚠️ <strong>تنبيه الخبير:</strong> ${level === 'premium' ? 'التركيبة قوية جداً، يرجى الالتزام بالكميات المحددة.' : 'واقي الشمس هو سر نجاح هذه الخطة.'}
        </div>
        <button class="wa-btn" onclick="sendToWhatsApp('${level}')">إرسال الخطة كاملة لواتساب ✅</button>`;
}
