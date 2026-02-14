const expertLogic = {
    pigmentation: {
        title: "تصبغات الجلد وفرط الميلانين",
        reason: "زيادة إنتاج صبغة الميلانين نتيجة التعرض للشمس أو التغيرات الهرمونية.",
        active: "Alpha Arbutin + Vitamin C",
        levels: {
            budget: { name: "Garnier Fast Bright", why: "خيار اقتصادي غني بالليمون وفيتامين سي." },
            super: { name: "Natavis Arbutin Serum", why: "تركيبة متوازنة لتوحيد اللون بفاعلية عالية." },
            premium: { name: "Derwois Whitening Pro", why: "تقنية فرنسية لاستهداف البقع العميقة ومنع ظهورها." }
        }
    },
    acne: {
        title: "حبوب البشرة والمسام المسدودة",
        reason: "تراكم الدهون والنشاط البكتيري داخل المسام.",
        active: "Salicylic Acid (BHA)",
        levels: {
            budget: { name: "Garnier Fast Clear", why: "مقشر يومي لطيف لمحاربة الحبوب." },
            super: { name: "Starville Acne Serum", why: "يعالج الالتهاب ويقلل من ظهور الحبوب الجديدة." },
            premium: { name: "Nano Treat Acne Care", why: "علاج بتقنية النانو لضمان تغلغل المواد الفعالة." }
        }
    }
};

const phasesInfo = {
    1: { name: "مرحلة التهيئة", goal: "تقوية حاجز الجلد وترطيبه" },
    2: { name: "مرحلة العلاج", goal: "استهداف المشكلة بالمواد المركزة" },
    3: { name: "مرحلة الحماية", goal: "الحفاظ على النتائج SPF50" }
};
