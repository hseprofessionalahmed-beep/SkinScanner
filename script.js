const expertDB = {
    acne: { title: "بشرة معرضة للحبوب", product: "ستارفيل جل (Starville Gel)" },
    pigment: { title: "تصبغات ونمش", product: "ناتافيس سيروم (Natavis)" },
    clear: { title: "بشرة متوازنة", product: "فيشي مينرال 89 (Vichy)" }
};

// تشغيل الكاميرا
async function init() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        document.getElementById('video').srcObject = stream;
    } catch(e) { console.log("Camera access denied"); }
}
init();

// الفحص من الكاميرا
document.getElementById('scanBtn').onclick = async () => {
    const loader = document.getElementById('loading-overlay');
    loader.style.display = 'flex';
    loader.innerText = "جاري التحليل...";
    
    const result = await analyzeSkin(document.getElementById('video'));
    renderUI(result);
};

// الفحص من الصور (الطفل والنمش)
document.getElementById('imageUpload').onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const img = new Image();
        img.onload = async () => {
            const result = await analyzeSkin(img);
            renderUI(result);
        };
        img.src = URL.createObjectURL(file);
    }
};

function renderUI(res) {
    const loader = document.getElementById('loading-overlay');
    const resultsDiv = document.getElementById('results');
    
    loader.style.display = 'none';
    resultsDiv.style.cssText = "display: block !important; background: #fff; padding: 20px; color: #000; margin-top: 20px; border-radius: 10px; border: 3px solid #c5a059;";

    let key = res.acne ? 'acne' : (res.pigment ? 'pigment' : 'clear');
    let data = expertDB[key];

    resultsDiv.innerHTML = `
        <div style="text-align: right;">
            <h2 style="text-align: center; border-bottom: 2px solid #eee; padding-bottom: 10px;">تقرير VERONA AI</h2>
            <p>نوع البشرة: <b>${res.type}</b></p>
            <p>مستوى النضارة: <b>${Math.round(res.glow)}%</b></p>
            <p>التشخيص: <b>${data.title}</b></p>
            <div style="background: #f1f1f1; padding: 15px; margin-top: 15px; border-right: 5px solid #000;">
                المنتج الموصى به:<br>
                <strong style="font-size: 1.2rem; color: #c5a059;">${data.product}</strong>
            </div>
            <button onclick="location.reload()" style="width: 100%; padding: 12px; margin-top: 20px; background: #000; color: #fff; border: none; border-radius: 5px; cursor: pointer;">فحص جديد 🔄</button>
        </div>
    `;
    window.scrollTo(0, resultsDiv.offsetTop);
}
