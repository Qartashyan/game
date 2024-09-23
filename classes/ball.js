import { AudioProps } from "./audio.js";

const colors = ['red', 'blue', 'pink', 'orange', 'purple', 'yellow', 'gray', 'brown', 'gold'];
export class Ball {
  constructor(
    id = 1,
    x = 0,
    y = 0,
    vx = 200,
    vy = 200,
    screenHeight = 50,
    screenWidth = 50,
    depth = 6,
    color = 'blue',
    audio = new AudioProps('pop')
  ) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.depth = depth;
    this.screenHeight = screenHeight;
    this.screenWidth = screenWidth;
    this.finalRadius = this.screenHeight / 18;
    this.radius = (this.screenHeight / 10) - (this.screenHeight / 10 - this.finalRadius) / (this.depth);
    this.color = color;
    this.circle = new Path2D();
    this.circle.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    this.colorChange = 5000;
    this.audio = audio;
  };
  update(timestamp, delta) {
    this.radius = (this.screenHeight / 10) - (this.screenHeight / 10 - this.finalRadius) / (this.depth);
    if (timestamp > this.colorChange) {
      this.colorChange = timestamp + 5000;
      this.color = colors[Math.floor(Math.random() * 10)];
    }
    this.x += delta * this.vx / 1000;
    this.y += delta * this.vy / 1000;

    if (this.y + this.radius > this.screenHeight) {
      this.y = this.screenHeight - this.radius
    }
    if (this.x + this.radius > this.screenWidth) {
      this.x = this.screenWidth - this.radius
    }
    if (
      this.y + this.radius >= this.screenHeight ||
      this.y < this.radius
    ) {
      this.vy = -this.vy;
    }
    if (
      this.x + this.radius >= this.screenWidth ||
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