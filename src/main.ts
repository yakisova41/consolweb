import { ConsolWeb } from "./consolweb";
new ConsolWeb({ bindNative: true, setGlobalThis: true });

window.consolweb.log("Console Web");

const progress = window.consolweb.progress(0, 20, {
  beforeText: "Progress",
  showPercent: true,
  showLength: true,
  loop: true,
});
let i = 1;
const interval = setInterval(() => {
  progress.update(i);

  if (i === 20) {
    clearInterval(interval);
    progress.clear();
  }

  i++;
}, 500);
