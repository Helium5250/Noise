const randRange = (min, max) => Math.floor(Math.random() * (max - min) + min);

const canvas = document.querySelector('#canvas');

class Canvas {
  constructor(width, height, layer = 1) {
    this.width = width;
    this.height = height;
    this.layer = layer;
    this.randPoint = [];

    this.ctx = canvas.getContext('2d');
    this.ctx.canvas.width = width;
    this.ctx.canvas.height = height;
    this.data = this.ctx.createImageData(width, height);
  }

  generatePoint(num) {
    for (let i = 0; i < num; i++) {
      const x = randRange(0, this.width);
      const y = randRange(0, this.height);
      const z = randRange(0, this.layer);
      this.randPoint.push({ x, y, z });
    }
    return this;
  }

  draw(z) {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const distToPoint = [];

        for (let i = 0; i < this.randPoint.length; i++) {
          const p = this.randPoint[i];
          const dist = Math.floor(Math.hypot(p.x - x, p.y - y, p.z - z));
          distToPoint.push(dist);
        }

        const sortedDistToPoint = distToPoint.sort((a, b) => a - b);
        const R = (sortedDistToPoint[0] / (this.width / 2)) * 255;
        const G = (sortedDistToPoint[1] / (this.width / 2)) * 255;
        const B = (sortedDistToPoint[2] / (this.width / 2)) * 255;

        this.data.data[x * this.width * 4 + y * 4 + 0] = R;
        this.data.data[x * this.width * 4 + y * 4 + 1] = G;
        this.data.data[x * this.width * 4 + y * 4 + 2] = B;
        this.data.data[x * this.width * 4 + y * 4 + 3] = 255;
      }
    }
    return this;
  }

  show() {
    this.ctx.putImageData(this.data, 0, 0);
  }
}

const newCanvas = new Canvas(400, 400);

newCanvas.generatePoint(20).draw(1).show();

// for (let i = 0; i < imageData.data.length; i += 4) {
//   imageData.data[i + 0] = 190;
//   imageData.data[i + 1] = 0;
//   imageData.data[i + 2] = 210;
//   imageData.data[i + 3] = 255;
// }

// ctx.putImageData(imageData, 20, 20);
