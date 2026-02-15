const expertDB = {
    acne: { title: "بشرة معرضة للحبوب", active: "Salicylic Acid", products: { budget: "Starville Soap", super: "Starville Gel", premium: "Effaclar Duo+" } },
    pigment: { title: "تصبغات ونمش", active: "Vit C / Alpha Arbutin", products: { budget: "Garnier Bright", super: "Natavis Serum", premium: "Vichy C10" } },
    clear: { title: "بشرة متوازنة", active: "Hyaluronic Acid", products: { budget: "Eva Skin", super: "L'Oreal Serum", premium: "Vichy Mineral 89" } }
};

let session = { ai: null, level: 'super' };

async function init() {
    const v = document.getElementById('video');
    try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        v.srcObject = s;
        document.getElementById('loading-overlay').style.display = 'none';
    } catch(e) {}
}
init();

document.getElementById('scanBtn').onclick = () => process(document.getElementById('video'));

document.getElementById('imageUpload').onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => process(img);
    img.src = URL.createObjectURL(file);
};

async function process(src) {
    const loader = document.getElementById('loading-overlay');
    loader.style.display = 'flex';
    loader.innerText = "جاري استخراج النتائج...";

    try {
        const res = await analyzeSkin(src);
        if (res) {
            session.ai = res;
            showResults();
        }
    } catch(err) {
        console.error(err);
    } finally {
        loader.style.display = 'none';
    }
}

function showResults() {
    const container = document.getElementById('results');
    const ind = session.ai.indicators;
    
    // إجبار الحاوية على الظهور
    container.setAttribute("style", "display: block !important; opacity: 1; visibility: visible;");

    container.innerHTML = `
        <div id="report" style="background:#fff; padding:20px; border-radius:15px; border:2px solid #c5a059; margin-top:20px; color:#000;">
            <h2 style="text-align:center;">تقرير VERONA AI</h2>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; text-align:right;">
                <p>النوع: <b>${ind.type}</b></p>
                <p>العمر: <b>${ind.age}</b></p>
                <p>النضارة: <b>${Math.round(ind.glow)}%</b></p>
                <p>الترطيب: <b>${Math.round(ind.hydration)}%</b></p>
            </div>
            <div style="display:flex; gap:5px; margin:15px 0;">
                <button onclick="updateLvl('budget')" style="flex:1; padding:8px;">اقتصادي</button>
                <button onclick="updateLvl('super')" style="flex:1; padding:8px; background:#000; color:#fff;">سوبر</button>
                <button onclick="updateLvl('premium')" style="flex:1; padding:8px;">بريميوم</button>
            </div>
            <div id="routine-info"></div>
        </div>
        <button onclick="window.open('https://wa.me/?text=تم فحص بشرتي بنجاح')" style="width:100%; padding:15px; background:#25d366; color:#fff; border:none; border-radius:50px; margin-top:10px; font-weight:bold;">واتساب ✅</button>
    `;
    updateLvl('super');
    window.scrollTo({ top: container.offsetTop, behavior: 'smooth' });
}

function updateLvl(l) {
    const ind = session.ai.indicators;
    let key = ind.acne ? 'acne' : (ind.pigment ? 'pigment' : 'clear');
    const data = expertDB[key];
    document.getElementById('routine-info').innerHTML = `
        <div style="border-top:1px solid #eee; padding-top:10px; text-align:right;">
            <p>التشخيص: <b>${data.title}</b></p>
            <p>المنتج: <b style="color:#c5a059;">${data.products[l]}</b></p>
        </div>
    `;
}
