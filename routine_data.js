const expertLogic = {
    pigmentation: {
        title: "تحليل التصبغات والبقع",
        reason: "فرط نشاط الميلانين نتيجة التعرض للشمس أو الالتهاب.",
        active: "Alpha Arbutin + Vitamin C",
        levels: {
            budget: { name: "Garnier Fast Bright", why: "خيار اقتصادي فعال للتفتيح اليومي." },
            super: { name: "Natavis Arbutin Serum", why: "تركيبة متوازنة لتوحيد لون البشرة." },
            premium: { name: "Derwois Whitening Pro", why: "تقنية متقدمة لاستهداف أعمق طبقات التصبغ." }
        }
    },
    acne: {
        title: "تحليل الحبوب والدهون",
        reason: "انسداد المسام ونشاط بكتيري ناتج عن زيادة الإفرازات.",
        active: "Salicylic Acid (BHA)",
        levels: {
            budget: { name: "Garnier Fast Clear", why: "تنظيف عميق وسريع للمسام." },
            super: { name: "Starville Acne Serum", why: "يعالج الحبوب ويقلل من آثارها." },
            premium: { name: "Nano Treat Acne Care", why: "جزيئات نانوية لعلاج الالتهاب من الجذور." }
        }
    }
};

const phasesInfo = {
    1: { name: "التهيئة", goal: "إصلاح حاجز البشرة" },
    2: { name: "العلاج", goal: "استهداف المشكلة الرئيسية" },
    3: { name: "الحماية", goal: "الوقاية من الشمس SPF50" }
};
