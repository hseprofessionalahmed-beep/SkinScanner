function analyzeFace(image) {
  console.log("🧠 AI analyzing image...");

  const indicators = [];

  // تحليل الألوان بشكل نسبي
  const redness = Math.random();      // محاكاة الاحمرار
  const pigmentation = Math.random(); // محاكاة التصبغات

  if (redness > 0.4) indicators.push("احمرار / تهيج محتمل");
  if (pigmentation > 0.4) indicators.push("تصبغات داكنة محتملة");
  if (indicators.length === 0) indicators.push("بشرة متوازنة");

  // عرض النتائج
  document.getElementById("indicatorsList").innerHTML =
    indicators.map(i => `<li>• ${i}</li>`).join("");

  document.getElementById("evidence-panel").classList.remove("hidden");

  return { redness, pigmentation };
}
