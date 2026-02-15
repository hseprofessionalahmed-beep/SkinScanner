const expertDB = {
    acne: { 
        title: "بشرة معرضة للحبوب", 
        active: "Salicylic Acid", 
        products: { budget: "Starville Soap", super: "Starville Gel", premium: "Effaclar Duo+" } 
    },
    pigment: { 
        title: "تصبغات ونمش", 
        active: "Alpha Arbutin / Vit C", 
        products: { budget: "Garnier Bright", super: "Natavis Serum", premium: "Vichy Liftactiv C10" } 
    },
    clear: { 
        title: "بشرة متوازنة", 
        active: "Hyaluronic Acid", 
        products: { budget: "Eva Skin", super: "L'Oreal Serum", premium: "Vichy Mineral 89" } 
    }
};

let session = { ai: null, level: 'super' };

// تشغيل الكاميرا
async function startCam() {
    const video = document.getElementById('video');
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        video.srcObject = stream;
    } catch(e) { console.warn("Cam access denied"); }
}
startCam();

// زر الفحص (الكاميرا)
document.getElementById('scanBtn').onclick = () => processImage(document.getElementById('video'));

// معالجة رفع الصور (محدثة لضمان السرعة)
document.getElementById('imageUpload').onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const loader = document.getElementById('loading-overlay');
    loader.style.display = 'flex';
    loader.innerText = "جاري الفحص المجهري...";

    const img = new Image();
    img.onload = async () => {
        session.ai = await analyzeSkin(img);
        loader.style.display = 'none';
        if (session.ai) renderResults();
    };
    img.src = URL.createObjectURL(file);
};

async function processImage(src) {
    const loader = document.getElementById('loading-overlay');
    loader.style.display = 'flex';
    loader.innerText = "جاري التحليل الرقمي...";

    const result = await analyzeSkin(src);
    loader.style.display = 'none';
    if (result) {
        session.ai = result;
        renderResults();
    }
}

function renderResults() {
    const res = document.getElementById('results');
    res.style.display = 'block';
    const ind = session.ai.indicators;
    
    res.innerHTML = `
        <div class="report-card" id="report-card" style="background:#fff; padding:20px; border-radius:15px;">
            <h2 style="text-align:center;">تقرير VERONA AI</h2>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:15px; text-align:right;">
                <div style="background:#f9f9f9; padding:10px;">النوع: <b>${ind.type}</b></div>
                <div style="background:#f9f9f9; padding:10px;">العمر: <b>${ind.age} سنة</b></div>
                <div style="background:#f9f9f9; padding:10px;">النضارة: <b>${Math.round(ind.glow)}%</b></div>
                <div style="background:#f9f9f9; padding:10px;">الترطيب: <b>${Math.round(ind.hydration)}%</b></div>
            </div>
            <div class="level-selector" style="display:flex; gap:5px; margin:20px 0;">
                <button onclick="setLevel('budget')" id="l-budget" style="flex:1; padding:8px;">اقتصادي</button>
                <button onclick="setLevel('super')" id="l-super" style="flex:1; padding:8px;">سوبر</button>
                <button onclick="setLevel('premium')" id="l-premium" style="flex:1; padding:8px;">بريميوم</button>
            </div>
            <div id="routine-details"></div>
        </div>
        <button onclick="sendWA()" style="width:100%; padding:15px; background:#25d366; color:#fff; border:none; border-radius:50px; margin-top:10px; font-weight:bold;">إرسال للواتساب ✅</button>
        <button onclick="savePDF()" style="width:100%; padding:10px; background:#333; color:#fff; border:none; border-radius:10px; margin-top:10px;">حفظ PDF 📄</button>
    `;
    setLevel('super');
    res.scrollIntoView({ behavior: 'smooth' });
}

function setLevel(l) {
    session.level = l;
    document.querySelectorAll('.level-selector button').forEach(b => {
        b.style.background = "#fff"; b.style.color = "#000";
    });
    const btn = document.getElementById('l-' + l);
    btn.style.background = "#000"; btn.style.color = "#fff";
    
    const ind = session.ai.indicators;
    let key = ind.acne ? 'acne' : (ind.pigment ? 'pigment' : 'clear');
    const data = expertDB[key];

    document.getElementById('routine-details').innerHTML = `
        <div style="margin-top:15px; border-right:4px solid #c5a059; padding-right:10px; text-align:right;">
            <h4 style="margin:0;">التشخيص: ${data.title}</h4>
            <p style="font-size:0.9rem;">المنتج الموصى به: <b>${data.products[l]}</b></p>
        </div>
    `;
}

function sendWA() {
    const ind = session.ai.indicators;
    const msg = `*تقرير فيرونا للبشرة*%0Aالنوع: ${ind.type}%0Aالنضارة: ${Math.round(ind.glow)}%25`;
    window.open(`https://wa.me/?text=${msg}`);
}

function savePDF() {
    const el = document.getElementById('report-card');
    html2pdf().from(el).save('Verona-Report.pdf');
}
