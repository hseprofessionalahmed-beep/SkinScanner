function sendToWA(){
    const title = document.getElementById('resTitle').innerText;
    const routine = document.getElementById('routineBox').innerText;
    const text = `تقرير فيرونا AI: ${title}\n${routine}`;
    window.open(`https://wa.me/201063994139?text=${encodeURIComponent(text)}`);
}
