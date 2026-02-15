const skinTypeData = {
    oily: { name: "دهنية", label: "نشاط دهني ملحوظ" },
    dry: { name: "جافة", label: "نقص في الترطيب الطبيعي" },
    normal: { name: "عادية", label: "توازن مثالي" }
};

const expertDatabase = {
    acne: { 
        title: "بشرة معرضة للحبوب", 
        active: "Salicylic Acid", 
        products: { 
            budget: "صابونة ستارفيل (Starville Acne Soap)", 
            super: "سيروم ستارفيل (Starville Acne Serum)", 
            premium: "إيفاكلار ديو (Effaclar Duo+)" 
        } 
    },
    pigment: { 
        title: "تصبغات ونمش", 
        active: "Vitamin C + Arbutin", 
        products: { 
            budget: "جارنييه فاست برايت (Garnier Bright)", 
            super: "سيروم ناتافيس (Natavis Whitening)", 
            premium: "سيروم فيشي سي 10 (Vichy Liftactiv C10)" 
        } 
    },
    clear: { 
        title: "بشرة صافية (للحماية)", 
        active: "Hyaluronic Acid", 
        products: { 
            budget: "إيفا سكين كير (Eva Skin Clinic)", 
            super: "لوريال ريفيتاليفت (L'Oreal Hyaluronic)", 
            premium: "فيشي مينرال 89 (Vichy Mineral 89)" 
        } 
    }
};

let sessionData = { ai: null, level: 'super' };

// تشغيل الكاميرا
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
    loader.innerText = "جاري التحليل الرقمي...";
    
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
            <h2 class="report-head">تقرير VERONA للذكاء الاصطناعي</h2>
            <div class="stats-grid">
                <div class="stat"><span>النوع</span><strong>${skinTypeData[ind.type].name}</strong></div>
                <div class="stat"><span>العمر التقديري</span><strong>${ind.skinAge} سنة</strong></div>
                <div class="stat"><span>النضارة</span><strong>${Math.round(ind.glow)}%</strong></div>
                <div class="stat)<span>الترطيب</span><strong>${Math.round(ind.hydration)}%</strong></div>
            </div>
            
            <div class="level-selector">
                <button onclick="changeLevel('budget')" id="btn-budget">اقتصادي</button>
                <button onclick="changeLevel('super')" id="btn-super" class="active">سوبر</button>
                <button onclick="changeLevel('premium')" id="btn-premium">بريميوم</button>
            </div>

            <div id="routine-box"></div>
        </div>
        <button onclick="sendWhatsApp()" class="wa-btn">إرسال التقرير عبر الواتساب ✅</button>
        <button onclick="downloadPDF()" class="pdf-btn">تحميل التقرير PDF 📄</button>
    `;
    updateRoutine();
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
        <div class="routine-info">
            <h3 style="color:#c5a059;">الهدف: ${data.title}</h3>
            <p><strong>المادة الفعالة الموصى بها:</strong> ${data.active}</p>
            <div class="product-item" style="background:#f0f0f0; padding:15px; border-radius:10px; border-right:5px solid #000;">
                <span>المنتج المرشح (${sessionData.level}):</span><br>
                <strong style="font-size:1.1rem;">${product}</strong>
            </div>
            <p style="font-size:0.8rem; margin-top:10px; color:#666;">* المرحلة الثالثة دائماً هي واقي الشمس SPF50.</p>
        </div>
    `;
}

function sendWhatsApp() {
    const ind = sessionData.ai.indicators;
    let key = ind.acne ? 'acne' : (ind.pigment ? 'pigment' : 'clear');
    const data = expertDatabase[key];
    const product = data.products[sessionData.level];

    const message = `*تقرير فحص البشرة من VERONA AI*%0A%0A` +
                    `👤 نوع البشرة: ${skinTypeData[ind.type].name}%0A` +
                    `⏳ العمر التقديري: ${ind.skinAge} سنة%0A` +
                    `🌟 النضارة: ${Math.round(ind.glow)}%25%0A` +
                    `💧 الترطيب: ${Math.round(ind.hydration)}%25%0A` +
                    `--------------------------%0A` +
                    `🎯 التشخيص: ${data.title}%0A` +
                    `🧪 المادة الفعالة: ${data.active}%0A` +
                    `🛍️ المنتج المقترح: ${product}%0A` +
                    `--------------------------%0A` +
                    `تم التحليل بواسطة ذكاء VERONA الاصطناعي.`;

    window.open(`https://wa.me/?text=${message}`, '_blank');
}

function downloadPDF() {
    const element = document.getElementById('pdf-content');
    const opt = { margin: 0.5, filename: 'Verona-Skin-Report.pdf', html2canvas: { scale: 2 } };
    html2pdf().set(opt).from(element).save();
}

