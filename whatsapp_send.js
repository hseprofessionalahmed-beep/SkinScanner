function sendWA() {
    const ind = sessionData.ai.indicators;
    const msg = `
*VERONA SKIN ANALYSIS* ✨
--------------------------
👤 نوع البشرة: ${skinTypeLogic[ind.type].name}
⏳ العمر التقديري: ${ind.skinAge} سنة
💧 الترطيب: ${Math.round(ind.hydration)}%
🌟 النضارة: ${Math.round(ind.glow)}%

📅 تم تحديد الخطة العلاجية بنجاح.
يرجى تحميل تقرير الـ PDF من الموقع للحصول على تفاصيل الروتين.
--------------------------
*فيرونا - حيث يلتقي العلم بالجمال*
    `;
    window.open(`https://wa.me/201063994139?text=${encodeURIComponent(msg)}`);
}
