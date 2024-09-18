const canvas = document.getElementById("canvas");
const start = document.getElementById("start");
const retry = document.getElementById("stop");
const timerBox = document.querySelector('.timer');
const clockBox = document.querySelector('.clock');
const fpsBox = document.querySelector('.fps');
const ctx = canvas.getContext("2d");
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const pop = new Audio('./sounds/pop.mp3');
const gameOver = new Audio('./sounds/gameOver.mp3');
const clockSound = new Audio('./sounds/clock.mp3');
const pickupClock = new Audio('./sounds/pickupClock.mp3');
const clockFace = new Image();
clockFace.src = './images/clockFace.png';
const clockArrows = new Image();
clockArrows.src = './images/clockArrows.png'
const syringe = document.createElement('img');
syringe.src = './images/syringe.png';
const colors = ['red', 'blue', 'pink', 'orange', 'purple', 'yellow', 'gray', 'brown', 'gold'];
ctx.canvas.width = screenWidth;
ctx.canvas.height = screenHeight;
let raf;
let delta = 0;
let startTime;
let isFirstFrame = false;
let gameStartTimestamp;

function generateDirection() {
  const direction = Math.floor(Math.random() * 10) - 5;
  if (direction > 0) {
    return 1
  }
  else {
    return -1;
  }
}

class Clock {
  constructor(clockFace, clockArrows, x, y, duration) {
    this.clockFace = clockFace;
    this.clockArrows = clockArrows;
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.show = false;
    this.duration = duration
  }
  draw(timestamp) {
    let time = Math.floor(game.timer + 1 - (timestamp - gameStartTimestamp) / 1000);
    if (time.toString()[time.toString().length - 1] < this.duration && time.toString()[time.toString().length - 1] > 0) {
      this.show = true;
      ctx.save();
      ctx.beginPath()
      const background = ctx.arc(this.x + this.width / 2, this.y + this.width / 2, this.width / 2, 0, Math.PI * 2, true);
      ctx.fillStyle = 'yellow';
      ctx.fill(background);
      ctx.closePath()
      ctx.drawImage(this.clockFace, this.x, this.y, this.width, this.height);
      ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
      ctx.rotate(timestamp / 150);
      ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2))
      ctx.drawImage(this.clockArrows, this.x, this.y, this.width, this.height);
      ctx.restore();
    }
    else {
      this.show = false;
      this.x = Math.random() / 1.2 * canvas.width;
      this.y = Math.random() / 1.2 * canvas.height;
    }
  }
}

class Ball {
  constructor(
    id = 1,
    x = screenWidth / 2,
    y = screenHeight / 2,
    vx = 200,
    vy = 200,
    depth = 6,
    color = 'blue',
  ) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.depth = depth;
    this.finalRadius = screenHeight / 18;
    this.radius = (screenHeight / 10) - (screenHeight / 10 - this.finalRadius) / (depth);
    this.color = color;
    this.circle = new Path2D();
    this.circle.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    this.colorChange = 5000;
  };
  update(timestamp) {
    if (timestamp > this.colorChange) {
      this.colorChange = timestamp + 5000;
      this.color = colors[Math.floor(Math.random() * 10)];
    }
    this.x += delta * this.vx / 1000;
    this.y += delta * this.vy / 1000;

    if (this.y + this.radius > canvas.height) {
      this.y = canvas.height - this.radius
    }
    if (this.x + this.radius > canvas.width) {
      this.x = canvas.width - this.radius
    }
    if (
      this.y + this.radius >= canvas.height ||
      this.y < this.radius
    ) {
      this.vy = -this.vy;
    }
    if (
      this.x + this.radius >= canvas.width ||
      this.x < this.radius
    ) {
      this.vx = -this.vx;
    }
    this.circle = new Path2D();
    this.circle.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
  }
  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fill(this.circle);
    ctx.stroke(this.circle);
    ctx.font = `${this.radius}px serif`;
    ctx.fillStyle = 'black'
    ctx.fillText(this.depth, this.x - this.radius / 4, this.y + this.radius / 4)
  };
}
const clock = new Clock(clockFace, clockArrows, Math.random() / 1.2 * canvas.width, Math.random() * canvas.height / 1.2, 3)
let balls = [
  new Ball(
    1,
    screenWidth / 2,
    screenHeight / 2,
    200,
    200,
  )
];

class Game {
  constructor(draw, timer) {
    this.draw = draw;
    this.timer = timer
  }
  requestAnimation() {
    window.requestAnimationFrame(this.draw)
  }
  cancelAnimation() {
    window.cancelAnimationFrame(raf)
  }
  startGame(UIElement) {
    console.log(balls)
    UIElement.target.parentElement.style.display = 'none';
    raf = this.requestAnimation();
  }
  pauseGame() {
    this.cancelAnimation();
  }
  resumeGame() {
    this.requestAnimation();
  }
  endGame() {
    this.timer = 30;
    setTimeout(() => {
      if (balls.length === 0) {

      }
      else {
        gameOver.play()
        retry.parentElement.style.display = 'flex';
      }
      balls = [
        new Ball(
          1,
          screenWidth / 2,
          screenHeight / 2,
          200,
          200,
        )
      ];
    }, 1000);
    this.cancelAnimation();
    isFirstFrame = false;
  }
  isTimeEllapsed(timestamp) {
    let time = Math.floor(this.timer + 1 - (timestamp - gameStartTimestamp) / 1000);
    timerBox.innerHTML = time;
    if (time <= 5) {
      clockSound.play();
      timerBox.style.color = 'red';
    }
    else {
      timerBox.style.color = 'inherit';
    }
    if (time === 0) {
      return true;
    }
    else {
      return false;
    }
  }
  showFPS() {
    fpsBox.innerHTML = `FPS: ${Math.floor(1000 / delta)}`;
  }
}

const game = new Game(draw, 30)

function draw(timestamp) {
  if (startTime === undefined) {
    startTime = timestamp
  }
  if (!isFirstFrame) {
    isFirstFrame = true;
    gameStartTimestamp = timestamp;
  }

  delta = timestamp - startTime;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  const main = ctx.rect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = 'green'
  ctx.fill(main)
  ctx.closePath();
  balls.forEach((ball) => {
    ball.update(timestamp);
    ball.draw(ctx);
  });
  clock.draw(timestamp)
  startTime = timestamp;
  if (Math.floor(timestamp) % 5 === 0) {
    game.showFPS();
  }
  if (game.isTimeEllapsed(timestamp)) {
    game.endGame();
  }
  else {
    raf = window.requestAnimationFrame(draw);
  }
}

start.addEventListener("click", (e) => game.startGame(e));
retry.addEventListener("click", (e) => game.startGame(e));

canvas.addEventListener("pointerdown", function (e) {
  const random = Math.floor(Math.random() * 10);
  let lastIndex = -1;

  if (clock.show && (clock.x <= e.offsetX && clock.x + clock.width >= e.offsetX) && (clock.y <= e.offsetY && clock.y + clock.height >= e.offsetY)) {
    pickupClock.play();
    game.timer += 5;
  }
  else {
    balls.forEach((ball, index) => {
      if (ctx.isPointInPath(ball.circle, e.offsetX, e.offsetY)) {
        lastIndex = index;
      }
    });
  }
  const clickedBall = balls[lastIndex];

  if (clickedBall) {
    if (clickedBall.color === "red") {
      game.endGame();
    }
    else {
      pop.load();
      pop.play();
    }

    let color1;
    let color2;

    if (random > 8) {
      color1 = "red";
    } else {
      color1 = clickedBall.color;
    }
    if (random < 2) {
      color2 = "red";
    } else {
      color2 = clickedBall.color;
    }
    balls.splice(lastIndex, 1);
    if (clickedBall.depth > 1) {
      const newBall1 = new Ball(
        clickedBall.id + 4 * random,
        clickedBall.x + 12 * random,
        clickedBall.y + 14 * random,
        generateDirection() * (clickedBall.vx + 1),
        generateDirection() * (clickedBall.vy + 1),
        clickedBall.depth - 1,
        color1,
      );
      const newBall2 = new Ball(
        clickedBall.id + 5 * random,
        clickedBall.x + 15 * random,
        clickedBall.y + 15 * random,
        generateDirection() * (clickedBall.vx + 1),
        generateDirection() * (clickedBall.vy + 1),
        clickedBall.depth - 1,
        color2,
      );
      balls.push(newBall1, newBall2);
    }
  }
});
