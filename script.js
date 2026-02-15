let scanResult = {};

function startScan() {
  const file = document.getElementById("imageInput").files[0];
  if (!file) {
    alert("❗ رفع صورة إلزامي");
    return;
  }

  const img = new Image();
  img.src = URL.createObjectURL(file);

  img.onload = () => {
    scanResult = analyzeFace(img);
    startQuestions();
  };
}

function startQuestions() {
  const q = document.getElementById("questions");
  q.classList.remove("hidden");

  q.innerHTML = `
    <div class="card">
      <p>هل لديك حبوب؟</p>
      <button onclick="answerAcne(true)">نعم</button>
      <button onclick="answerAcne(false)">لا</button>
    </div>
  `;
}

function answerAcne(hasAcne) {
  const q = document.getElementById("questions");

  if (!hasAcne) {
    buildRoutine({ acne: false });
    return;
  }

  q.innerHTML = `
    <div class="card">
      <p>نوع الحبوب؟</p>
      <button onclick="buildRoutine({acne:true,type:'inflamed'})">ملتهبة</button>
      <button onclick="buildRoutine({acne:true,type:'comedonal'})">غير ملتهبة</button>
    </div>
  `;
}
