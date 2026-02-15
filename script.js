let scanData = {};
let myChart = null;

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const captureBtn = document.getElementById("captureBtn");

function chooseMode(mode) {
    if (mode === "camera") {
        video.classList.remove("hidden");
        captureBtn.classList.remove("hidden");
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } }).then(s => video.srcObject = s);
    }
}

document.getElementById("imageInput").onchange = (e) => {
    const img = new Image();
    img.src = URL.createObjectURL(e.target.files[0]);
    img.onload = () => {
        const ctx = canvas.getContext("2d");
        canvas.width = 400; canvas.height = 400;
        ctx.drawImage(img, 0, 0, 400, 400);
        analyzeImage();
    };
};

captureBtn.onclick = () => {
    const ctx = canvas.getContext("2d");
    canvas.width = 400; canvas.height = 400;
    ctx.drawImage(video, 0, 0, 400, 400);
    analyzeImage();
};

async function analyzeImage() {
    document.getElementById("loading").classList.remove("hidden");
    await new Promise(r => setTimeout(r, 2000));
    
    const ctx = canvas.getContext("2d");
    const data = ctx.getImageData(0,0,400,400).data;
    let rSum=0, gSum=0, bSum=0, darks=0;

    for(let i=0; i<data.length; i+=4) {
        rSum+=data[i]; gSum+=data[i+1]; bSum+=data[i+2];
        if((data[i]+data[i+1]+data[i+2])/3 < 100 && data[i] > data[i+2]+15) darks++;
    }

    const total = data.length/4;
    scanData.acne = (rSum/total) > 155;
    scanData.pigment = (darks/total)*100 > 2.5;
    scanData.score = 95 - (scanData.acne?15:0) - (scanData.pigment?10:0);

    document.getElementById("loading").classList.add("hidden");
    showResults();
}

function showResults() {
    document.getElementById("analysisResult").classList.remove("hidden");
    document.getElementById("skinScore").innerText = scanData.score;
    document.getElementById("analysisText").innerHTML = `
        <p>• الالتهاب: ${scanData.acne?'محتمل':'هادئ ✅'}</p>
        <p>• التصبغات: ${scanData.pigment?'مكتشفة':'صافي ✅'}</p>
    `;
    initChart();
    document.getElementById("levelSelect").classList.remove("hidden");
}

function initChart() {
    const ctx = document.getElementById('skinChart').getContext('2d');
    if (myChart) myChart.destroy();
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['اليوم', 'أسبوع 2', 'أسبوع 4'],
            datasets: [{ label: '% التحسن', data: [scanData.score, scanData.score+10, 98], borderColor: '#d4af37', tension: 0.4 }]
        },
        options: { plugins: { legend: { display: false } } }
    });
}
