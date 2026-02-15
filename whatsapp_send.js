const whatsappBtn = document.getElementById("whatsappBtn");
whatsappBtn.addEventListener("click", () => {
  const phone = "201063994139";
  const msg = encodeURIComponent(window.finalRoutine);
  window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
});
