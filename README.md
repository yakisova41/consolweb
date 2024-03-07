# Consoleweb

Let's use the progress bar in the browser console.

## Usage

```sh
bun add https://github.com/yakisova41/consolweb
```

```js
import { ConsolWeb } from "./consolweb";

const consolweb = new ConsolWeb({
  bindNative: true,
  setGlobalThis: true,
});

consolweb.log("Hello world!");
window.consolweb.error("Set Global this");
console.warn("Bind native console");

const progress = consolweb.progress(0, 20, {
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
  }

  i++;
}, 500);
```
