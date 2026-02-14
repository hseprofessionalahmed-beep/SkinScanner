const expertLogic = {
    pigmentation: {
        title: "تحليل التصبغات",
        reason: "فرط ميلانين ناتج عن التعرض للشمس.",
        active: "Alpha Arbutin / Vit C",
        levels: {
            budget: { name: "Garnier Fast Bright", why: "فعالية اقتصادية وسرعة امتصاص." },
            super: { name: "Natavis Arbutin Serum", why: "توازن احترافي بين المكونات." },
            premium: { name: "Derwois Premium Cream", why: "تركيبة مركزة لنتائج طويلة الأمد." }
        }
    },
    acne: {
        title: "تحليل الحبوب",
        reason: "نشاط دهني في المسام.",
        active: "Salicylic Acid / BHA",
        levels: {
            budget: { name: "Garnier Fast Clear", why: "تنظيف يومي للمسام." },
            super: { name: "Starville Acne Serum", why: "علاج وتهدئة للبشرة." },
            premium: { name: "Nano Treat Acne Pro", why: "تقنية النانو للتغلغل العميق." }
        }
    }
};

const phasesInfo = {
    1: { name: "مرحلة التهيئة", goal: "تقوية حاجز الجلد" },
    2: { name: "مرحلة العلاج", goal: "استهداف المشكلة" },
    3: { name: "مرحلة الحماية", goal: "وقاية SPF50" }
};
