const video = document.getElementById('video');
const loading = document.getElementById('loading-overlay');
const fileInput = document.getElementById('fileInput');

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        video.srcObject = stream;
    } catch (err) { console.log("Camera access error"); }
}
startCamera();

document.getElementById('scanBtn').addEventListener('click', async () => {
    if (!isModelLoaded) return;
    loading.style.display = 'flex';
    loading.innerText = "جاري فحص طبقات الجلد...";

    // مهلة قصيرة لضمان استقرار الصورة
    setTimeout(async () => {
        const problems = await analyzeSkin(video);
        loading.style.display = 'none';
        if (problems) renderResults(problems);
        else alert("يرجى الاقتراب من الكاميرا أكثر");
    }, 200);
});

document.getElementById('uploadBtn').addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', async (e) => {
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
    let duration = "6-8 أسابيع";
    let improvement = "40-60%";

    if (problems.includes("تصبغات داكنة") || problems.includes("تصبغات خفيفة")) {
        routines.pigmentation.items.forEach(i => selectedProducts.add(i));
        duration = routines.pigmentation.duration;
        improvement = routines.pigmentation.improvement;
    }
    if (problems.includes("حبوب أو تهيج بشرة")) {
        routines.acne.items.forEach(i => selectedProducts.add(i));
        duration = routines.acne.duration;
        improvement = routines.acne.improvement;
    }
    if (problems.includes("هالات تحت العين")) {
        routines.darkCircles.items.forEach(i => selectedProducts.add(i));
    }

    const phases = { morning: "☀️ الروتين الصباحي (وقاية)", evening: "🌙 الروتين المسائي (علاج وصيانة)" };
    let html = "";
    
    Object.keys(phases).forEach(phase => {
        let itemsHtml = "";
        selectedProducts.forEach(path => {
            const [pPhase, pKey] = path.split('.');
            if (pPhase === phase) {
                const p = products[pPhase][pKey];
                itemsHtml += `
                    <div class="item">
                        <strong>${p.name}</strong>
                        <div class="active-tag">المادة الفعالة: ${p.active}</div>
                        <div class="goal-text">${p.goal}</div>
                    </div>`;
            }
        });
        if (itemsHtml) html += `<div class="phase-card"><h4>${phases[phase]}</h4>${itemsHtml}</div>`;
    });

    rList.innerHTML = html;
    document.getElementById("treatmentDuration").innerText = `📅 مدة الاستخدام: ${duration}`;
    document.getElementById("improvementRate").innerText = improvement;
    document.getElementById("results").style.display = "block";
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}