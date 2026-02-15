// 1. قاعدة البيانات المدمجة
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

// 2. تشغيل الكاميرا عند تحميل الصفحة
async function init() {
    const video = document.getElementById('video');
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "user" } 
        });
        video.srcObject = stream;
    } catch (e) { 
        console.error("الكاميرا لم تفتح:", e);
    }
}
init();

// 3. مستمعات الأحداث (الأزرار)
document.getElementById('scanBtn').onclick = () => {
    const video = document.getElementById('video');
    process(video);
};

document.getElementById('imageUpload').onchange = async (e) => {
    if (e.target.files && e.target.files[0]) {
        try {
            const img = await faceapi.bufferToImage(e.target.files[0]);
            process(img);
        } catch (err) {
            alert("خطأ في قراءة الصورة، يرجى تجربة صورة أخرى.");
        }
    }
};

// 4. دالة المعالجة الرئيسية
async function process(src) {
    const loader = document.getElementById('loading-overlay');
    loader.style.display = 'flex';
    loader.innerText = "جاري تحليل تفاصيل البشرة...";
    
    // إعطاء مهلة للمحرك للبدء
    setTimeout(async () => {
        try {
            const result = await analyzeSkin(src);
            loader.style.display = 'none';
            
            if (result) {
                sessionData.ai = result;
                renderReport();
            } else {
                alert("⚠️ لم يتم التعرف على الوجه.\n- تأكد من أن الوجه قريب وواضح.\n- يرجى توفير إضاءة جيدة.");
            }
        } catch (err) {
            loader.style.display = 'none';
            console.error("خطأ أثناء التحليل:", err);
            alert("حدث خطأ تقني، يرجى تحديث الصفحة.");
        }
    }, 600);
}

// 5. دالة بناء التقرير
function renderReport() {
    const res = document.getElementById('results');
    res.style.display = 'block';
    const ind = sessionData.ai.indicators;
    
    res.innerHTML = `
        <div class="report-card" id="pdf-content" style="background:#fff; padding:20px; border-radius:20px; text-align:right;">
            <h2 style="text-align:center; border-bottom:2px solid #000; padding-bottom:10px;">تقرير VERONA AI للبشرة</h2>
            <div class="stats-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:20px;">
                <div class="stat" style="background:#f9f9f9; padding:10px; border-radius:10px;"><span>نوع البشرة:</span><strong>${skinTypeData[ind.type].name}</strong></div>
                <div class="stat" style="background:#f9f9f9; padding:10px; border-radius:10px;"><span>العمر التقديري:</span><strong>${ind.skinAge} سنة</strong></div>
                <div class="stat" style="background:#f9f9f9; padding:10px; border-radius:10px;"><span>النضارة:</span><strong>${Math.round(ind.glow)}%</strong></div>
                <div class="stat" style="background:#f9f9f9; padding:10px; border-radius:10px;"><span>الترطيب:</span><strong>${Math.round(ind.hydration)}%</strong></div>
            </div>
            
            <div class="level-selector" style="display:flex; gap:5px; margin:20px 0;">
                <button onclick="changeLevel('budget')" id="btn-budget" style="flex:1; padding:10px; cursor:pointer;">اقتصادي</button>
                <button onclick="changeLevel('super')" id="btn-super" class="active" style="flex:1; padding:10px; cursor:pointer;">سوبر</button>
                <button onclick="changeLevel('premium')" id="btn-premium" style="flex:1; padding:10px; cursor:pointer;">بريميوم</button>
            </div>

            <div id="routine-box"></div>
        </div>
        
        <button onclick="sendWhatsApp()" class="wa-btn" style="width:100%; padding:15px; background:#25d366; color:#fff; border-radius:50px; border:none; margin-top:10px; font-weight:bold; cursor:pointer;">إرسال للواتساب ✅</button>
        <button onclick="downloadPDF()" class="pdf-btn" style="width:100%; margin-top:10px; padding:10px; background:#444; color:#fff; border:none; border-radius:10px; cursor:pointer;">تحميل كملف PDF 📄</button>
    `;
    updateRoutine();
    res.scrollIntoView({ behavior: 'smooth' });
}

// 6. التحكم في مستويات المنتجات
function changeLevel(lvl) {
    sessionData.level = lvl;
    document.querySelectorAll('.level-selector button').forEach(b => {
        b.style.background = "#fff";
        b.style.color = "#000";
    });
    const activeBtn = document.getElementById('btn-' + lvl);
    activeBtn.style.background = "#000";
    activeBtn.style.color = "#fff";
    updateRoutine();
}

function updateRoutine() {
    const ind = sessionData.ai.indicators;
    // تحديد الحالة بناءً على النتائج المكتشفة
    let key = ind.acne ? 'acne' : (ind.pigment ? 'pigment' : 'clear');
    const data = expertDatabase[key];
    const product = data.products[sessionData.level];

    document.getElementById('routine-box').innerHTML = `
        <div class="routine-info" style="border-top:1px solid #eee; padding-top:15px;">
            <h4 style="color:#c5a059; margin:5px 0;">الحالة المكتشفة: ${data.title}</h4>
            <p style="font-size:0.9rem; margin:5px 0;"><strong>المادة الموصى بها:</strong> ${data.active}</p>
            <div style="background:#f1f1f1; padding:15px; border-right:5px solid #000; margin-top:10px;">
                المنتج المقترح لمستوى (${sessionData.level}):<br>
                <strong style="font-size:1.1rem;">${product}</strong>
            </div>
        </div>
    `;
}

// 7. وظائف التصدير (واتساب و PDF)
function sendWhatsApp() {
    const ind = sessionData.ai.indicators;
    let key = ind.acne ? 'acne' : (ind.pigment ? 'pigment' : 'clear');
    const data = expertDatabase[key];
    const product = data.products[sessionData.level];

    const text = `*تقرير فيرونا الذكي للبشرة*%0A%0A` +
                 `👤 النوع: ${skinTypeData[ind.type].name}%0A` +
                 `⏳ العمر: ${ind.skinAge} سنة%0A` +
                 `🌟 النضارة: ${Math.round(ind.glow)}%25%0A` +
                 `🎯 التشخيص: ${data.title}%0A` +
                 `🛍️ المنتج: ${product}`;
    
    window.open(`https://wa.me/?text=${text}`, '_blank');
}

function downloadPDF() {
    const element = document.getElementById('pdf-content');
    const opt = {
        margin: 10,
        filename: 'Verona-Skin-Report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
}
