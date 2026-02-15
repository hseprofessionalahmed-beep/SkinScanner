function buildRoutine(level){

let routine = "روتين علاجي متكامل:\n\n";

routine += "🧴 المرحلة 1: الترطيب\n";

if(level==="eco"){
routine +=
"• المنتج: مرطب جلسرين اقتصادي\n"+
"• المواد الفعالة: Glycerin + Panthenol\n"+
"• الاستخدام: مرتين يومياً\n"+
"• مدة النتائج: 3 أسابيع\n"+
"• نسبة التحسن: 60%\n\n";
}
else if(level==="super"){
routine +=
"• المنتج: Hyaluronic Cream متقدم\n"+
"• المواد الفعالة: Hyaluronic Acid + Vitamin C\n"+
"• الاستخدام: مرتين يومياً\n"+
"• مدة النتائج: أسبوعين\n"+
"• نسبة التحسن: 75%\n\n";
}
else{
routine +=
"• المنتج: Advanced Repair Cream\n"+
"• المواد الفعالة: Hyaluronic + Niacinamide + Peptides\n"+
"• الاستخدام: مرتين يومياً\n"+
"• مدة النتائج: 7-10 أيام\n"+
"• نسبة التحسن: 90%\n\n";
}

routine += "🔥 المرحلة 2: العلاج\n";

if(scanData.acne){
routine +=
"• Salicylic Acid 2%\n"+
"• Azelaic Acid 10%\n"+
"• الاستخدام: مساءً\n"+
"• التحسن: 70% خلال أسبوعين\n\n";
}

if(scanData.pigmentation){
routine +=
"• Alpha Arbutin 2%\n"+
"• Niacinamide 5%\n"+
"• الاستخدام: صباحاً ومساءً\n"+
"• التحسن: 65% خلال 3 أسابيع\n\n";
}

routine += "☀️ المرحلة 3: الحماية\n"+
"• واقي شمس SPF50\n"+
"• الاستخدام: صباحاً يومياً\n"+
"• يمنع رجوع المشكلة بنسبة 80%\n\n";

document.getElementById("result").classList.remove("hidden");
document.getElementById("result").innerText = routine;
}
