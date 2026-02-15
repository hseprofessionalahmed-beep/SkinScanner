const expertDB = {
    acne: { 
        title: "بشرة معرضة للحبوب", 
        active: "Salicylic Acid", 
        products: { budget: "ستارفيل صابون", super: "ستارفيل جل", premium: "إيفاكلار ديو+" } 
    },
    pigment: { 
        title: "تصبغات ونمش", 
        active: "Alpha Arbutin", 
        products: { budget: "جارنييه برايت", super: "ناتافيس سيروم", premium: "فيشي سي 10" } 
    },
    clear: { 
        title: "بشرة متوازنة", 
        active: "Hyaluronic Acid", 
        products: { budget: "إيفا سكين", super: "لوريال سيروم", premium: "مينرال 89" } 
    }
};

let session = { ai: null, level: 'super' };

async function startCam() {
    try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        document.getElementById('video').srcObject = s;
    } catch(e) { console.error("Camera fail"); }
}
startCam();

document.getElementById('scanBtn').onclick = () => processImage(document.getElementById('video'));
document.getElementById('imageUpload').onchange = async (e) => {
    const img = await faceapi.bufferToImage(e.target.files[0]);
    processImage(img);
};

async function processImage(src) {
    const loader = document.getElementById('loading-overlay');
    loader.style.display = 'flex';
    loader.innerText = "جاري التحليل المجهري...";

    setTimeout(async () => {
        session.ai = await analyzeSkin(src);
        loader.style.display = 'none';
        if (session.ai) renderResults();
        else alert("تعذر التعرف على الوجه، حاول في إضاءة أفضل");
    }, 500);
}

function renderResults() {
    const res = document.getElementById('results');
    res.style.display = 'block';
    const ind = session.ai.indicators;
    
    res.innerHTML = `
        <div class="card" id="report">
            <h2>تقرير فيرونا الذكي</h2>
            <div class="grid">
                <div>النوع: <b>${ind.type}</b></div>
                <div>العمر: <b>${ind.age}</b></div>
                <div>النضارة: <b>${Math.round(ind.glow)}%</b></div>
                <div>الترطيب: <b>${Math.round(ind.hydration)}%</b></div>
            </div>
            <div class="levels">
                <button onclick="setLevel('budget')">اقتصادي</button>
                <button onclick="setLevel('super')" class="active">سوبر</button>
                <button onclick="setLevel('premium')">بريميوم</button>
            </div>
            <div id="routine"></div>
        </div>
        <button class="wa-btn" onclick="sendWA()">إرسال واتساب ✅</button>
        <button class="pdf-btn" onclick="savePDF()">حفظ PDF 📄</button>
    `;
    setLevel('super');
}

function setLevel(l) {
    session.level = l;
    const ind = session.ai.indicators;
    let key = ind.acne ? 'acne' : (ind.pigment ? 'pigment' : 'clear');
    const data = expertDB[key];
    
    document.getElementById('routine').innerHTML = `
        <div class="routine-box">
            <h4>التشخيص: ${data.title}</h4>
            <p>المنتج الموصى به: <b>${data.products[l]}</b></p>
        </div>
    `;
}

function sendWA() {
    const ind = session.ai.indicators;
    const msg = `تقرير بشرتي: النوع ${ind.type}، النضارة ${Math.round(ind.glow)}%`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`);
}

function savePDF() {
    html2pdf().from(document.getElementById('report')).save('Verona-Report.pdf');
}
