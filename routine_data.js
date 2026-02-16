function performDiagnosis() {
    if(!lastResults || !lastResults.multiFaceLandmarks) return alert("يرجى التقاط وجه واضح أولاً");

    const landmarks = lastResults.multiFaceLandmarks[0];

    function checkArea(lm){
        const x = Math.floor(lm.x * canvasElement.width);
        const y = Math.floor(lm.y * canvasElement.height);
        const pixel = canvasCtx.getImageData(x,y,1,1).data;
        return (pixel[0]+pixel[1]+pixel[2])/3;
    }

    const forehead = checkArea(landmarks[10]);
    const cheek = checkArea(landmarks[205]);
    const eye = (checkArea(landmarks[130]) + checkArea(landmarks[350]))/2;

    const pigmentDiff = cheek/forehead;
    const eyeDiff = eye/forehead;

    let type = 'ideal';
    if(eyeDiff<0.85) type = 'dark_circles';
    else if(pigmentDiff<0.90) type = 'pigmentation';

    const res = getDetailedRoutine(type);

    document.getElementById('resultCard').classList.remove('hidden');
    document.getElementById('resTitle').innerText = res.title;
    document.getElementById('resDetails').innerText = res.desc;
    document.getElementById('scoreBox').innerText = `درجة الصحة: ${res.score}%`;
    document.getElementById('routineBox').innerHTML = res.routineHTML;
}

function getDetailedRoutine(type){
    // مثال روتين تفصيلي مع كل مرحلة ومنتجات
    let title = "بشرة مثالية ✅";
    let desc = "توزيع الصبغات متناسق جداً وبشرتك صافية.";
    let score = 98;

    let routines = {
        'ideal': {
            'اقتصادي': [
                {name:"Garnier Skin Active", active:"Vitamin C + Niacinamide", duration:"2 أسابيع", improvement:"تحسن بسيط"},
                {name:"Sunscreen SPF50", active:"حماية", duration:"يومي", improvement:"حماية أساسية"}
            ],
            'سوبر': [
                {name:"Cleo Radiance Booster", active:"Alpha Arbutin + Vitamin C", duration:"3 أسابيع", improvement:"تفتيح متوسط"},
                {name:"Sunscreen SPF50", active:"حماية", duration:"يومي", improvement:"حماية ممتازة"}
            ],
            'الترا': [
                {name:"Nano Treat 24K Gold Serum", active:"Vitamin C + E + Gold + HA", duration:"4 أسابيع", improvement:"تفتيح ومرونة عالية"},
                {name:"Collagrea SPF50", active:"حماية + تفتيح", duration:"يومي", improvement:"حماية متكاملة"}
            ]
        },
        'dark_circles': {
            'اقتصادي': [
                {name:"Caffeine Eye Cream", active:"كافيين", duration:"يومي", improvement:"تقليل بسيط للهالات"},
                {name:"Sunscreen SPF50", active:"حماية", duration:"يومي", improvement:"حماية أساسية"}
            ],
            'سوبر': [
                {name:"Vitamin C + Peptides Serum", active:"فيتامين C + ببتيدات", duration:"3 أسابيع", improvement:"تقليل واضح للهالات"},
                {name:"Sunscreen SPF50", active:"حماية", duration:"يومي", improvement:"حماية ممتازة"}
            ],
            'الترا': [
                {name:"XQ Pharma Eye Serum", active:"Alpha Arbutin + Tranexamic + C + Niacinamide", duration:"4 أسابيع", improvement:"تقليل كامل للهالات"},
                {name:"Collagrea SPF50", active:"حماية + تفتيح", duration:"يومي", improvement:"حماية متكاملة"}
            ]
        },
        'pigmentation': {
            'اقتصادي': [
                {name:"Garnier Skin Active", active:"Vitamin C + Niacinamide", duration:"2 أسابيع", improvement:"تحسن بسيط"},
                {name:"Sunscreen SPF50", active:"حماية", duration:"يومي", improvement:"حماية أساسية"}
            ],
            'سوبر': [
                {name:"Cleo Radiance Booster", active:"Alpha Arbutin + Vitamin C", duration:"3 أسابيع", improvement:"تفتيح متوسط"},
                {name:"Sunscreen SPF50", active:"حماية", duration:"يومي", improvement:"حماية ممتازة"}
            ],
            'الترا': [
                {name:"Nano Treat 24K Gold Serum", active:"Vitamin C + E + Gold + HA", duration:"4 أسابيع", improvement:"تفتيح ومرونة عالية"},
                {name:"Collagrea SPF50", active:"حماية + تفتيح", duration:"يومي", improvement:"حماية متكاملة"}
            ]
        }
    };

    // بناء HTML
    let routineHTML = '';
    for(const level in routines[type]){
        routineHTML += `<h4>${level}:</h4><ul>`;
        routines[type][level].forEach(p=>{
            routineHTML += `<li><b>${p.name}</b> | المكونات: ${p.active} | المدة: ${p.duration} | التحسن: ${p.improvement}</li>`;
        });
        routineHTML += '</ul>';
    }

    return {title, desc, score, routineHTML};
}
