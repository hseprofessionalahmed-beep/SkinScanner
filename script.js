// الأسئلة التتابعية بعد التحليل
let analysisData={};

function performDiagnosis(){
    if(!lastResults || !lastResults.multiFaceLandmarks){
        return alert("يرجى التقاط وجه واضح أولاً");
    }
    // استدعاء الأسئلة التتابعية
    showQuestions();
}

function showQuestions(){
    const qDiv=document.getElementById('questions');
    qDiv.classList.remove('hidden');
    qDiv.innerHTML=`<div class="card">
        <p>أين توجد التصبغات؟</p>
        <button onclick="answerPigment('جبهة')">جبهة</button>
        <button onclick="answerPigment('خدود')">خدود</button>
        <button onclick="answerPigment('تحت العين')">تحت العين</button>
        <button onclick="answerPigment('مجموع')">مجموع الوجه</button>
    </div>`;
}

function answerPigment(location){
    analysisData.pigmentLocation=location;
    showDepthQuestion();
}

function showDepthQuestion(){
    const qDiv=document.getElementById('questions');
    qDiv.innerHTML=`<div class="card">
        <p>عمق التصبغ؟</p>
        <button onclick="answerDepth('خفيف')">خفيف</button>
        <button onclick="answerDepth('متوسط')">متوسط</button>
        <button onclick="answerDepth('عميق')">عميق</button>
    </div>`;
}

function answerDepth(depth){
    analysisData.pigmentDepth=depth;
    showHaloQuestion();
}

function showHaloQuestion(){
    const qDiv=document.getElementById('questions');
    qDiv.innerHTML=`<div class="card">
        <p>لون الهالات السوداء؟</p>
        <button onclick="answerHalo('أزرق')">أزرق</button>
        <button onclick="answerHalo('بني')">بني</button>
        <button onclick="answerHalo('رمادي')">رمادي</button>
        <button onclick="answerHalo('لا يوجد')">لا يوجد</button>
    </div>`;
}

function answerHalo(color){
    analysisData.haloColor=color;
    showSkinGoal();
}

function showSkinGoal(){
    const qDiv=document.getElementById('questions');
    qDiv.innerHTML=`<div class="card">
        <p>هل تريد تفتيح شامل وتوحيد لون؟</p>
        <button onclick="answerGoal(true)">نعم</button>
        <button onclick="answerGoal(false)">لا</button>
    </div>`;
}

function answerGoal(goal){
    analysisData.skinGoal=goal;
    finalizeRoutine();
}

function finalizeRoutine(){
    document.getElementById('questions').classList.add('hidden');
    let routineHTML="";
    // نحدد الروتين حسب هدف البشرة
    let selectedRoutine = routines.ultra; // افتراضياً
    if(!analysisData.skinGoal) selectedRoutine = routines.economic;

    routineHTML+=`<h4>${selectedRoutine.name} - ${selectedRoutine.description}</h4>\n`;
    selectedRoutine.products.forEach(p=>{
        routineHTML+=`• ${p.name} (${p.actives.join(', ')}): ${p.why} [مدة الاستخدام: ${p.duration}]\n`;
    });
    routineHTML+=`\nتحسن متوقع: ${selectedRoutine.expectedImprovement}`;

    document.getElementById('resultCard').classList.remove('hidden');
    document.getElementById('resTitle').innerText="روتين مخصص لبشرتك";
    document.getElementById('resDetails').innerText=`التصبغات: ${analysisData.pigmentLocation} - العمق: ${analysisData.pigmentDepth} - الهالات: ${analysisData.haloColor}`;
    document.getElementById('routineOutput').innerText=routineHTML;
}

function sendToWA(){
    const text = document.getElementById('routineOutput').innerText;
    window.open(`https://wa.me/201063994139?text=${encodeURIComponent(text)}`);
}
