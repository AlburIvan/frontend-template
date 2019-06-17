// const { confetti } = require('dom-confetti')
import { confetti } from 'dom-confetti'

const confettiCannon = document.querySelector('.confetti-cannon');

const confettiOpts = {
  angle: 90,
  spread: "54",
  startVelocity: "34",
  elementCount: 50,
  dragFriction: 0.1,
  duration: 3000,
  stagger: 0,
  width: "11px",
  height: "11px",
  colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
};

confetti(confettiCannon, confettiOpts);

console.log('Welcome to my template, to begin editing, go to `src` folder and start hacking away!')