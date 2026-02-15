// 1. قاعدة بيانات المنتجات والتشخيص
const expertDB = {
    acne: { 
        title: "بشرة معرضة للحبوب والاحمرار", 
        active: "Salicylic Acid (حمض السالسليك)", 
        products: { 
            budget: "صابونة ستارفيل (Starville Soap)", 
            super: "ستارفيل جل (Starville Acne Gel)", 
            premium: "لاروش بوزيه إيفاكلار (Effaclar Duo+)" 
        } 
    },
    pigment: { 
        title: "بشرة بها تصبغات أو نمش", 
        active: "Alpha Arbutin / Vitamin C", 
        products: { 
            budget: "غارنييه فاست برايت (Garnier)", 
            super: "ناتافيس سيروم (Natavis Whitening)", 
            premium: "سيروم فيشي (Vichy Liftactiv C10)" 
        } 
    },
    clear: { 
        title: "بشرة متوازنة (عناية وقائية)", 
        active: "Hyaluronic Acid (ترطيب عميق)", 
        products: { 
            budget: "إيفا سكين كير (Eva)", 
            super: "لوريال ريفيتاليفت (L'Oreal)", 
            premium: "فيشي مينرال 89 (Vichy 89)" 
        } 
    }
};

let session = { ai: null, level: 'super' };

// 2. تشغيل الكاميرا المباشرة
async function startCam() {
    const video = document.getElementById('video');
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        video.srcObject = stream;
    } catch(e) { 
        console.warn("الكاميرا لم تفتح، يمكنك استخدام رفع الصور."); 
    }
}
startCam();

// 3. معالجة زر الفحص الفوري (الكاميرا)
document.getElementById('scanBtn').onclick = () => {
    processImage(document.getElementById('video'));
};

// 4. معالجة رفع الصور من المعرض (الحل الجذري لصورة الطفل والنمش)
document.getElementById('imageUpload').onchange = async (e) => {
    if (!e.target.files[0]) return;
    
    const loader = document.getElementById('loading-overlay');
    loader.style.display = 'flex';
    loader.innerText = "جاري معالجة الصورة...";

    const reader = new FileReader();
    reader.onload = async (event) => {
        const img = new Image();
        img.onload = async () => {
            // إرسال الصورة للمحرك بعد التأكد من تحميلها بالكامل
            session.ai = await analyzeSkin(img);
            loader.style.display = 'none';
            if (session.ai) {
                renderResults();
            } else {
                alert("⚠️ لم يتم التعرف على الوجه في الصورة.\nيرجى التأكد أن الوجه واضح وغير مغطى.");
            }
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
};

// 5. دالة التحليل الرئيسية
async function processImage(src) {
    const loader = document.getElementById('loading-overlay');
    loader.style.display = 'flex';
    loader.innerText = "جاري التحليل الرقمي...";

    // مهلة بسيطة لضمان استقرار المحرك
    setTimeout(async () => {
        session.ai = await analyzeSkin(src);
        loader.style.display = 'none';
        if (session.ai) renderResults();
        else alert("⚠️ تعذر التعرف على الوجه. حاول في إضاءة أفضل أو قرب الكاميرا.");
    }, 600);
}

// 6. عرض النتائج والتقرير
function renderResults() {
    const res = document.getElementById('results');
    res.style.display = 'block';
    const ind = session.ai.indicators;
    
    res.innerHTML = `
        <div class="report-card" id="report-to-export" style="background:#fff; padding:20px; border-radius:15px; border:1px solid #eee;">
            <h2 style="text-align:center; color:#000;">نتائج فحص VERONA AI</h2>
            <hr>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:15px; text-align:right;">
                <div style="background:#f9f9f9; padding:10px;">النوع: <b>${ind.type}</b></div>
                <div style="background:#f9f9f9; padding:10px;">العمر: <b>${ind.age} سنة</b></div>
                <div style="background:#f9f9f9; padding:10px;">النضارة: <b>${Math.round(ind.glow)}%</b></div>
                <div style="background:#f9f9f9; padding:10px;">الترطيب: <b>${Math.round(ind.hydration)}%</b></div>
            </div>

            <div class="level-selector" style="display:flex; gap:5px; margin:20px 0;">
                <button onclick="setLevel('budget')" id="l-budget" style="flex:1; padding:8px;">اقتصادي</button>
                <button onclick="setLevel('super')" id="l-super" class="active" style="flex:1; padding:8px;">سوبر</button>
                <button onclick="setLevel('premium')" id="l-premium" style="flex:1; padding:8px;">بريميوم</button>
