function buildSkinProblems(scan) {
  const problems = [];

  if (scan.acne)
    problems.push({ key: "acne", title: "حبوب / تهيج بشرة" });

  if (scan.pigmentation)
    problems.push({ key: "pigmentation", title: "تصبغات داكنة" });

  if (scan.darkCircles)
    problems.push({ key: "darkCircles", title: "هالات تحت العين" });

  return problems;
}

function generateQuestions(problems) {
  const questions = [];

  problems.forEach(p => {
    if (p.key === "acne")
      questions.push("هل الحبوب ملتهبة؟");

    if (p.key === "pigmentation")
      questions.push("هل تزيد التصبغات مع الشمس؟");

    if (p.key === "darkCircles")
      questions.push("ما لون الهالات؟");
  });

  return questions;
}
