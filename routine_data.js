function buildRoutine(type) {
    const routines = {
        "عام": `
🧴 المرحلة الأولى - الترطيب:
- Vitamin C (Garnier Fast Bright) يوميًا صباحًا
- Hyaluronic Acid سيروم يومي
🌟 المرحلة الثانية - تفتيح:
- Alpha Arbutin + Niacinamide سيروم يوميًا
☀️ المرحلة الثالثة - حماية:
- Sunscreen SPF50 صباحًا

روتين اقتصادي: منتجات متوفرة بسعر مناسب، فعالية جيدة.
روتين الترا: منتجات غالية الفعالية أعلى، إشراقة ومرونة أفضل.
روتين السوبر: أعلى فئة، يشمل الذهب والكافيار، ترطيب + تفتيح + مضادات شيخوخة.
        `,
        "الهالات": `
🧴 الترطيب: سيروم بالكافيين للهالات
🌟 تفتيح: Alpha Arbutin + Niacinamide
☀️ حماية: Sunscreen SPF50
        `,
        "تصبغات": `
🧴 الترطيب: Vitamin C + Hyaluronic Acid
🌟 تفتيح: Alpha Arbutin + Tranexamic Acid
☀️ حماية: Sunscreen SPF50
        `
    };

    return routines[type] || routines["عام"];
}
