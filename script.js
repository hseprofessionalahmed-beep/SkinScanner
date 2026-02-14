const video = document.getElementById('video');
const loading = document.getElementById('loading-overlay');
const fileInput = document.getElementById('fileInput');

// تشغيل الكاميرا تلقائياً
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        video.srcObject = stream;
    } catch (err) {
        console.log("الكاميرا غير متاحة أو محجوبة");
    }
}
startCamera();

// معالجة زر الكاميرا لايف
document.getElementById('scanBtn').addEventListener('click', async () => {
    if (!isModelLoaded) {
        alert("جاري تحميل نظام الـ AI.. يرجى المحاولة بعد لحظات");
        return;
    }
    
    loading.style.display = 'flex';
    // التقاط الصورة من الفيديو وتحليلها
    const problems = await analyzeSkin(video);
    loading.style.display = 'none';

    if (!problems) {
        alert("لم نتمكن من رؤية الوجه بوضوح. يرجى توجيه الكاميرا جيداً في إضاءة مناسبة.");
    } else {
        renderResults(problems);
    }
});

// معالجة زر رفع الملفات
document.getElementById('uploadBtn').addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    loading.style.display = 'flex';
    
    try {
        const img = await faceapi.bufferToImage(file);
        const problems = await analyzeSkin(img);
        loading.style.display = 'none';

        if (!problems) {
            alert("تعذر العثور على ملامح الوجه في الصورة. تأكد من أن الوجه واضح وغير مغطى.");
        } else {
            renderResults(problems);
        }
    } catch (err) {
        loading.style.display = 'none';
        alert("خطأ في قراءة ملف الصورة. جرب ملفاً آخر.");
    }
});

function renderResults(problems) {
    const pList = document.getElementById("skinProblems");
    const rList = document.getElementById("skinRoutine");
    pList.innerHTML = ""; rList.innerHTML = "";

    problems.forEach(p => { pList.innerHTML += `<li>• ${p}</li>`; });

    let keys = new Set(["sunblock"]);
    if (problems.includes("تصبغات داكنة") || problems.includes("تصبغات خفيفة")) routines.pigmentation.forEach(k => keys.add(k));
    if (problems.includes("حبوب أو تهيج بشرة")) routines.acne.forEach(k => keys.add(k));
    if (problems.includes("هالات تحت العين")) routines.darkCircles.forEach(k => keys.add(k));

    keys.forEach(k => {
        if (products[k]) {
            products[k].forEach(prod => {
                rList.innerHTML += `<li><strong>${prod.name}</strong><br><small>${prod.actives.join(", ")}</small></li>`;
            });
        }
    });

    document.getElementById("results").style.display = "block";
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}