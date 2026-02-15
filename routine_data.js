function buildRoutine(data) {
  const r = document.getElementById("result");
  r.classList.remove("hidden");

  let routine = `
🧴 المرحلة الأولى (ترطيب)
- Vitamin C
- Hyaluronic Acid

🌟 المرحلة الثانية (تفتيح)
- Alpha Arbutin
- Niacinamide

☀️ المرحلة الثالثة (حماية)
- Sunscreen SPF50
`;

  if (data.acne) {
    routine += `
🔥 دعم الحبوب:
- Salicylic Acid
- Azelaic Acid
`;
  }

  r.innerHTML = `<pre>${routine}</pre>`;
  window.finalRoutine = routine;

  document.getElementById("whatsappBtn").classList.remove("hidden");
}
