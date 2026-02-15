const expertLogic = {
    pigmentation_surface: {
        title: "تصبغات سطحية (حديثة)",
        reason: "تراكم الميلانين في الطبقة العليا نتيجة الشمس أو آثار حبوب جديدة.",
        active: "Alpha Arbutin + Vitamin C",
        levels: {
            budget: { name: "Garnier Fast Bright", why: "تفتيح سريع للآثار السطحية." },
            super: { name: "Natavis Whitening Serum", why: "تركيبة مركزة لتوحيد اللون." },
            premium: { name: "La Roche-Posay Pure Vit C10", why: "نضارة فائقة وعلاج فوري للبهتان." }
        }
    },
    pigmentation_deep: {
        title: "تصبغات عميقة (كلف/قديمة)",
        reason: "تصبغات متجذرة في طبقة الأدمة تحتاج مواد قوية للاختراق.",
        active: "Tranexamic Acid + Retinoids",
        levels: {
            budget: { name: "Skin Active Depigment", why: "مقشر لطيف يساعد على التجديد." },
            super: { name: "Starville Whitening Night", why: "يستهدف البقع الداكنة بعمق." },
            premium: { name: "Derwois Intense Depigment", why: "علاج مكثف للحالات المستعصية والعميقة." }
        }
    },
    dark_circles: {
        title: "هالات منطقة العين",
        reason: "احتقان في الأوعية الدموية أو تصبغ رقيق تحت الجلد.",
        active: "Caffeine + K-Vitamin",
        levels: {
            budget: { name: "Garnier Eye Roll-on", why: "انتعاش وتفتيح سريع." },
            super: { name: "Starville Eye Contour", why: "يعالج الانتفاخ والهالات معاً." },
            premium: { name: "Derwois Eye Repair Pro", why: "إصلاح شامل لمنطقة العين." }
        }
    },
    dryness: {
        title: "جفاف البشرة وفقدان النضارة",
        reason: "ضعف الحاجز الدهني ونقص عوامل الترطيب الطبيعية.",
        active: "Hyaluronic Acid + Ceramides",
        levels: {
            budget: { name: "Eva Skin Clinic Hyaluron", why: "ترطيب اقتصادي جيد." },
            super: { name: "Natavis Hyaluronic Acid", why: "ترطيب عميق لطبقات الجلد." },
            premium: { name: "Vichy Minéral 89", why: "يقوي الحاجز الجلدي ويعيد النضارة." }
        }
    }
};

const phasesInfo = {
    1: { name: "التهيئة", goal: "إصلاح الحاجز الواقي" },
    2: { name: "العلاج", goal: "استهداف المشكلة بعمق" },
    3: { name: "الحماية", goal: "الوقاية الدائمة SPF50" }
};
