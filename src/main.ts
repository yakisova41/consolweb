import { ConsolWeb } from "./consolweb";
new ConsolWeb({ bindNative: true, setGlobalThis: true });

window.consolweb.log("Console Web");

const progress = window.consolweb.progress(0, 20, {
  beforeText: "Nice Progress",
  showPercent: true,
  showLength: true,
  loop: true,
  alwaysBelow: true,
});
let i = 1;
let isUp = true;
const pp = setInterval(() => {
  progress.update(i);

  if (i >= 20) {
    isUp = false;
  }

  if (i === 0) {
    isUp = true;
  }

  if (isUp) {
    i++;
  } else {
    i--;
  }
}, 500);

const s = setInterval(() => {
  console.log(Math.random());
}, 100);

setTimeout(() => {
  clearInterval(pp);
  progress.clear();
  clearInterval(s);
}, 5000);
