console.log("Face scan engine loaded.");

const videoElement = document.getElementById('input_video');
const canvasElement = document.getElementById('overlay');
const canvasCtx = canvasElement.getContext('2d', {willReadFrequently: true});
let faceMesh, detectedLandmarks=null, currentImg=null;

// ===================================
// 1. تهيئة Face Mesh
// ===================================
async function setupFaceMesh() {
    faceMesh = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });
    faceMesh.setOptions({ maxNumFaces:1, refineLandmarks:true, minDetectionConfidence:0.5 });
    faceMesh.onResults(onResults);
    document.getElementById('status').innerText = "المحرك جاهز للفحص ✅";
}
setupFaceMesh();

function onResults(results) {
    detectedLandmarks = results.multiFaceLandmarks ? results.multiFaceLandmarks[0] : null;

    canvasElement.width = canvasElement.clientWidth;
    canvasElement.height = (currentImg) ? (currentImg.height * (canvasElement.width/currentImg.width)) : videoElement.videoHeight * (canvasElement.width/videoElement.videoWidth);

    canvasCtx.save();
    canvasCtx.clearRect(0,0,canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image,0,0,canvasElement.width, canvasElement.height);

    if(detectedLandmarks){
        drawConnectors(canvasCtx, detectedLandmarks, FACEMESH_TESSELATION, {color:'#d4af3744', lineWidth:0.5});
    }
    canvasCtx.restore();
}

// ===================================
// 2. الكاميرا والصورة
// ===================================
async function initCamera() {
    currentImg=null;
    videoElement.classList.remove('hidden');
    const camera = new Camera(videoElement,{
        onFrame: async ()=> { await faceMesh.send({image:videoElement}); }
    });
    camera.start();
}

function processFile(event) {
    const file=event.target.files[0];
    if(!file) return;
    const img=new Image();
    img.onload=async ()=>{
        currentImg=img;
        videoElement.classList.add('hidden');
        await faceMesh.send({image:img});
    };
    img.src = URL.createObjectURL(file);
}

// ===================================
// 3. تحليل النتائج + خريطة حرارية + روتين
// ===================================
function performDiagnosis() {

    if (!detectedLandmarks) {
        return alert("يرجى التقاط وجه واضح أولاً");
    }

    canvasCtx.clearRect(0,0,canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(currentImg || videoElement,0,0,canvasElement.width, canvasElement.height);

    function sampleArea(lm, size = 6) {
        const x = Math.floor(lm.x * canvasElement.width);
        const y = Math.floor(lm.y * canvasElement.height);
        let values = [], totalR=0,totalG=0,totalB=0,pixels=0;
        for(let dx=-size;dx<=size;dx++){
            for(let dy=-size;dy<=size;dy++){
                const px=x+dx, py=y+dy;
                if(px<0||py<0||px>=canvasElement.width||py>=canvasElement.height) continue;
                const data=canvasCtx.getImageData(px,py,1,1).data;
                const brightness=(data[0]+data[1]+data[2])/3;
                values.push(brightness);
                totalR+=data[0]; totalG+=data[1]; totalB+=data[2]; pixels++;
            }
        }
        const mean=values.reduce((a,b)=>a+b,0)/values.length;
        const variance=values.reduce((a,b)=>a+Math.pow(b-mean,2),0)/values.length;
        return {r:totalR/pixels,g:totalG/pixels,b:totalB/pixels,brightness:mean,variance:variance, x:lm.x, y:lm.y};
    }

    const forehead=sampleArea(detectedLandmarks[10]);
    const cheekLeft=sampleArea(detectedLandmarks[205]);
    const cheekRight=sampleArea(detectedLandmarks[425]);
    const underEyeLeft=sampleArea(detectedLandmarks[130]);
    const underEyeRight=sampleArea(detectedLandmarks[359]);
    const upperForehead=sampleArea(detectedLandmarks[151]);

    let issues=[], totalPenalty=0;

    // الهالات
    const eyeBrightness=(underEyeLeft.brightness+underEyeRight.brightness)/2;
    const eyeRatio=eyeBrightness/forehead.brightness;
    if(eyeRatio<0.9){
        let severity=Math.min(Math.round((0.9-eyeRatio)*200),100);
        issues.push({text:`هالات سوداء (${severity}%)`,x:underEyeLeft.x,y:underEyeLeft.y,score:severity});
        totalPenalty+=severity*0.4;
    }

    // تصبغات الخدود
    const cheekRG=(cheekLeft.r/cheekLeft.g+cheekRight.r/cheekRight.g)/2;
    const foreheadRG=forehead.r/forehead.g;
    const pigmentDiff=Math.abs(cheekRG-foreheadRG);
    if(pigmentDiff>0.03){
        let severity=Math.min(Math.round(pigmentDiff*400),100);
        issues.push({text:`تصبغات لونية (${severity}%)`,x:cheekLeft.x,y:cheekLeft.y,score:severity});
        totalPenalty+=severity*0.3;
    }

    // نمش
    const varianceAvg=(cheekLeft.variance+cheekRight.variance)/2;
    if(varianceAvg>120){
        let severity=Math.min(Math.round((varianceAvg-120)/3),100);
        issues.push({text:`نمش / بقع دقيقة (${severity}%)`,x:cheekLeft.x,y:cheekLeft.y,score:severity});
        totalPenalty+=severity*0.3;
    }

    // تصبغ الجبهة
    const upperRatio=upperForehead.brightness/forehead.brightness;
    if(upperRatio<0.93){
        let severity=Math.min(Math.round((0.93-upperRatio)*200),100);
        issues.push({text:`تصبغ الجبهة (${severity}%)`,x:upperForehead.x,y:upperForehead.y,score:severity});
        totalPenalty+=severity*0.25;
    }

    // رسم الخريطة الحرارية + دوائر
    issues.forEach(issue=>{
        const radius=20 + issue.score/5;
        canvasCtx.beginPath();
        canvasCtx.arc(issue.x*canvasElement.width, issue.y*canvasElement.height, radius,0,2*Math.PI);
        canvasCtx.fillStyle=`rgba(255,0,0,${issue.score/100})`;
        canvasCtx.fill();
        canvasCtx.strokeStyle='#fff';
        canvasCtx.lineWidth=2;
        canvasCtx.stroke();
    });

    // النتيجة + روتين
    let score=Math.max(100-totalPenalty,50);
    score=Math.round(score);
    let title="بشرة متوازنة ✅";
    let desc="لم يتم رصد مشاكل واضحة";
    let routine="روتين يومي أساسي";

    if(issues.length>0){
        title="تم رصد بعض الملاحظات 🔎";
        desc=issues.map(i=>i.text).join(" | ");
        routine="";
        issues.forEach(i=>{
            if(i.text.includes("هالات")){
                routine+="كريم هالات + سيروم الكافيين\n";
            }
            if(i.text.includes("تصبغات")){
                routine+="سيروم فيتامين C + واقي شمس SPF50\n";
            }
            if(i.text.includes("نمش")){
                routine+="تقشير خفيف 2-3 مرات أسبوعياً + ترطيب يومي\n";
            }
        });
    }

    document.getElementById('resultCard').classList.remove('hidden');
    document.getElementById('resTitle').innerText=title;
    document.getElementById('resDetails').innerText=desc;
    document.getElementById('scoreBox').innerText="درجة صحة البشرة: "+score+"%\n"+routine;
}

// ===================================
// إرسال واتساب
// ===================================
function sendToWA() {
    const text = `تقرير فيرونا AI: ${document.getElementById('resTitle').innerText}\n${document.getElementById('resDetails').innerText}\n${document.getElementById('scoreBox').innerText}`;
    window.open(`https://wa.me/201063994139?text=${encodeURIComponent(text)}`);
}
