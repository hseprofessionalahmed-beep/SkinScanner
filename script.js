function performDiagnosis() {
    if (!lastResults || !lastResults.multiFaceLandmarks) return alert("يرجى التقاط وجه واضح أولاً");

    const lm = lastResults.multiFaceLandmarks[0];

    function checkArea(landmarkIndices) {
        let sum = 0;
        for (const idx of landmarkIndices) {
            const x = Math.floor(idx.x * canvasElement.width);
            const y = Math.floor(idx.y * canvasElement.height);
            const pixel = canvasCtx.getImageData(x, y, 1, 1).data;
            sum += (pixel[0]+pixel[1]+pixel[2])/3;
        }
        return sum/landmarkIndices.length;
    }

    const forehead = checkArea([10, 338, 297]);
    const cheeks = checkArea([205, 425, 431]);
    const eyes = checkArea([130, 359, 386, 159]);

    const pigmentDiff = cheeks/forehead;
    const eyeDiff = eyes/forehead;

    let res = {title:"بشرة مثالية ✅", desc:"توزيع الصبغات متناسق جداً وبشرتك صافية.", score:98, routine: "روتين كامل مبدئي"};

    if (eyeDiff < 0.85) {
        res = {title:"هالات سوداء 👁️", desc:"تم رصد تباين تحت العين. ننصح بكريمات تحتوي كافيين.", score:76, routine: buildRoutine("الهالات")};
    } else if (pigmentDiff < 0.90) {
        res = {title:"تصبغات / نمش 🔍", desc:"تم رصد بقع داكنة على الخدين. ننصح بسيروم تفتيح وواقي شمس.", score:82, routine: buildRoutine("تصبغات")};
    }

    document.getElementById('resultCard').classList.remove('hidden');
    document.getElementById('resTitle').innerText = res.title;
    document.getElementById('resDetails').innerText = res.desc;
    document.getElementById('routineBox').innerHTML = res.routine;
}
