function sendToWA() {
    const text = `تقرير فيرونا AI:\n${document.getElementById('resTitle').innerText}\n${document.getElementById('resDetails').innerText}\n${document.getElementById('routineBox').innerText}`;
    window.open(`https://wa.me/201063994139?text=${encodeURIComponent(text)}`);
}
