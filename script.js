const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];

// mouse
let mouse = {
  x: null,
  y: null,
  radius: 125,
};
window.addEventListener("mousemove", function (event) {
  mouse.x = event.x + canvas.clientLeft / 2;
  mouse.y = event.y + canvas.clientTop / 2;
});

function drawImage() {
  let imageWidth = png.width || png.naturalWidth;
  let imageHeight = png.height || png.naturalHeight;
  const data = ctx.getImageData(0, 0, imageWidth, imageHeight);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  class Particle {
    constructor(x, y, color, size) {
      (this.x = x + canvas.width / 2 - png.width * 2),
        (this.y = y + canvas.height / 2 - png.height * 2),
        (this.color = color),
        (this.size = 1.5),
        (this.baseX = x + canvas.width / 2 - png.width * 2),
        (this.baseY = y + canvas.height / 2 - png.height * 2),
        (this.density = Math.random() * 10 + 2);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }
    update() {
      ctx.fillStyle = this.color;

      // collision detection
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let forceDirectionX = dx / distance;
      let forceDirectionY = dy / distance;

      // max distance, past that the force will be 0
      var maxDistance = 100;
      var force = (maxDistance - distance) / maxDistance;

      // if we go below 0, set to 0
      if (force < 0) force = 0;

      let directionX = forceDirectionX * force * this.density * 0.6;
      let directionY = forceDirectionY * force * this.density * 0.6;

      if (distance < mouse.radius + this.size) {
        this.x -= directionX;
        this.y -= directionY;
      } else {
        if (this.x !== this.baseX) {
          let dx = this.x - this.baseX;
          let dy = this.y - this.baseY;
          this.x -= dx / 5;
        }
        if (this.y !== this.baseY) {
          let dx = this.x - this.baseX;
          let dy = this.y - this.baseY;
          this.y -= dy / 5;
        }
      }
      this.draw();
    }
  }
  function init() {
    particleArray = [];

    for (var y = 0, y2 = data.height; y < y2; y++) {
      for (var x = 0, x2 = data.width; x < x2; x++) {
        if (data.data[y * 4 * data.width + x * 4 + 3] > 128) {
          let positionX = x;
          let positionY = y;
          let color =
            "rgb(" +
            data.data[y * 4 * data.width + x * 4] +
            "," +
            data.data[y * 4 * data.width + x * 4 + 1] +
            "," +
            data.data[y * 4 * data.width + x * 4 + 2] +
            ")";
          particleArray.push(new Particle(positionX * 4, positionY * 4, color));
        }
      }
    }
  }
  function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = "rgb(255,255,255,.5)";
    ctx.fillRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particleArray.length; i++) {
      particleArray[i].update();
    }
  }
  init();
  animate();

  window.addEventListener("resize", function () {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
  });
}

const png = new Image();
png.src =
  "data:image/png;base64,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";

window.addEventListener("load", (event) => {
  console.log("page has loaded");
  ctx.drawImage(png, 0, 0);
  drawImage();
});
