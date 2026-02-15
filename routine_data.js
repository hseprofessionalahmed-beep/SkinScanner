function buildRoutine(problems) {
  const routine = [];

  problems.forEach(p => {
    if (p.key === "acne") {
      routine.push({
        ingredient: "Salicylic Acid 2%",
        role: "تنظيف المسام وتقليل الحبوب",
        usage: "صباحًا مرة يوميًا – 6 أسابيع"
      });
    }

    if (p.key === "pigmentation") {
      routine.push({
        ingredient: "Vitamin C 10%",
        role: "تفتيح وتوحيد لون البشرة",
        usage: "صباحًا – 8 إلى 12 أسبوع"
      });
    }

    if (p.key === "darkCircles") {
      routine.push({
        ingredient: "Caffeine + Niacinamide",
        role: "تقليل الهالات",
        usage: "ليلاً حول العين – 4 أسابيع"
      });
    }
  });

  return routine;
}
