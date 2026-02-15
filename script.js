const skinTypeData = {
    oily: { name: "دهنية" },
    dry: { name: "جافة" },
    normal: { name: "عادية" }
};

const expertDatabase = {
    acne: { 
        title: "بشرة معرضة للحبوب", 
        active: "Salicylic Acid", 
        products: { budget: "Starville Acne Soap", super: "Starville Gel", premium: "Effaclar Duo+" } 
    },
    pigment: { 
        title: "تصبغات ونمش", 
        active: "Alpha Arbutin + Vit C", 
        products: { budget: "Garnier Bright", super: "Natavis Whitening", premium: "Vichy Liftactiv C10" } 
    },
    clear: { 
        title: "بشرة مثالية", 
        active: "Hyaluronic Acid", 
        products: { budget: "Eva Skin", super: "L'Oreal Revitalift", premium: "Vichy Mineral 89" } 
    }
};

let sessionData = { ai: null, level: 'super' };

// تشغيل الكاميرا
async function init() {
    const video = document.getElementById('video');
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        video.srcObject = stream;
    } catch (e) { console.error("Camera Access Denied"); }
}
init();

document.getElementById('scanBtn').onclick = () => process(document.getElementById('video'));
document.getElementById('imageUpload').onchange = async (e) => {
    if (e.target.files[0]) {
        const img = await faceapi.bufferToImage(e.target.files[0]);
        process(img);
    }
};

async function process(src) {
    const loader = document.getElementById('loading-overlay');
    loader.style.display = 'flex';
    loader.innerText = "تحليل VERONA الرقمي...";
    
    // تأخير بسيط لضمان ثبات الصورة
    setTimeout(async () => {
        sessionData.ai = await analyzeSkin(src);
        loader.style.display = 'none';
        if (sessionData.ai) renderReport();
        else alert("تعذر التعرف على الوجه. يرجى تحسين الإضاءة.");
    }, 500);
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
                <div class="stat"><span>العمر</span><strong>${ind.skinAge} سنة</strong></div>
                <div class="stat"><span>النضارة</span><strong>${Math.round(ind.glow)}%</strong></div>
                <div class="stat"><span>الترطيب</span><strong>${Math.round(ind.hydration)}%</strong></div>
            </div>
            <div class="level-selector" style="display:flex; gap:5px; margin:15px 0;">
                <button onclick="changeLevel('budget')" id="btn-budget" style="flex:1; padding:10px;">اقتصادي</button>
                <button onclick="changeLevel('super')" id="btn-super" class="active" style="flex:1; padding:10px;">سوبر</button>
                <button onclick="changeLevel('premium')" id="btn-premium" style="flex:1; padding:10px;">بريميوم</button>
            </div>
            <div id="routine-box"></div>
        </div>
        <button onclick="sendWhatsApp()" class="wa-btn" style="width:100%; padding:15px; background:#25d366; color:#fff; border-radius:50px; border:none; margin-top:10px; font-weight:bold;">إرسال للواتساب ✅</button>
        <button onclick="downloadPDF()" class="pdf-btn" style="width:100%; margin-top:10px; padding:10px; background:#444; color:#fff; border:none; border-radius:10px;">تحميل PDF 📄</button>
    `;
    updateRoutine();
    res.scrollIntoView({ behavior: 'smooth' });
}

function changeLevel(lvl) {
    sessionData.level = lvl;
    document.querySelectorAll('.level-selector button').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-' + lvl).classList.add('active');
    updateRoutine();
}

function updateRoutine() {
    const ind = sessionData.ai.indicators;
    let key = ind.acne ? 'acne' : (ind.pigment ? 'pigment' : 'clear');
    const data = expertDatabase[key];
    const product = data.products[sessionData.level];

    document.getElementById('routine-box').innerHTML = `
        <div class="routine-info" style="text-align:right; border-top:1px solid #eee; padding-top:15px;">
            <h4 style="color:#c5a059; margin:0;">التشخيص: ${data.title}</h4>
            <p style="font-size:0.9rem;">المادة الفعالة: ${data.active}</p>
            <div style="background:#f9f9f9; padding:10px; border-right:4px solid #000;">
                المنتج المقترح:<br><strong>${product}</strong>
            </div>
        </div>
    `;
}

function sendWhatsApp() {
    const ind = sessionData.ai.indicators;
    let key = ind.acne ? 'acne' : (ind.pigment ? 'pigment' : 'clear');
    const data = expertDatabase[key];
    const product = data.products[sessionData.level];

    const text = `*تقرير فيرونا AI للبشرة*%0A` +
                 `نوع البشرة: ${skinTypeData[ind.type].name}%0A` +
                 `العمر التقديري: ${ind.skinAge} سنة%0A` +
                 `التشخيص: ${data.title}%0A` +
                 `المنتج الموصى به: ${product}`;
    window.open(`https://wa.me/?text=${text}`, '_blank');
}

function downloadPDF() {
    const element = document.getElementById('pdf-content');
    html2pdf().from(element).save('Verona-Report.pdf');
}
