function sendWA() {
    const level = sessionData.level.toUpperCase();
    const ind = sessionData.ai.indicators;
    const msg = `
*تقرير مختبر فيرونا (VERONA)* ✨
--------------------------
📊 *تحليل الرؤية:* تصبغات [${ind.pigment ? 'نعم' : 'لا'}] | حبوب [${ind.acne ? 'نعم' : 'لا'}]
💎 *المستوى المختار:* ${level}

📅 *خطة النضارة المقترحة:*
1. التهيئة: إصلاح حاجز الجلد.
2. العلاج: ${sessionData.level} Professional Product.
3. الوقاية: حماية SPF50 يومية.

💡 *نصيحة فيرونا:* الالتزام بواقي الشمس هو سر نجاح الخطة.
--------------------------
*فيرونا - حيث يلتقي العلم بالجمال*
    `;
    window.open(`https://wa.me/201063994139?text=${encodeURIComponent(msg)}`);
}
