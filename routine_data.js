// routine_data.js
// بيانات المنتجات والروتينات لمشروع VERONA AI

const ROUTINES = {
  "اقتصادي": [
    {
      name: "Vitamin C Serum",
      actives: ["Vitamin C", "Niacinamide"],
      benefits: "ترطيب + تفتيح + مضاد أكسدة",
      duration: "يومياً صباحاً"
    },
    {
      name: "Hyaluronic Acid",
      actives: ["Hyaluronic Acid"],
      benefits: "ترطيب عميق + مرونة",
      duration: "يومياً صباحاً ومساءً"
    },
    {
      name: "Collagra Sunscreen SPF50",
      actives: ["UV Filter", "Vitamin C"],
      benefits: "حماية + توحيد اللون",
      duration: "صباحاً قبل الخروج"
    }
  ],
  "سوبر": [
    {
      name: "Nano Treat 24K Gold Serum",
      actives: ["Gold 24K", "Vitamin C", "Vitamin E", "Collagen"],
      benefits: "إشراقة + مرونة + تقليل التجاعيد",
      duration: "يومياً"
    },
    {
      name: "Derois Whitening Cream",
      actives: ["Alpha Arbutin", "Vitamin C", "Hyaluronic Acid", "Kojic Acid"],
      benefits: "تفتيح البقع الداكنة + حماية + توحيد اللون",
      duration: "صباح ومساء حسب الحاجة"
    },
    {
      name: "Cleo Radiance Booster Night Serum",
      actives: ["Alpha Arbutin", "HA Exfoliant", "Niacinamide"],
      benefits: "تقشير لطيف + تفتيح + تجدد خلايا الجلد",
      duration: "مساءً فقط"
    },
    {
      name: "Starfeel Sunscreen SPF50+",
      actives: ["UV Filter", "Alpha Arbutin"],
      benefits: "حماية + توحيد اللون",
      duration: "صباحاً قبل الخروج"
    }
  ],
  "ألترا": [
    {
      name: "XQ Pharma Serum",
      actives: ["Alpha Arbutin", "Tranexamic Acid", "Vitamin C", "Niacinamide"],
      benefits: "تصحيح لون البشرة بسرعة + ترطيب + مضادات أكسدة",
      duration: "يومياً"
    },
    {
      name: "Nano Treat 24K Gold Serum",
      actives: ["Gold 24K", "Vitamin C", "Vitamin E", "Collagen", "Liposomal Tech"],
      benefits: "إشراقة + ترطيب عميق + تقليل التجاعيد والخطوط الدقيقة",
      duration: "يومياً"
    },
    {
      name: "Derois Whitening Cream",
      actives: ["Alpha Arbutin", "Vitamin C", "Hyaluronic Acid", "Kojic Acid"],
      benefits: "تفتيح البقع الداكنة + حماية + توحيد اللون",
      duration: "صباح ومساء حسب الحاجة"
    },
    {
      name: "Cleo Radiance Booster Night Serum",
      actives: ["Alpha Arbutin", "HA Exfoliant", "Niacinamide"],
      benefits: "تقشير لطيف + تفتيح + تجدد خلايا الجلد",
      duration: "مساءً فقط"
    },
    {
      name: "Eva Sunscreen SPF50",
      actives: ["UV Filter"],
      benefits: "حماية + تحكم في الدهون",
      duration: "صباحاً قبل الخروج"
    },
    {
      name: "Panthenol Plus Carbamide / Linx Cream",
      actives: ["Panthenol", "Carbamide"],
      benefits: "ترطيب + تقشير لطيف",
      duration: "يومياً حسب الحاجة"
    }
  ]
};

// دالة مساعدة لإرجاع الروتين حسب الفئة
function getRoutineByType(type) {
  return ROUTINES[type] || [];
}
// بيانات الروتين حسب النتائج
const routines = {
    "بشرة مثالية ✅": {
        type: "اقتصادي",
        steps: [
            { phase: "ترطيب", products: ["Vitamin C + Hyaluronic Acid"] },
            { phase: "تفتيح", products: ["Alpha Arbutin + Niacinamide"] },
            { phase: "حماية", products: ["Sunscreen SPF50"] }
        ]
    },
    "هالات سوداء مكتشفة 👁️": {
        type: "سوبر",
        steps: [
            { phase: "ترطيب", products: ["Caffeine Eye Cream", "Hyaluronic Acid"] },
            { phase: "علاج الهالات", products: ["Niacinamide + Vitamin C"] },
            { phase: "حماية", products: ["Sunscreen SPF50"] }
        ]
    },
    "تصبغات / نمش نشط 🔍": {
        type: "ألترا",
        steps: [
            { phase: "ترطيب", products: ["Hyaluronic Acid"] },
            { phase: "علاج التصبغات", products: ["Alpha Arbutin + Tranexamic Acid"] },
            { phase: "حماية", products: ["Sunscreen SPF50 + Antioxidants"] }
        ]
    }
};
