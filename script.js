const skinTypeData = {
    oily: { name: "دهنية", label: "نشاط دهني ملحوظ" },
    dry: { name: "جافة", label: "نقص في الترطيب الطبيعي" },
    normal: { name: "عادية", label: "توازن مثالي" }
};

const expertDatabase = {
    acne: { title: "بشرة معرضة للحبوب", active: "Salicylic Acid", products: { budget: "Starville Acne Soap", super: "Starville Gel", premium: "Effaclar Duo+" } },
    pigment: { title: "تصبغات ونمش", active: "Vitamin C + Arbutin", products: { budget: "Garnier Bright", super: "Natavis Serum", premium: "La Roche Pure C10" } },
    clear: { title: "بشرة صافية", active: "Hyaluronic Acid", products: { budget: "Eva Skin", super: "L'Oreal Revitalift", premium: "Vichy 89" } }
};

let sessionData = { ai: null, level: 'super' };

// تشغيل الكاميرا فورياً
async function init() {
    const video = document.getElementById('video');
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        video.srcObject = stream;
    } catch (e) { console.error("Camera error"); }
}
init();

document.getElementById('scanBtn').onclick = () => process(document.getElementById('video'));
document.getElementById('imageUpload').onchange = async (e) => {
    const img = await faceapi.bufferToImage(e.target.files[0]);
    process(img);
};

async function process(src) {
    const loader = document.getElementById('loading-overlay');
    loader.style.display = 'flex';
    loader.innerText = "تحليل مجهري للطبقات...";
    
    sessionData.ai = await analyzeSkin(src);
    loader.style.display = 'none';
    
    if (sessionData.ai) renderReport();
    else alert("لم يتم التعرف على الوجه");
}

function renderReport() {
    const res = document.getElementById('results');
    res.style.display = 'block';
    const ind = sessionData.ai.indicators;
    
    res.innerHTML = `
        <div class="report-card" id="pdf-content">
            <h2 class="report-head">تقرير الحالة الرقمي</h2>
            <div class="stats-grid">
                <div class="stat"><span>النوع</span><strong>${skinTypeData[ind.type].name}</strong></div>
                <div class="stat"><span>العمر التقديري</span><strong>${ind.skinAge} سنة</strong></div>
                <div class="stat"><span>النضارة</span><strong>${Math.round(ind.glow)}%</strong></div>
                <div class="stat"><span>الترطيب</span><strong>${Math.round(ind.hydration)}%</strong></div>
            </div>
            <div id="routine-box"></div>
        </div>
        <button onclick="downloadPDF()" class="pdf-btn">تحميل التقرير PDF 📄</button>
    `;
    updateRoutine();
}

function updateRoutine() {
    const ind = sessionData.ai.indicators;
    let key = ind.acne ? 'acne' : (ind.pigment ? 'pigment' : 'clear');
    const data = expertDatabase[key];
    const product = data.products[sessionData.level];

    document.getElementById('routine-box').innerHTML = `
        <div class="routine-info">
            <h3>الهدف المكتشف: ${data.title}</h3>
            <p>المادة الأساسية: ${data.active}</p>
            <div class="product-item">المنتج المقترح: <b>${product}</b></div>
        </div>
    `;
}

function downloadPDF() {
    const element = document.getElementById('pdf-content');
    html2pdf().from(element).save('Verona-Report.pdf');
}
