const productsDb = {
    phases: {
        1: { name: "التهيئة والترطيب (7 أيام)", goal: "إصلاح الحاجز الجلدي وتجهيز البشرة" },
        2: { name: "العلاج والتصحيح (3–6 أسابيع)", goal: "تفتيح التصبغات وتوحيد اللون" },
        3: { name: "الصيانة والاستدامة", goal: "الحفاظ على النتيجة ومنع الانتكاس" }
    },
    levels: {
        budget: {
            vitC: { name: "Garnier Fast Bright", active: "Vitamin C + Niacinamide" },
            arbutin: { name: "AB Diet Cream", active: "Arbutin + HA" },
            correction: { name: "Acti-White Dermactive", active: "Tranexamic Acid" },
            sunblock: { name: "Starville Whitening SPF50", active: "Protection" }
        },
        super: {
            vitC: { name: "Kolagra Vitamin C Serum", active: "Vitamin C + E" },
            arbutin: { name: "Natavis Serum", active: "Arbutin + Ferulic Acid" },
            correction: { name: "XQ Pharma Serum", active: "Arbutin + Tranexamic" },
            sunblock: { name: "Kolagra SPF50 Gel", active: "Advanced Protection" }
        },
        premium: {
            vitC: { name: "Nano Treat 24K Gold", active: "Pure Vit C + Gold" },
            arbutin: { name: "Derwois Whitening Cream", active: "Arbutin + Kojic + HA" },
            correction: { name: "Melacell Glycolic Bright", active: "High-Potency Formula" },
            sunblock: { name: "Dermatique SPF50", active: "Ultra-Light Protection" }
        }
    }
};
