const randRange = (min, max) => Math.floor(Math.random() * (max - min) + min);

const canvas = document.querySelector('#canvas');
console.log(canvas);

const rSlider = document.querySelector('#r-slider');
const gSlider = document.querySelector('#g-slider');
const bSlider = document.querySelector('#b-slider');
const brightnessSlider = document.querySelector('#brightness-slider');
class Canvas {
  constructor(width, height, layer = 1) {
    this.width = width;
    this.height = height;
    this.layer = layer;
    this.randPoint = [];
    this.distToPoint = [];

    this.ctx = canvas.getContext('2d');
    this.ctx.canvas.width = width;
    this.ctx.canvas.height = height;
    this.data = this.ctx.createImageData(width, height);
    this.denominator = this.width ** 2 / 255;

    for (let i = 0; i < this.data.data.length; i += 4) {
      this.data.data[i + 3] = 255;
    }
  }

  generatePoint(num) {
    this.distToPoint = [];
    this.randPoint = [];
    for (let i = 0; i < num; i++) {
      const x = randRange(0, this.width);
      const y = randRange(0, this.height);
      const z = randRange(0, this.layer);
      this.randPoint.push({
        x,
        y,
        z,
      });
      this.distToPoint.push(0);
    }
    return this;
  }

  draw(z, timestamp) {
    const pitch = this.width * 4;
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        for (let i = 0; i < this.randPoint.length; i++) {
          const p = this.randPoint[i];
          this.distToPoint[i] = (p.x - x) ** 2 + (p.y - y) ** 2;
        }
        const sortedPoint = this.distToPoint.sort((a, b) => a - b);
        const grey = (sortedPoint[0] + sortedPoint[1] + sortedPoint[2]) / (this.denominator) + (brightnessSlider.value * 255);

        this.data.data[y * pitch + x * 4 + 0] = grey * rSlider.value;
        this.data.data[y * pitch + x * 4 + 1] = grey * gSlider.value;
        this.data.data[y * pitch + x * 4 + 2] = grey * bSlider.value;
      }
    }
    return this;
  }

  show() {
    this.ctx.putImageData(this.data, 0, 0);
  }

  loopLayer() {
    const thisObj = this;

    let counter = 0;

    function step(timestamp) {
      if (counter > thisObj.layer) {
        console.log('finished');
        return;
      }
      thisObj.draw(counter, timestamp).show();
      counter++;
      window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }
}

const newCanvas = new Canvas(200, 200, 400);

function generate() {
  newCanvas.generatePoint(randRange(10, 20)).loopLayer();
}
generate();
