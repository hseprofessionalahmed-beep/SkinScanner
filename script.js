let scanData = {};

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const captureBtn = document.getElementById("captureBtn");

function chooseMode(mode){
  if(mode==="camera"){
    document.getElementById("fileUpload").classList.add("hidden");
    video.classList.remove("hidden");
    captureBtn.classList.remove("hidden");

    navigator.mediaDevices.getUserMedia({video:true})
    .then(stream => video.srcObject = stream);
  }else{
    video.classList.add("hidden");
    captureBtn.classList.add("hidden");
    document.getElementById("fileUpload").classList.remove("hidden");
  }
}

captureBtn.onclick = function(){
  canvas.classList.remove("hidden");
  const ctx = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video,0,0);
  analyzeImage();
};

document.getElementById("imageInput").addEventListener("change", function(){
  const file = this.files[0];
  if(!file) return;
  const img = new Image();
  img.src = URL.createObjectURL(file);
  img.onload = function(){
    canvas.classList.remove("hidden");
    const ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img,0,0);
    analyzeImage();
  }
});

function analyzeImage(){
  const ctx = canvas.getContext("2d");
  const imageData = ctx.getImageData(0,0,canvas.width,canvas.height).data;

  let brightness=0, redAvg=0;

  for(let i=0;i<imageData.length;i+=4){
    brightness += (imageData[i]+imageData[i+1]+imageData[i+2])/3;
    redAvg += imageData[i];
  }

  brightness /= (imageData.length/4);
  redAvg /= (imageData.length/4);

  scanData.acne = redAvg>150;
  scanData.pigmentation = brightness<110;
  scanData.dryness = brightness>180;

  showAnalysis();
}

function showAnalysis(){
  const div = document.getElementById("analysisResult");
  div.classList.remove("hidden");

  div.innerText =
  "نتيجة التحليل:\n\n"+
  "حبوب/التهاب: "+(scanData.acne?"محتمل":"منخفض")+"\n"+
  "تصبغات: "+(scanData.pigmentation?"محتملة":"خفيفة")+"\n"+
  "جفاف: "+(scanData.dryness?"محتمل":"طبيعي")+"\n";

  showLevelSelection();
}

function showLevelSelection(){
  const levelDiv = document.getElementById("levelSelect");
  levelDiv.classList.remove("hidden");

  levelDiv.innerHTML = `
  <h3>اختر مستوى الروتين</h3>
  <button onclick="buildRoutine('eco')">اقتصادي</button>
  <button onclick="buildRoutine('super')">سوبر</button>
  <button onclick="buildRoutine('ultra')">ألترا</button>
  `;
}
