const expertDB = {
    acne: {
        title: "بشرة معرضة للحبوب",
        active: "Salicylic Acid / BHA",
        levels: {
            budget: { p1: "Starville Soap", p2: "Garnier Fast Clear", p3: "Kolagra Sunscreen" },
            super: { p1: "Starville Gel", p2: "Starville Acne Serum", p3: "Starville SPF50" },
            premium: { p1: "Effaclar Gel", p2: "Effaclar Duo+", p3: "Anthelios SPF50" }
        }
    },
    pigment: {
        title: "تصبغات ونمش",
        active: "Alpha Arbutin / Vit C",
        levels: {
            budget: { p1: "Garnier Scrub", p2: "Garnier Fast Bright", p3: "Eva Sun" },
            super: { p1: "Natavis Cleanser", p2: "Natavis Arbutin Serum", p3: "Kolagra Sun" },
            premium: { p1: "Vichy Cleanser", p2: "Vichy C10 Serum", p3: "Derois Whitening" }
        }
    }
};

let session = { ai: null, answers: {}, level: 'super' };

// دالة بدء الأسئلة الذكية بعد التحليل
async function startSmartQuestions() {
    const q1 = confirm("هل تلاحظ وجود حبوب ملتهبة حالياً؟");
    session.answers.activeAcne = q1;
    const q2 = confirm("هل تزداد البقع داكنة عند التعرض للشمس؟");
    session.answers.sunSensitive = q2;
    
    renderProfessionalUI();
}

function renderProfessionalUI() {
    const resDiv = document.getElementById('results');
    resDiv.style.display = 'block';
    const ind = session.ai;
    
    // تحديد المشكلة الرئيسية بناءً على AI + الأسئلة
    let key = (ind.acne || session.answers.activeAcne) ? 'acne' : 'pigment';
    session.currentKey = key;

    resDiv.innerHTML = `
        <div class="report-container" style="background:#fff; padding:20px; border-radius:15px; border:2px solid #c5a059;">
            <h2 style="text-align:center;">تقرير VERONA الاحترافي</h2>
            
            <div class="stats-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:10px; background:#f9f9f9; padding:15px; border-radius:10px;">
                <div>النوع: <b>${ind.type === 'oily' ? 'دهنية' : 'جافة/عادية'}</b></div>
                <div>الحبوب: <b>${ind.acne ? 'مكتشفة' : 'غير موجودة'}</b></div>
                <div>التصبغات: <b>${ind.pigment ? 'موجودة' : 'لا يوجد'}</b></div>
                <div>النضارة: <b>${Math.round(ind.glow)}%</b></div>
            </div>

            <div class="tabs" style="display:flex; gap:5px; margin:20px 0;">
                <button onclick="updateLevel('budget')" id="b-btn" style="flex:1; padding:10px;">اقتصادي</button>
                <button onclick="updateLevel('super')" id="s-btn" style="flex:1; padding:10px; background:#000; color:#fff;">سوبر</button>
                <button onclick="updateLevel('premium')" id="p-btn" style="flex:1; padding:10px;">بريميوم</button>
            </div>

            <div id="routine-phases"></div>
        </div>
    `;
    updateLevel('super');
}

function updateLevel(lvl) {
    session.level = lvl;
    const data = expertDB[session.currentKey];
    const products = data.levels[lvl];
    
    document.getElementById('routine-phases').innerHTML = `
        <div style="text-align:right;">
            <h3 style="color:#c5a059;">الروتين الثلاثي المقترح:</h3>
            <div class="phase" style="margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:5px;">
                <strong>المرحلة 1: التهيئة والترطيب (7 أيام)</strong><br>
                المنتج: ${products.p1}
            </div>
            <div class="phase" style="margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:5px;">
                <strong>المرحلة 2: العلاج والتصحيح (4 أسابيع)</strong><br>
                المادة الفعالة: ${data.active}<br>
                المنتج: ${products.p2}
            </div>
            <div class="phase">
                <strong>المرحلة 3: الصيانة والحماية</strong><br>
                المنتج: ${products.p3}
            </div>
        </div>
    `;
}

// دالة المعالجة عند رفع الصورة
document.getElementById('imageUpload').onchange = (e) => {
    const file = e.target.files[0];
    const img = new Image();
    img.onload = async () => {
        const loader = document.getElementById('loading-overlay');
        loader.style.display = 'flex';
        session.ai = await analyzeSkin(img);
        loader.style.display = 'none';
        if(session.ai) startSmartQuestions();
    };
    img.src = URL.createObjectURL(file);
};
