function showDecisionTree() {
    const results = document.getElementById("results");
    results.style.display = "block";
    const ind = sessionData.ai.indicators;
    
    let html = `<div class="professional-report"><div class="q-block">`;

    // الأولوية القصوى للتصبغات (النمش) لمنع خطأ الصورة الثالثة
    if (ind.pigment) {
        html += `<h3>⚠️ رصد تصبغات نشطة:</h3>
                 <p>لقد اكتشف النظام نقاطاً ملونة (نمش/بقع). هل هذه النقاط موجودة منذ الطفولة؟</p>
                 <button onclick="saveStep('pig_type', 'freckles')">نعم (نمش وراثي)</button>
                 <button onclick="saveStep('pig_type', 'sun_spots')">لا (آثار شمس)</button>`;
    } else if (ind.acne) {
        html += `<h3>⚠️ رصد تهيج/حبوب:</h3>
                 <p>هل تظهر هذه الحبوب بشكل دوري أم مفاجئ؟</p>
                 <button onclick="saveStep('acne_type', 'chronic')">دوري</button>
                 <button onclick="saveStep('acne_type', 'new')">مفاجئ</button>`;
    } else {
        // حالة البشرة الصافية (مثل الطفل السليم)
        renderFinal();
        return;
    }
    results.innerHTML = html + `</div></div>`;
}

function updateLvl(lvl) {
    sessionData.level = lvl;
    const ind = sessionData.ai.indicators;
    
    // منع رسالة البشرة المثالية إذا وجد نمش (الصورة 3)
    if (!ind.pigment && !ind.acne && ind.glow > 90) {
        document.getElementById('report-content').innerHTML = `
            <div class="treatment-box" style="background:#28a745;">
                <h4>✅ بشرة مثالية ومستقرة</h4>
                <p>لم يتم رصد نمش أو حبوب. استمري على الوقاية فقط.</p>
            </div>`;
        return;
    }

    // تحديد المفتاح بناءً على الاكتشاف
    let key = ind.pigment ? 'pigmentation_surface' : (ind.acne ? 'acne' : 'dark_circles');
    const data = expertLogic[key] || expertLogic['pigmentation_surface'];
    const p = data.levels[lvl];

    let html = `<div class="treatment-box"><h4>🛡️ روتين فيرونا:</h4><p>المادة الفعالة: ${data.active}</p></div>`;
    [1, 2, 3].forEach(n => {
        let item = n===1 ? `غسول ${skinTypeLogic[ind.type].name}` : (n===2 ? `<b>${p.name}</b>` : "Sunblock SPF50+");
        html += `<div class="phase-card"><h4>مرحلة ${n}</h4><div class="p-item">${item}</div></div>`;
    });
    document.getElementById('report-content').innerHTML = html + `
        <button class="wa-btn" onclick="sendWA()">إرسال واتساب ✅</button>
        <button class="primary-btn" style="width:100%; margin-top:10px; background:#444;" onclick="downloadPDF()">تحميل PDF 📄</button>`;
}
