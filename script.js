const video = document.getElementById('video');
const loading = document.getElementById('loading-overlay');
const imgUpload = document.getElementById('imageUpload');
let sessionData = { ai: null, answers: {}, level: 'super' };

// ... (دوال الكاميرا والتحميل كما هي) ...

function showDecisionTree() {
    const results = document.getElementById("results");
    results.style.display = "block";
    const ind = sessionData.ai.indicators;
    
    // فحص شامل: إذا كانت البشرة صافية (مثل الطفل) يتم تجاوز الأسئلة فوراً
    if (!ind.acne && !ind.pigment && !ind.dark_circles) {
        renderFinal();
        return;
    }

    let html = `<div class="professional-report"><div class="q-block">`;
    if (ind.pigment) {
        html += `<h3>تحقق فيرونا الذكي:</h3><p>هل تلاحظين التصبغات منذ الطفولة (نمش وراثي) أم ظهرت حديثاً؟</p>
                 <button onclick="saveStep('depth', 'surface')">حديثة</button>
                 <button onclick="saveStep('depth', 'deep')">منذ فترة طويلة</button>`;
    } else {
        html += `<p>تم تحليل البيانات بنجاح. هل نعرض التقرير؟</p><button onclick="renderFinal()">نعم، عرض التقرير</button>`;
    }
    results.innerHTML = html + `</div></div>`;
}

function renderFinal() {
    const results = document.getElementById("results");
    const ind = sessionData.ai.indicators;
    
    results.innerHTML = `
        <div class="professional-report" id="report-to-print">
            <h2 class="report-title">VERONA ADVANCED REPORT</h2>
            <div class="analysis-grid">
                <div class="grid-item"><strong>👤 نوع البشرة:</strong> <span>${skinTypeLogic[ind.type].name}</span></div>
                <div class="grid-item"><strong>⏳ عمر البشرة:</strong> <span>${ind.skinAge} سنة</span></div>
                <div class="grid-item"><strong>💧 الترطيب:</strong> <span>${Math.round(ind.hydration)}%</span></div>
                <div class="grid-item"><strong>🌟 النضارة:</strong> <span>${Math.round(ind.glow)}%</span></div>
                <div class="grid-item"><strong>🚫 الحبوب:</strong> <span>${ind.acne ? 'نشطة' : 'لا يوجد'}</span></div>
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
    
    // منطق البشرة الصافية / المثالية
    if (!ind.acne && !ind.pigment && !ind.dark_circles) {
        document.getElementById('report-content').innerHTML = `
            <div class="treatment-box" style="background:#28a745; border:none;">
                <h4>✅ تقرير البشرة المثالية:</h4>
                <p>بشرتك تبدو صحية جداً ومستقرة. لا توجد بؤر التهاب أو تصبغات مرصودة. استمري على الترطيب اليومي وواقي الشمس لضمان استدامة هذه النتيجة.</p>
            </div>
            <button class="wa-btn" onclick="sendWA()">إرسال التقرير ✅</button>
            <button class="primary-btn" style="width:100%; margin-top:10px; background:#333;" onclick="downloadPDF()">تحميل التقرير PDF 📄</button>`;
        return;
    }

    // (باقي كود استخراج الروتين العلاجي كما هو في النسخ السابقة)
    // ...
}
