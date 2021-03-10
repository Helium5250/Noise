const randRange = (min, max) => Math.floor(Math.random() * (max - min) + min);

function HSLToRGB(h, s, l) {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return [r, g, b];
}

const canvas = document.querySelector('#canvas');
class Canvas {
  constructor(width, height, layer = 1, weirdX = 4, weirdY = 4) {
    this.width = width;
    this.height = height;
    this.layer = layer;
    this.weirdX = weirdX;
    this.weirdY = weirdY;

    this.ctx = canvas.getContext('2d');
    this.ctx.canvas.width = width;
    this.ctx.canvas.height = height;
    this.data = this.ctx.createImageData(width, height);

    for (let i = 0; i < this.data.data.length; i += 4) {
      this.data.data[i + 3] = 255;
    }

    console.log(weirdX, weirdY);
  }

  generatePoint(num) {
    this.randPoint = [];
    for (let i = 0; i < num; i++) {
      const x = randRange(0, this.width);
      const y = randRange(0, this.height);
      const z = randRange(0, this.layer);
      this.randPoint.push({ x, y, z });
    }
    return this;
  }

  draw(z) {
    const denominator = this.width ** 2 / 3 / 255;

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const distToPoint = [];

        for (let i = 0; i < this.randPoint.length; i++) {
          const p = this.randPoint[i];
          distToPoint.push(Math.hypot(p.x - x, p.y - y, p.z - z));
          // distToPoint.push((p.x - x) ** 2 + (p.y - y) ** 2 + (p.z - z) ** 2);
        }

        const sortedPoint = distToPoint.sort((a, b) => a - b);
        const H = (distToPoint[0] / this.width) * 360 / 2;
        const S = (distToPoint[2] / this.width) * 400;
        const L = (distToPoint[1] / this.width) * 300;
        const [R, G, B] = HSLToRGB(H, S, L);

        // const R = (distToPoint[0] / this.width) * 256;
        // const G = (distToPoint[2] / this.width) * 256;
        // const B = (distToPoint[1] / this.width) * 256;

        const coordinate = y * this.width * this.weirdX + x * this.weirdY;
        this.data.data[coordinate + 0] = R;
        this.data.data[coordinate + 1] = G;
        this.data.data[coordinate + 2] = B;

        this.data.data[coordinate + 4] = R;
        this.data.data[coordinate + 5] = G;
        this.data.data[coordinate + 6] = B;

        this.data.data[coordinate + 8] = R;
        this.data.data[coordinate + 9] = G;
        this.data.data[coordinate + 10] = B;

        this.data.data[coordinate + 12] = R;
        this.data.data[coordinate + 13] = G;
        this.data.data[coordinate + 14] = B;
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

    function step() {
      if (counter > thisObj.layer) {
        return;
      }

      thisObj.draw(counter).show();
      counter++;
      window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }
}

const newCanvas = new Canvas(100, 100, 100, randRange(1, 100), randRange(1, 100));

function generate() {
  newCanvas.generatePoint(100).loopLayer();
}
generate();
