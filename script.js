console.log("Script engine loaded.");

// بدء الأسئلة التتابعية بعد التحليل
function startQuestionnaire(){
    if(!lastResults || !lastResults.multiFaceLandmarks){
        alert("يرجى التقاط وجه واضح أولاً");
        return;
    }

    const q = document.getElementById('questions');
    q.classList.remove('hidden');
    q.innerHTML=`
        <div class="card">
            <p>هل لديك حبوب؟</p>
            <button onclick="answerAcne(true)">نعم</button>
            <button onclick="answerAcne(false)">لا</button>
        </div>
    `;
}

function answerAcne(hasAcne){
    const q = document.getElementById('questions');
    if(!hasAcne){
        buildRoutine({acne:false});
        return;
    }
    q.innerHTML=`
        <div class="card">
            <p>نوع الحبوب؟</p>
            <button onclick="buildRoutine({acne:true,type:'inflamed'})">ملتهبة</button>
            <button onclick="buildRoutine({acne:true,type:'comedonal'})">غير ملتهبة</button>
        </div>
    `;
}

function buildRoutine(data){
    const r = document.getElementById('resultCard');
    r.classList.remove('hidden');

    let routine = `
🧴 الترطيب:
- Vitamin C
- Hyaluronic Acid

🌟 التفتيح وتوحيد اللون:
- Alpha Arbutin
- Niacinamide

☀️ الحماية:
- Sunscreen SPF50
`;

    if(data.acne){
        routine += `
🔥 دعم الحبوب:
- Salicylic Acid
- Azelaic Acid
`;
    }

    document.getElementById('resTitle').innerText="الروتين النهائي لبشرتك";
    document.getElementById('resDetails').innerText=routine;
    document.getElementById('scoreBox').innerText="مدة التحسن المتوقعة: 4-6 أسابيع";
}

function sendToWA(){
    const text = `تقرير فيرونا AI: ${document.getElementById('resTitle').innerText}`;
    window.open(`https://wa.me/201063994139?text=${text}`);
}
