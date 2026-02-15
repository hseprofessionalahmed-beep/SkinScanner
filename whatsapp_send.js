function sendWhatsAppReport(problems, routine) {
  let text = "🔍 تقرير تحليل البشرة\n\n";

  problems.forEach(p => {
    text += `• ${p.title}\n`;
  });

  text += "\n🧴 الروتين المقترح:\n";

  routine.forEach(r => {
    text += `
- ${r.ingredient}
الدور: ${r.role}
الاستخدام: ${r.usage}
`;
  });

  window.open(
    `https://wa.me/?text=${encodeURIComponent(text)}`,
    "_blank"
  );
}
