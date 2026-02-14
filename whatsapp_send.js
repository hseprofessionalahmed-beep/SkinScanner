function sendToWhatsApp(level) {
    const status = document.querySelector('.status-bar').innerText;
    const products = Array.from(document.querySelectorAll('.p-item'))
        .map(item => "• " + item.innerText)
        .join('\n');

    const levelName = level === 'budget' ? 'الاقتصادي' : level === 'super' ? 'السوبر' : 'البريميوم';

    const message = `
*تقرير تحليل البشرة الذكي* ✨
--------------------------
📊 *تحليل الحالة:* ${status}
🧪 *المستوى المختار:* ${levelName}

📅 *خطة الروتين (3 مراحل):*
${products}

⚠️ *تعليمات:*
- الالتزام بمرحلة التهيئة أول أسبوع.
- واقي الشمس يجدد كل ساعتين.
- توقفي عن المنتجات في حالة التهيج الشديد.
    `;

    window.open(`https://wa.me/201063994139?text=${encodeURIComponent(message)}`, '_blank');
}
