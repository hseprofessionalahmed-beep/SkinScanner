function buildRoutine(level) {
    document.querySelectorAll('.lvl-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');

    let p = {
        eco: { wash: "غسول ستارفيل", treat: "أدابلين جل", moist: "بانثينول" },
        super: { wash: "لاروش بوزيه", treat: "إيفاكلار سيروم", moist: "سيكابلاست" },
        ultra: { wash: "فيشي نورماديرم", treat: "سي سي سيروم", moist: "مينرال 89" }
    }[level];

    document.getElementById("routine-output").classList.remove("hidden");
    document.getElementById("finalRoutine").innerHTML = `
        <h3 style="color:#d4af37">روتين المستوى ${level}</h3>
        <div class="phase-box">
            <h4>🟢 المرحلة 1: التهيئة</h4>
            <p>استخدم <b>${p.wash}</b> مرتين يومياً.</p>
        </div>
        <div class="phase-box">
            <h4>🟡 المرحلة 2: العلاج</h4>
            <p>تطبيق <b>${p.treat}</b> مساءً لعلاج ${scanData.acne?'الحبوب':'النضارة'}.</p>
        </div>
        <div class="phase-box">
            <h4>🔵 المرحلة 3: الحماية</h4>
            <p>الترطيب بـ <b>${p.moist}</b> + واقي شمس.</p>
        </div>
    `;
}

function sendWhatsApp() {
    let msg = `*تقرير فيرونا AI*%0Aدرجة الصحة: ${scanData.score}/100%0Aالتشخيص: ${scanData.pigment?'تصبغات':'بشرة سليمة'}%0Aالروتين: ${document.querySelector('.lvl-btn.active').innerText}`;
    window.open(`https://wa.me/201063994139?text=${msg}`);
}

function savePDF() {
    html2pdf().from(document.getElementById('finalRoutine')).save('Verona-Routine.pdf');
}
