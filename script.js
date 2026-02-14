const video = document.getElementById('video');
const scanBtn = document.getElementById('scanBtn');
const loading = document.getElementById('loading-overlay');

// تشغيل الكاميرا
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        video.srcObject = stream;
    } catch (err) {
        alert("يرجى تفعيل صلاحية الكاميرا للمتابعة");
    }
}

startCamera();

scanBtn.addEventListener('click', async () => {
    loading.style.display = 'flex';
    
    // إعطاء مهلة صغيرة للـ AI لمعالجة الفريم
    setTimeout(async () => {
        const problems = await analyzeSkin(video);
        loading.style.display = 'none';

        if (!problems) {
            alert("لم نتمكن من رؤية الوجه بوضوح. يرجى تعديل الإضاءة.");
            return;
        }

        renderResults(problems);
    }, 500);
});

function renderResults(problems) {
    const pList = document.getElementById("skinProblems");
    const rList = document.getElementById("skinRoutine");
    pList.innerHTML = ""; rList.innerHTML = "";

    problems.forEach(p => {
        const li = document.createElement("li"); li.textContent = "• " + p; pList.appendChild(li);
    });

    let keys = new Set(["sunblock"]);
    if (problems.includes("تصبغات عميقة") || problems.includes("تصبغات خفيفة")) routines.pigmentation.forEach(k => keys.add(k));
    if (problems.includes("حبوب نشطة/تهيج")) routines.acne.forEach(k => keys.add(k));
    if (problems.includes("هالات سوداء")) routines.darkCircles.forEach(k => keys.add(k));

    keys.forEach(k => {
        products[k].forEach(prod => {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${prod.name}</strong><br><small>المواد: ${prod.actives.join(", ")}</small>`;
            rList.appendChild(li);
        });
    });

    document.getElementById("results").style.display = "block";
    document.getElementById("results").scrollIntoView({ behavior: 'smooth' });
}