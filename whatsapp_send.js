function sendWA() {
    const level = sessionData.level.toUpperCase();
    const ind = sessionData.ai.indicators;
    const msg = `
*تقرير مختبر فيرونا (VERONA)* ✨
--------------------------
📊 *تحليل الرؤية الذكي:*
- تصبغات: [${ind.pigment ? 'رصد مؤشرات' : 'لا يوجد'}]
- حبوب: [${ind.acne ? 'رصد مؤشرات' : 'لا يوجد'}]
💎 *المستوى المختار:* ${level}

📅 *خطة النضارة المقترحة:*
1. التهيئة: Hyaluronic Acid.
2. العلاج: ${sessionData.level} Professional.
3. الوقاية: Sunblock SPF50+.

*VERONA - حيث يلتقي العلم بالجمال*
    `;
    window.open(`https://wa.me/201063994139?text=${encodeURIComponent(msg)}`);
}
