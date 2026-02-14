const skinTypeLogic = {
    oily: { name: "دهنية", traits: "نشاط زائد للمسام ودموع دهنية" },
    dry: { name: "جافة", traits: "نقص في الزيوت الطبيعية وتقشر" },
    combined: { name: "مختلطة", traits: "دهنية في T-Zone وجافة في الخدين" },
    normal: { name: "عادية", traits: "توازن مثالي للترطيب والدهون" }
};

const expertLogic = {
    pigmentation_surface: {
        title: "تصبغات سطحية",
        active: "Alpha Arbutin + Vitamin C",
        levels: {
            budget: { name: "Garnier Fast Bright", why: "تفتيح اقتصادي سريع." },
            super: { name: "Natavis Whitening Serum", why: "علاج احترافي لتوحيد اللون." },
            premium: { name: "La Roche-Posay Pure Vit C10", why: "نضارة طبية فورية." }
        }
    },
    pigmentation_deep: {
        title: "تصبغات عميقة / كلف",
        active: "Tranexamic Acid + Retinoids",
        levels: {
            budget: { name: "Skin Active Depigment", why: "تجديد سطحي للبقع القديمة." },
            super: { name: "Starville Night Whitening", why: "اختراق عميق لمناطق التصبغ." },
            premium: { name: "Derwois Intense Depigment", why: "أقوى تركيبة علاجية للكلف." }
        }
    },
    acne: {
        title: "بشرة معرضة للحبوب",
        active: "Salicylic Acid (BHA)",
        levels: {
            budget: { name: "Garnier Fast Clear", why: "تنظيف عميق للمسام." },
            super: { name: "Starville Acne Serum", why: "علاج الحبوب وتهدئة البشرة." },
            premium: { name: "Effaclar Duo(+)", why: "علاج متكامل للحبوب والآثار." }
        }
    },
    dark_circles: {
        title: "هالات منطقة العين",
        active: "Caffeine + Retinol Eye",
        levels: {
            budget: { name: "Garnier Eye Roll-on", why: "تفتيح وترطيب يومي." },
            super: { name: "Starville Eye Contour", why: "علاج الهالات والانتفاخ." },
            premium: { name: "Derwois Eye Repair Pro", why: "تقنية فرنسية لإصلاح محيط العين." }
        }
    }
};
