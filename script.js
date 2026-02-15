const expertDB = {
    acne: { title: "معرضة للحبوب", products: { budget: "Starville Soap", super: "Starville Gel", premium: "Effaclar Duo+" } },
    pigment: { title: "تصبغات ونمش", products: { budget: "Garnier Bright", super: "Natavis Serum", premium: "Vichy C10" } },
    clear: { title: "بشرة متوازنة", products: { budget: "Eva Skin", super: "L'Oreal Serum", premium: "Vichy Mineral 89" } }
};

let currentResult = null;

async function init() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        document.getElementById('video').srcObject = stream;
    } catch(e) { console.log("Camera blocked"); }
}
init();

document.getElementById('scanBtn').onclick = () => process(document.getElementById('video'));

document.getElementById('imageUpload').onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const img = new Image();
        img.onload = () => process(img);
        img.src = URL.createObjectURL(file);
    }
};

async function process(src) {
    const loader = document.getElementById('loading-overlay');
    loader.style.display = 'flex';
    loader.innerText = "جاري استخراج النتائج...";

    try {
        currentResult = await analyzeSkin(src);
        if (currentResult) {
            renderUI();
        } else {
            alert("لم نتمكن من تحليل الصورة، جرب صورة أوضح");
        }
    } catch (err) {
        alert("حدث خطأ أثناء العرض، لكن النوع المكتشف: " + (currentResult ? currentResult.type : "غير معروف"));
    } finally {
        loader.style.display = 'none';
    }
}

function renderUI() {
    const resultsDiv = document.getElementById('results');
    resultsDiv.style.cssText = "display: block !important; background: #fff; padding: 20px; color: #000; margin-top: 20px; border-radius: 10px;";
    
    let key = currentResult.acne ? 'acne' : (currentResult.pigment ? 'pigment' : 'clear');
    let data = expertDB[key];

    resultsDiv.innerHTML = `
        <div style="text-align: right; border: 2px solid #c5a059; padding: 15px; border-radius: 10px;">
            <h2 style="text-align: center;">تقرير VERONA AI</h2>
            <p>النوع: <b>${currentResult.type}</b></p>
            <p>النضارة: <b>${Math.round(currentResult.glow)}%</b></p>
            <p>الحالة: <b>${data.title}</b></p>
            <hr>
            <p>المنتج الموصى به (سوبر):<br><b style="color: #c5a059; font-size: 1.2rem;">${data.products.super}</b></p>
            <button onclick="location.reload()" style="width: 100%; padding: 10px; margin-top: 10px; background: #eee; border: none;">إعادة الفحص 🔄</button>
        </div>
    `;
    window.scrollTo(0, resultsDiv.offsetTop);
}
