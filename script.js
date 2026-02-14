const video = document.getElementById('video');
const loading = document.getElementById('loading-overlay');
const fileInput = document.getElementById('fileInput');

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        video.srcObject = stream;
    } catch (err) { console.log("Camera access denied"); }
}
startCamera();

document.getElementById('scanBtn').addEventListener('click', async () => {
    loading.style.display = 'flex';
    const problems = await analyzeSkin(video);
    loading.style.display = 'none';
    if (!problems) return alert("لم يتم العثور على وجه بوضوح");
    renderResults(problems);
});

document.getElementById('uploadBtn').addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    loading.style.display = 'flex';
    const img = await faceapi.bufferToImage(file);
    const problems = await analyzeSkin(img);
    loading.style.display = 'none';
    if (!problems) return alert("تعذر تحليل الصورة، حاول مرة أخرى");
    renderResults(problems);
});

function renderResults(problems) {
    const pList = document.getElementById("skinProblems");
    const rList = document.getElementById("skinRoutine");
    pList.innerHTML = ""; rList.innerHTML = "";
    problems.forEach(p => { pList.innerHTML += `<li>• ${p}</li>`; });

    let keys = new Set(["sunblock"]);
    if (problems.includes("تصبغات عميقة") || problems.includes("تصبغات خفيفة")) routines.pigmentation.forEach(k => keys.add(k));
    if (problems.includes("حبوب نشطة/تهيج")) routines.acne.forEach(k => keys.add(k));
    if (problems.includes("هالات سوداء")) routines.darkCircles.forEach(k => keys.add(k));

    keys.forEach(k => {
        products[k].forEach(prod => {
            rList.innerHTML += `<li><strong>${prod.name}</strong><br><small>${prod.actives.join(", ")}</small></li>`;
        });
    });
    document.getElementById("results").style.display = "block";
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}