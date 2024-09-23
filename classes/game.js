import { AudioProps } from "./audio.js";


export class Game {
  constructor(
    ctx,
    raf,
    draw,
    timer,
    screenHeight,
    screenWidth,
    player,
    timerBox,
    fpsBox,
  ) {
    this.draw = draw;
    this.raf = raf;
    this.ctx = ctx;
    this.screenHeight = screenHeight;
    this.screenWidth = screenWidth;
    this.timerBox = timerBox;
    this.fpsBox = fpsBox;
    this.player = player;
    this.timer = timer;
    this.panel = this.ctx.rect(0, screenHeight - 50, 400, 50, true);
    this.panelColor = 'gray';
    this.panelItems = [
      {
        name: 'depthReducer',
        x: 0,
        width: 0
      }
    ],
      this.panelHeight = 50;
  }
  requestAnimation() {
    window.requestAnimationFrame(this.draw)
  }
  cancelAnimation(raf) {
    window.cancelAnimationFrame(raf)
  }
  startGame(UIElement) {
    const ctx = new AudioContext()
    UIElement.target.parentElement.style.display = 'none';
    this.raf = this.requestAnimation();
  }
  pauseGame() {
    this.cancelAnimation(raf);
  }
  resumeGame() {
    this.requestAnimation();
  }
  endGame(balls, raf, retry) {
    this.timer = 30;
    if (balls.length === 0) {

    }
    else {
      new AudioProps('gameOver').play()
      setTimeout(() => {
        retry.parentElement.style.display = 'flex';
      }, 1000);
    }
    this.cancelAnimation(raf);
  }
  isTimeEllapsed(timestamp, gameStartTimestamp) {
    let time = Math.floor(this.timer + 1 - (timestamp - gameStartTimestamp) / 1000);
    this.timerBox.innerHTML = time;
    if (time <= 5) {
      // clockSound.play();
      this.timerBox.style.color = 'red';
    }
    else {
      this.timerBox.style.color = 'inherit';
    }
    if (time === 0) {
      return true;
    }
    else {
      return false;
    }
  }
  showFPS(delta) {
    this.fpsBox.innerHTML = `FPS: ${Math.floor(1000 / delta)}`;
  }
  drawPanel() {
    this.ctx.beginPath()
    this.ctx.fillStyle = this.panelColor;
    this.ctx.rect(0, this.screenHeight - this.panelHeight, this.screenWidth, this.panelHeight, true)
    this.ctx.fill();
    this.ctx.closePath()
    this.panelItems.forEach((item, index) => {
      item.x = this.screenWidth / this.panelItems.length * index;
      item.width = this.screenWidth / this.panelItems.length;
      this.ctx.beginPath();
      this.ctx.fillStyle = 'red'
      this.ctx.rect(item.x, this.screenHeight - this.panelHeight, item.width, this.panelHeight);
      this.ctx.fill()
      this.ctx.fillStyle = 'black'
      this.ctx.font = `${this.panelHeight / 2}px serif`;
      this.ctx.fillText(this.player[item.name], item.x + item.width / 2, this.screenHeight - 15)
      if (item.name === 'depthReducer') {
        this.ctx.beginPath()
        this.ctx.fillStyle = 'white';
        this.ctx.arc(item.width - this.panelHeight / 5, this.screenHeight - this.panelHeight / 1.3, this.panelHeight / 5, 0, Math.PI * 2, true);
        this.ctx.fill();
        this.ctx.fillStyle = 'black'
        this.ctx.font = `${this.panelHeight / 4}px serif`;
        this.ctx.fillText(this.player.poppedBalls, item.width - 16, this.screenHeight - this.panelHeight + 16, 40)
        this.ctx.closePath()
      }
      this.ctx.closePath()
    })
  }
}