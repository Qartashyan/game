
let pop = new Audio('./sounds/pop.mp3');
let pop1 = new Audio('./sounds/pop.mp3');
const gameOver = new Audio('./sounds/gameOver.mp3');
const clockSound = new Audio('./sounds/clock.mp3');
const pickupClock = new Audio('./sounds/pickupClock.mp3');
// const ctx = new AudioContext();
const audioMap = [
  {
    audio: pop,
    name: 'pop',
  },
  {
    audio: pop1,
    name: 'pop1',
  },
  {
    audio: gameOver,
    name: 'gameOver',
  },
  {
    audio: clockSound,
    name: 'clockSound',
  },
  {
    audio: pickupClock,
    name: 'pickupClock',
  },
]

export class AudioProps {
  constructor(
    name
  ) {
    this.name = name;
    this.audio = audioMap.filter(e => e.name === this.name)[0].audio;
    this.audio.preload = true;
    // this.ctx = new AudioContext();
  }
  play() {
    this.audio.addEventListener('ended', () => {
      this.audio.currentTime = 0;
    });
    this.audio.play();
  }
}