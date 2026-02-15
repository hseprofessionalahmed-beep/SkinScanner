function sendWA() {
    const msg = `
*VERONA SKIN REPORT* ✨
--------------------------
📊 تم فحص البشرة بنجاح عبر منصة فيرونا.
🛡️ المستوى: ${sessionData.level.toUpperCase()}
📅 الحالة المكتشفة: ${sessionData.answers.depth || 'نضارة عامة'}

💡 التوصية: يرجى تحميل نسخة الـ PDF من الموقع للحصول على تفاصيل المواد الفعالة.
--------------------------
*VERONA - Glow Smarter*
    `;
    window.open(`https://wa.me/201063994139?text=${encodeURIComponent(msg)}`);
}
