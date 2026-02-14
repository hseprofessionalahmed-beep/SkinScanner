const products = {
    morning: {
        vitC: { name: "XQ Pharma Serum", active: "Vitamin C + Niacinamide", goal: "نضارة وحماية من الأكسدة" },
        sunblock: { name: "Collagra SPF50", active: "UV Filters", goal: "حماية من التصبغات" },
        moisturizer: { name: "Hyalu-Pump", active: "Hyaluronic Acid", goal: "ترطيب عميق" }
    },
    evening: {
        pigmentation: { name: "Derwois Whitening", active: "Alpha Arbutin + Kojic Acid", goal: "تفتيح التصبغات" },
        acne: { name: "Adapalene Gel", active: "Retinoid (Vitamin A)", goal: "علاج الحبوب وتجديد البشرة" },
        exfoliant: { name: "Derma Ten Glycolic", active: "Glycolic Acid 10%", goal: "تقشير كيميائي لطيف" },
        eye: { name: "Eva Eye Cream", active: "Caffeine + HA", goal: "علاج الهالات والانتفاخ" }
    }
};

const routines = {
    pigmentation: {
        items: ["morning.vitC", "morning.sunblock", "evening.pigmentation", "evening.exfoliant"],
        duration: "8-12 أسبوع",
        improvement: "70% - 85%"
    },
    acne: {
        items: ["morning.sunblock", "morning.moisturizer", "evening.acne", "evening.exfoliant"],
        duration: "4-8 أسابيع",
        improvement: "60% - 80%"
    },
    darkCircles: {
        items: ["morning.vitC", "evening.eye"],
        duration: "6-10 أسابيع",
        improvement: "50% - 65%"
    },
    healthy: {
        items: ["morning.sunblock", "morning.moisturizer"],
        duration: "يومي كوقاية",
        improvement: "الحفاظ على حيوية الجلد"
    }
};
