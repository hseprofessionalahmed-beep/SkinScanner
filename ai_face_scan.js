let scanResult = {
  acne: false,
  pigmentation: false,
  darkCircles: false,
  oiliness: "normal"
};

async function analyzeFace(imageElement) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = imageElement.width;
  canvas.height = imageElement.height;
  ctx.drawImage(imageElement, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  let redPixels = 0;
  let darkPixels = 0;
  let total = data.length / 4;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g
