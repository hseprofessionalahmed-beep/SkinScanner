document.getElementById("sendWhatsApp").addEventListener("click", () => {
    const routine = Array.from(document.querySelectorAll("#skinRoutine li")).map(li => li.innerText).join("\n");
    const msg = `*نتائج فحص البشرة بالـ AI*\n\n*الروتين المقترح:*\n${routine}`;
    window.open(`https://api.whatsapp.com/send?phone=201063994139&text=${encodeURIComponent(msg)}`, "_blank");
});