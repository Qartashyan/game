import { Game } from "./classes/game.js";
import { Clock } from "./classes/clock.js";
import { Ball } from "./classes/ball.js";
import { AudioProps } from "./classes/audio.js";
const canvas = document.getElementById("canvas");
const start = document.getElementById("start");
const retry = document.getElementById("stop");
const timerBox = document.querySelector('.timer');
const fpsBox = document.querySelector('.fps');
const ctx = canvas.getContext("2d");
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const clockFace = new Image();
clockFace.src = './images/clockFace.png';
const clockArrows = new Image();
clockArrows.src = './images/clockArrows.png'
const syringe = document.createElement('img');
syringe.src = './images/syringe.png';
const colors = ['red', 'blue', 'pink', 'orange', 'purple', 'yellow', 'gray', 'brown', 'gold'];
ctx.canvas.width = screenWidth;
ctx.canvas.height = screenHeight;
let raf = 1;
let delta = 0;
let startTime;
let isFirstFrame = false;
let gameStartTimestamp;
const ball = new Ball(
  1,
  screenWidth / 2,
  screenHeight / 2,
  200,
  200,
  screenHeight,
  screenWidth
)
function generateDirection() {
  const direction = Math.floor(Math.random() * 10) - 5;
  if (direction > 0) {
    return 1
  }
  else {
    return -1;
  }
}

function isPointInObject(e, object) {
  if ((object.x <= e.offsetX && object.x + object.width >= e.offsetX) && (object.y <= e.offsetY && object.y + object.height >= e.offsetY)) {
    return true;
  }
  else {
    return false;
  }
}

class Player {
  constructor(
    bestTime = 0,
    depthReducer = 0,
    poppedBalls = 50,
  ) {
    this.bestTime = bestTime;
    this.depthReducer = depthReducer;
    this.poppedBalls = poppedBalls;
    this.width = screenWidth / 3;
    this.height = 50;
    this.x = screenWidth / 3 - this.width / 2;
    this.y = screenHeight - this.height
    this.rect = ctx.rect(this.x, this.y, this.width, this, this.height)
  }
  updateStats() {
    if (this.poppedBalls === 0) {
      this.depthReducer += 1;
      this.poppedBalls = 50;
    }
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fill(this.rect);
    ctx.stroke(this.rect);
    ctx.font = `${this.radius}px serif`;
    ctx.fillStyle = 'black'
    ctx.fillText(this.depthReducer, this.x - this.width / 4, this.y + this.height / 4)
  }
}

const player = new Player();
const game = new Game(ctx, raf, draw, 30, screenHeight, screenWidth, player, timerBox, fpsBox,)
const clock = new Clock(clockFace, clockArrows, Math.random() / 1.2 * canvas.width, Math.random() * canvas.height / 1.2, 3, screenHeight, screenWidth)
let balls = [ball];


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
    ball.update(timestamp, delta);
    ball.draw(ctx);
  });
  clock.draw(timestamp, game.timer, gameStartTimestamp, ctx);
  game.drawPanel();
  player.updateStats();
  startTime = timestamp;
  if (Math.floor(timestamp) % 5 === 0) {
    game.showFPS(delta);
  }
  if (game.isTimeEllapsed(timestamp, gameStartTimestamp)) {
    game.endGame(balls, raf, retry);
    player.poppedBalls = 50
    isFirstFrame = false;
    balls = [ball]
  }
  else {
    raf = window.requestAnimationFrame(draw);
  }
}

start.addEventListener("click", (e) => game.startGame(e));
retry.addEventListener("click", (e) => game.startGame(e));
function onPointerDown(e) {
  const random = Math.floor(Math.random() * 10);
  game.panelItems.forEach((item) => {
    //     const object =
    if (isPointInObject(e, { x: item.x, y: game.screenHeight - game.panelHeight, width: item.width, height: game.panelHeight })) {
      if (item.name === 'depthReducer' && player.depthReducer > 0) {
        balls.forEach((ball, index) => {
          ball.depth -= 1;
          if (ball.depth < 1) {
            delete balls[index]
          }
        })
        player.depthReducer -= 1
      }
    }
  })

  let lastIndex = -1;

  if (clock.show && isPointInObject(e, clock)) {
    new AudioProps('pickupClock').play();
    game.timer += 5;
  }
  // else if(){

  // }
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
      game.endGame(balls, raf, retry);
      isFirstFrame = false;
      player.poppedBalls = 50;
      player.depthReducer = 0;
      balls = [ball];
    }
    else {
      // pop.load();
      // pop.play()
      clickedBall.audio.play()

      player.poppedBalls -= 1;

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
          screenHeight,
          screenWidth,
          clickedBall.depth - 1,
          color1,
        );
        const newBall2 = new Ball(
          clickedBall.id + 5 * random,
          clickedBall.x + 15 * random,
          clickedBall.y + 15 * random,
          generateDirection() * (clickedBall.vx + 1),
          generateDirection() * (clickedBall.vy + 1),
          screenHeight,
          screenWidth,
          clickedBall.depth - 1,
          color2,
        );
        balls.push(newBall1, newBall2);
      }
    }
  }
}


canvas.addEventListener("pointerdown", onPointerDown)
