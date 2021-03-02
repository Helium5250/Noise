const randRange = (min, max) => Math.floor(Math.random() * (max - min) + min);

const numOfPoint = 40;
const canvasWidth = 400;
const canvasHeight = 400;

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

ctx.canvas.width = canvasWidth;
ctx.canvas.height = canvasHeight;

const randPoint = [];
for (let i = 0; i < numOfPoint; i++) {
  const x = randRange(0, canvasWidth);
  const y = randRange(0, canvasHeight);
  const z = randRange(0, canvasWidth);
  randPoint.push([x, y, z]);
}

function draw(z) {
  for (let x = 0; x < canvasWidth; x++) {
    for (let y = 0; y < canvasHeight; y++) {
      const distToPoint = [];

      for (let p = 0; p < randPoint.length; p++) {
        const point = randPoint[p];
        if (point[0] - x < 200 && point[1] - y < 200 && point[2] - z < 200) {
          const dist = Math.floor(Math.hypot(point[0] - x, point[1] - y, point[2] - z));
          distToPoint.push(dist);
        }
      }

      const sortedDistToPoint = distToPoint.sort((a, b) => a - b);
      const R = (sortedDistToPoint[0] / (canvasWidth / 2)) * 256;
      const G = (sortedDistToPoint[1] / (canvasWidth / 2)) * 256;
      const B = (sortedDistToPoint[2] / (canvasWidth / 2)) * 256;

      ctx.fillStyle = `rgb(${R}, ${G}, ${B})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

// for (let z = 0; z < 10; z++) {
//   draw(z);
// }

let z = 0;
const timer = setInterval(() => {
  draw(z);
  console.log('hi');
  z += 10;
  if (z >= canvasWidth) {
    clearInterval(timer);
  }
}, 10);
