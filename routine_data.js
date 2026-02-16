// روتينات البشرة
const routines = {
    economic: {
        name:"اقتصادي",
        description:"روتين أساسي لترطيب وتفتيح البشرة",
        products:[
            {name:"Garnier SkinActive Fast Bright", actives:["Vitamin C","Niacinamide"], why:"تفتيح وتوحيد لون البشرة", duration:"8 أسابيع"},
            {name:"DermaTen Glycolic 10%", actives:["Glycolic Acid"], why:"تقشير خفيف وتحفيز تجدد البشرة", duration:"4 أسابيع"},
            {name:"Collagra Sunscreen SPF50", actives:["SPF50"], why:"حماية من الشمس", duration:"يومي"}
        ],
        expectedImprovement:"تحسن ملحوظ بالبشرة مع الالتزام"
    },
    super: {
        name:"سوبر",
        description:"روتين متقدم للعناية بالبشرة ومكافحة التصبغات",
        products:[
            {name:"Cleo Radiance Booster", actives:["Alpha Arbutin","Vitamin C","Niacinamide"], why:"تفتيح شامل وتحفيز التجدد", duration:"8 أسابيع"},
            {name:"Panthenol Plus Carbamide", actives:["Panthenol","Urea"], why:"ترطيب وتحسين ملمس البشرة", duration:"يومي"},
            {name:"Starveil Gel SPF50+", actives:["SPF50+"], why:"حماية + تفتيح", duration:"يومي"}
        ],
        expectedImprovement:"تحسن ملحوظ مع توحيد لون البشرة وإشراقة أكبر"
    },
    ultra: {
        name:"الترا",
        description:"روتين احترافي شامل مع حماية قوية وتحسين ملمس ونضارة البشرة",
        products:[
            {name:"XQ Pharma Serum", actives:["Alpha Arbutin","Tranexamic Acid","Vitamin C","Niacinamide"], why:"تفتيح + نضارة + حماية", duration:"8 أسابيع"},
            {name:"DermaTen Glycolic 10%", actives:["Glycolic Acid"], why:"تقشير خفيف وتحفيز التجدد", duration:"4 أسابيع"},
            {name:"Collagra Sunscreen SPF50", actives:["SPF50"], why:"حماية قوية", duration:"يومي"}
        ],
        expectedImprovement:"تحسن ممتاز مع توحيد لون، تفتيح ونضارة"
    }
};
