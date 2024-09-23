export class Clock {
  constructor(clockFace, clockArrows, x, y, duration,screenHeight,screenWidth) {
    this.clockFace = clockFace;
    this.clockArrows = clockArrows;
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.show = false;
    this.duration = duration;
    this.screenHeight=screenHeight;
    this.screenWidth=screenWidth;
  }
  draw(timestamp,timer,gameStartTimestamp,ctx) {
    let time = Math.floor(timer + 1 - (timestamp - gameStartTimestamp) / 1000);
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
      this.x = Math.random() / 1.2 * this.screenWidth;
      this.y = Math.random() / 1.2 * this.screenHeight;
    }
  }
}