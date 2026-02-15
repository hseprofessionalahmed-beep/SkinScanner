function analyzeFace(image) {
  console.log("🧠 AI analyzing image...");

  const indicators = [];
  const brightness = getBrightness(image); // سطوع الصورة
  const redness = Math.random();            // محاكاة الاحمرار
  const pigmentation = Math.random();       // محاكاة التصبغات

  // تعليمات للمستخدم
  const instructionsDiv = document.getElementById("instructions");
  if (brightness < 50) {
    instructionsDiv.innerText = "⚠️ الإضاءة ضعيفة، حاول زيادة الضوء";
  } else {
    instructionsDiv.innerText = "✅ الصورة واضحة";
  }

  if (redness > 0.4) indicators.push("احمرار / تهيج محتمل");
  if (pigmentation > 0.4) indicators.push("تصبغات داكنة محتملة");
  if (indicators.length === 0) indicators.push("بشرة متوازنة");

  document.getElementById("indicatorsList").innerHTML =
    indicators.map(i => `<li>• ${i}</li>`).join("");

  document.getElementById("evidence-panel").classList.remove("hidden");

  return { redness, pigmentation, brightness };
}

// دالة تقدير سطوع الصورة
function getBrightness(image) {
  const canvas = document.createElement("canvas");
  canvas.width = image.width || 320;
  canvas.height = image.height || 240;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  const data = ctx.getImageData(0,0,canvas.width,canvas.height).data;
  let colorSum = 0;
  for(let i=0; i<data.length; i+=4){
    const avg = (data[i]+data[i+1]+data[i+2])/3;
    colorSum += avg;
  }
  return colorSum / (canvas.width*canvas.height);
}
