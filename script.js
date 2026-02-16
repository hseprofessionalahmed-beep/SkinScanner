// ==========================
// أسئلة تتابعية بعد الاسكان
// ==========================
const userSkinData = {};

function startQuestionnaire() {
  document.getElementById('questions').classList.remove('hidden');
  askPigmentLocation();
}

function askPigmentLocation() {
  const qDiv = document.getElementById('questions');
  qDiv.innerHTML = `
    <h3>أين توجد التصبغات على وجهك؟</h3>
    <button onclick="nextQuestion('cheeks')">خدود</button>
    <button onclick="nextQuestion('forehead')">جبهة</button>
    <button onclick="nextQuestion('under_eyes')">تحت العين</button>
    <button onclick="nextQuestion('all')">أخرى / عامة</button>
  `;
}

function nextQuestion(area) {
  if(!userSkinData.pigmentAreas) userSkinData.pigmentAreas = [];
  userSkinData.pigmentAreas.push(area);
  askPigmentDepth();
}

function askPigmentDepth() {
  const qDiv = document.getElementById('questions');
  qDiv.innerHTML = `
    <h3>ما عمق التصبغ؟</h3>
    <button onclick="nextDepth('light')">خفيف</button>
    <button onclick="nextDepth('medium')">متوسط</button>
    <button onclick="nextDepth('deep')">شديد</button>
  `;
}

function nextDepth(depth) {
  userSkinData.pigmentDepth = depth;
  askDarkCircleColor();
}

function askDarkCircleColor() {
  const qDiv = document.getElementById('questions');
  qDiv.innerHTML = `
    <h3>لون الهالات؟</h3>
    <button onclick="nextDarkCircle('blue')">أزرق</button>
    <button onclick="nextDarkCircle('brown')">بني</button>
    <button onclick="nextDarkCircle('grey')">رمادي</button>
  `;
}

function nextDarkCircle(color) {
  userSkinData.darkCirclesColor = color;
  askSkinType();
}

function askSkinType() {
  const qDiv = document.getElementById('questions');
  qDiv.innerHTML = `
    <h3>نوع البشرة؟</h3>
    <button onclick="nextSkinType('dry')">جافة</button>
    <button onclick="nextSkinType('oily')">دهنية</button>
    <button onclick="nextSkinType('mixed')">مختلطة</button>
    <button onclick="nextSkinType('sensitive')">حساسة</button>
  `;
}

function nextSkinType(type) {
  userSkinData.skinType = type;
  askGlowPreference();
}

function askGlowPreference() {
  const qDiv = document.getElementById('questions');
  qDiv.innerHTML = `
    <h3>هل ترغب بنضارة شاملة؟</h3>
    <button onclick="finishQuestionnaire(true)">نعم</button>
    <button onclick="finishQuestionnaire(false)">لا</button>
  `;
}

function finishQuestionnaire(wantsGlow) {
  userSkinData.wantsGlow = wantsGlow;
  document.getElementById('questions').classList.add('hidden');
  showRoutine();
}

// ==========================
// استخراج الروتين الكامل
// ==========================
function showRoutine() {
  const resultDiv = document.getElementById('resultCard');
  resultDiv.classList.remove('hidden');

  let html = `<h3 class="gold">الروتين المخصص لك</h3>`;
  
  // مثال بسيط للمنتجات حسب المستوى
  const routines = {
    economical: {
      improvement: 60,
      products: [
        {name:"Garniere Fast Bright", active:"Vitamin C + Niacinamide", reason:"تفتيح وتوحيد اللون", duration:"يومي صباحاً"}
      ]
    },
    super: {
      improvement: 80,
      products: [
        {name:"Nano Treat 24K Gold", active:"C + E + Gold + Collagen", reason:"ترطيب + تفتيح + مرونة البشرة", duration:"يومي صباحاً"}
      ]
    },
    ultra: {
      improvement: 95,
      products: [
        {name:"Derwois Whitening Cream", active:"Alpha Arbutin + Vitamin C + Hyaluronic Acid", reason:"تفتيح عميق + توحيد اللون + حماية من البيئة", duration:"يومي صباحاً ومساءً"}
      ]
    }
  };

  for (let level in routines) {
    html += `<h4>${level.toUpperCase()} (تحسن متوقع: ${routines[level].improvement}%)</h4><ul>`;
    routines[level].products.forEach(p => {
      html += `<li><b>${p.name}</b>: ${p.active} → ${p.reason} / ${p.duration}</li>`;
    });
    html += `</ul>`;
  }

  resultDiv.innerHTML = html;
}
