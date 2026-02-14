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
    if (!isModelLoaded) return;
    loading.style.display = 'flex';
    loading.innerText = "جاري التحليل الفوري...";
    
    const problems = await analyzeSkin(video);
    loading.style.display = 'none';

    if (problems) renderResults(problems);
    else alert("تعذر العثور على الوجه. يرجى الاقتراب من الكاميرا وزيادة الإضاءة.");
});

document.getElementById('uploadBtn').addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    loading.style.display = 'flex';
    loading.innerText = "جاري معالجة الصورة...";

    const reader = new FileReader();
    reader.onload = async (event) => {
        const img = new Image();
        img.onload = async () => {
            const problems = await analyzeSkin(img);
            loading.style.display = 'none';
            if (problems) renderResults(problems);
            else alert("لم يتم اكتشاف وجه في الصورة المرفوعة.");
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
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
        if(!maxDuration) maxDuration = routines.darkCircles.duration;
        if(!maxImprovement) maxImprovement = routines.darkCircles.improvement;
    }

    const phases = { morning: "☀️ الروتين الصباحي (وقاية وحماية)", evening: "🌙 الروتين المسائي (علاج وصيانة)" };
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
    document.getElementById("treatmentDuration").innerText = `📅 الجدول الزمني: ${maxDuration || "6 أسابيع"}`;
    document.getElementById("improvementRate").innerText = maxImprovement || "40% - 50%";
    document.getElementById("results").style.display = "block";
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}