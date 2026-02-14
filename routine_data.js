const products = {
    vitaminC: [{name: "XQ Pharma Serum", actives: ["Vit C", "Niacinamide"]}],
    alphaArbutin: [{name: "Derwois Whitening", actives: ["Alpha Arbutin"]}],
    tranexamic: [{name: "Acti-White Serum", actives: ["Tranexamic Acid"]}],
    exfoliant: [{name: "Derma Ten Glycolic", actives: ["Glycolic Acid 10%"]}],
    sunblock: [{name: "Collagra SPF50", actives: ["UV Protection"]}],
    eyeCream: [{name: "Eva Eye Cream", actives: ["Caffeine", "HA"]}],
    acne: [{name: "Adapalene Gel", actives: ["Retinoid"]}]
};

const routines = {
    pigmentation: ["vitaminC", "alphaArbutin", "sunblock"],
    acne: ["acne", "exfoliant", "sunblock"],
    darkCircles: ["eyeCream"]
};