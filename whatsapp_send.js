function sendWA() {
    const ind = sessionData.ai.indicators;
    const msg = `
*VERONA | Glow Smarter* ✨
--------------------------
📊 *تقرير فيرونا لتحليل البشرة*
--------------------------
🛡️ نوع الجلد: ${sessionData.isSensitive ? 'حساسة' : 'عادية'}
💎 المستوى المختار: ${sessionData.level.toUpperCase()}

📅 *الخطة المقترحة:*
1. التهيئة: مرطبات حاجز الجلد
2. العلاج: ${sessionData.level} Professional Choice
3. الحماية: واقي شمس يومي

⚠️ يرجى الالتزام بالترتيب لضمان أفضل نضارة.
--------------------------
*VERONA - حيث يلتقي العلم بالجمال*
    `;
    window.open(`https://wa.me/201063994139?text=${encodeURIComponent(msg)}`);
}
