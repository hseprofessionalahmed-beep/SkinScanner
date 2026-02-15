// محرك VERONA للتحليل الضوئي المباشر
async function analyzeSkin(source) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // تصغير الصورة لسرعة التحليل ومنع تهنيج المتصفح
    canvas.width = 100; 
    canvas.height = 100;
    ctx.drawImage(source, 0, 0, 100, 100);

    const imgData = ctx.getImageData(0, 0, 100, 100).data;
    let rSum = 0, gSum = 0, bSum = 0, redPoints = 0, darkPoints = 0;

    for (let i = 0; i < imgData.length; i += 4) {
        let r = imgData[i], g = imgData[i+1], b = imgData[i+2];
        rSum += r; gSum += g; bSum += b;

        // رصد الاحمرار (الحبوب)
        if (r > g + 40 && r > b + 40) redPoints++;
        // رصد التصبغات (النمش والبقع)
        if ((r + g + b) / 3 < 110 && r > b + 10) darkPoints++;
    }

    const avg = (rSum + gSum + bSum) / (100 * 100 * 3);
    
    // إرجاع النتائج فوراً
    return {
        type: avg > 170 ? "جافة" : (avg < 120 ? "دهنية" : "عادية"),
        acne: (redPoints / 10000) * 100 > 0.5,
        pigment: (darkPoints / 10000) * 100 > 1.0,
        glow: Math.max(30, 100 - (redPoints + darkPoints) / 100),
        hydration: Math.min(99, avg / 2.1),
        age: Math.floor(18 + (darkPoints / 500))
    };
}
