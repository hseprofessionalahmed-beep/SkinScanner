document.getElementById("sendWhatsApp").addEventListener("click", () => {
    const problems = Array.from(document.querySelectorAll("#skinProblems li")).map(li => li.innerText).join(", ");
    const routine = Array.from(document.querySelectorAll(".item")).map(div => div.innerText.split('\n')[0]).join(" - ");
    const duration = document.getElementById("treatmentDuration").innerText;
    const rate = document.getElementById("improvementRate").innerText;

    const msg = `*تقرير تحليل البشرة (الصالون)* ✨\n\n*المشاكل:* ${problems}\n\n*الروتين المقترح:* ${routine}\n\n*${duration}*\n*نسبة التحسن المتوقعة:* ${rate}`;
    window.open(`https://api.whatsapp.com/send?phone=201063994139&text=${encodeURIComponent(msg)}`, "_blank");
});