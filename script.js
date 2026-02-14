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
    loading.innerText = "جاري تحليل المؤشرات البصرية...";
    sessionData.ai = await analyzeSkin(source);
    loading.style.display = 'none';
    if (sessionData.ai) showDecisionTree();
    else alert("يرجى توجيه الوجه جيداً للكاميرا أو رفع صورة واضحة.");
}

function showDecisionTree() {
    const results = document.getElementById("results");
    results.style.display = "block";
    const ind = sessionData.ai.indicators;
    
    let html = `
        <div class="professional-report">
            <div class="evidence-panel">
                <h4>📊 المؤشرات المكتشفة بصرياً:</h4>
                <p>• الحبوب/التهيج: ${ind.acne ? '✅ رصد مؤشرات' : '❌ لا يوجد'}</p>
                <p>• التصبغات: ${ind.pigment ? '✅ رصد مؤشرات' : '❌ لا يوجد'}</p>
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
        html += `<p>بشرتك تبدو صافية، هل ترغبين في خطة وقائية للنضارة؟</p>
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
    results.innerHTML = `
        <div class="professional-report">
            <h2 style="text-align:center; color:var(--black); letter-spacing:2px;">VERONA REPORT</h2>
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

    let html = "";
    [1, 2, 3].forEach(n => {
        let item = (n===1) ? "Hyaluronic Acid + Panthenol" : (n===2) ? `<b>${product.name}</b><br><small>${product.why}</small>` : "Sunblock SPF50+";
        html += `<div class="phase-card"><h4>المرحلة ${n}: ${phasesInfo[n].name}</h4><div class="p-item">${item}</div></div>`;
    });

    document.getElementById('report-content').innerHTML = html + 
        `<button class="wa-btn" onclick="sendWA()">إرسال تقرير فيرونا للواتساب ✅</button>`;
}

