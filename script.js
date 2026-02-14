const video = document.getElementById('video');
const loading = document.getElementById('loading-overlay');

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        video.srcObject = stream;
    } catch (err) { console.log("Camera access error"); }
}
startCamera();

document.getElementById('scanBtn').addEventListener('click', async () => {
    loading.style.display = 'flex';
    const problems = await analyzeSkin(video);
    loading.style.display = 'none';
    if (problems) renderResults(problems);
    else alert("لم يتم اكتشاف وجه بوضوح");
});

document.getElementById('uploadBtn').addEventListener('click', () => document.getElementById('fileInput').click());

document.getElementById('fileInput').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    loading.style.display = 'flex';
    const img = await faceapi.bufferToImage(file);
    const problems = await analyzeSkin(img);
    loading.style.display = 'none';
    if (problems) renderResults(problems);
});

function renderResults(problems) {
    const pList = document.getElementById("skinProblems");
    const rList = document.getElementById("skinRoutine");
    pList.innerHTML = ""; rList.innerHTML = "";

    problems.forEach(p => { pList.innerHTML += `<li>• ${p}</li>`; });

    let selectedProducts = new Set();
    let maxDuration = "";
    let maxImprovement = "";

    if (problems.includes("تصبغات داكنة") || problems.includes("تصبغات خفيفة")) {
        routines.pigmentation.items.forEach(i => selectedProducts.add(i));
        maxDuration = routines.pigmentation.duration;
        maxImprovement = routines.pigmentation.improvement;
    }
    if (problems.includes("حبوب أو تهيج بشرة")) {
        routines.acne.items.forEach(i => selectedProducts.add(i));
        maxDuration = routines.acne.duration;
        maxImprovement = routines.acne.improvement;
    }
    if (problems.includes("هالات تحت العين")) {
        routines.darkCircles.items.forEach(i => selectedProducts.add(i));
    }

    // بناء الروتين
    const phases = { morning: "☀️ الروتين الصباحي (حماية)", evening: "🌙 الروتين المسائي (علاج)" };
    let html = "";
    
    Object.keys(phases).forEach(phase => {
        let itemsHtml = "";
        selectedProducts.forEach(path => {
            const [pPhase, pKey] = path.split('.');
            if (pPhase === phase) {
                const p = products[pPhase][pKey];
                itemsHtml += `<div class="item"><strong>${p.name}</strong><br><small>المادة الفعالة: ${p.active}</small><div class="goal">${p.goal}</div></div>`;
            }
        });
        if (itemsHtml) html += `<div class="phase"><h4>${phases[phase]}</h4>${itemsHtml}</div>`;
    });

    rList.innerHTML = html;
    document.getElementById("treatmentDuration").innerText = `📅 مدة الاستخدام المقترحة: ${maxDuration || "6 أسابيع"}`;
    document.getElementById("improvementRate").innerText = maxImprovement || "40% - 50%";
    document.getElementById("results").style.display = "block";
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}