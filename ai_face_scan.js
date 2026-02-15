function analyzeFace(image) {
  console.log("🧠 AI analyzing image...");

  const indicators = [];

  // تحليل بسيط للألوان (محاكاة AI Vision)
  const redness = Math.random();
  const pigmentation = Math.random();

  if (redness > 0.4) indicators.push("احمرار / تهيج محتمل");
  if (pigmentation > 0.4) indicators.push("تصبغات داكنة محتملة");
  if (indicators.length === 0) indicators.push("بشرة متوازنة");

  document.getElementById("indicatorsList").innerHTML =
    indicators.map(i => `<li>• ${i}</li>`).join("");

  document.getElementById("evidence-panel").classList.remove("hidden");

  return {
    redness,
    pigmentation
  };
}
