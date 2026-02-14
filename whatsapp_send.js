document.getElementById("sendWhatsApp").addEventListener("click", () => {
    const routine = Array.from(document.querySelectorAll("#skinRoutine li")).map(li => li.innerText).join("\n");
    const message = `*تحليل البشرة (صالون)* ✨\n\n*الروتين الموصى به:*\n${routine}\n\n_يرجى الالتزام بالروتين للوصول لأفضل نتيجة_`;
    const phone = "201063994139";
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`, "_blank");
});