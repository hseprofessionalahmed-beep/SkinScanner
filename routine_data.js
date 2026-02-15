function buildRoutine(data) {
  const r = document.getElementById("result");
  r.classList.remove("hidden");

  let routine = "🧴 **مرحلة الترطيب**\n";
  if(data.level==="eco"){
    routine += "- Nivea Soft (مرطب اقتصادي)\n- Vitamin C\n";
  } else if(data.level==="super"){
    routine += "- La Roche-Posay Hydraphase (سوبر)\n- Vitamin C + Hyaluronic Acid\n";
  } else {
    routine += "- Skinceuticals Hydrating B5 (ألترا)\n- Vitamin C + Hyaluronic Acid + Niacinamide\n";
  }

  routine += "\n🔥 **مرحلة العلاج**\n";
  if(data.acne) routine += "- Salicylic Acid 2%\n- Azelaic Acid 10%\n";
  if(data.pigmentation) routine += "- Alpha Arbutin 2%\n- Niacinamide 5%\n";

  routine += "\n☀️ **مرحلة الصيانة / الحماية**\n- Sunscreen SPF50\n";
  if(data.level==="eco") routine += "- Sunblock Nivea (اقتصادي)\n";
  else if(data.level==="super") routine += "- La Roche-Posay Anthelios (سوبر)\n";
  else routine += "- Skinceuticals Physical Fusion (ألترا)\n";

  r.innerHTML = `<pre>${routine}</pre>`;
  window.finalRoutine = routine;

  document.getElementById("whatsappBtn").classList.remove("hidden");
}
