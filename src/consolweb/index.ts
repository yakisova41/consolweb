export class ConsolWeb {
  private console: typeof window.console;
  private lines: LineData[] = [];
  private belowLines: LineData[] = [];

  constructor(config: ConsolWebConf = {}) {
    this.console = window.console;

    if (config.bindNative) {
      this.bind_native();
    }

    if (config.setGlobalThis) {
      window.consolweb = this;
    }

    this.clear();
  }

  private bind_native() {
    const oldConsole = window.console;
    window.console = {
      ...oldConsole,
      log: (...args) => {
        this.log(...args);
      },
      error: (...args) => {
        this.error(...args);
      },
      warn: (...args) => {
        this.warn(...args);
      },
    };
  }

  public render() {
    this.console.clear();
    this.lines.forEach((lineData) => {
      lineData.callback(...lineData.data);
    });
    this.belowLines.forEach((lineData) => {
      lineData.callback(...lineData.data);
    });
  }

  public clear() {
    this.lines = [];
    this.belowLines = [];
    this.render();
  }

  public pushLine(
    callback: LineData["callback"],
    below: boolean,
    ...data: LineData["data"]
  ) {
    (below ? this.belowLines : this.lines).push({
      callback,
      data,
    });

    return this.lines.length - 1;
  }

  public replaceLine(
    index: number,
    callback: LineData["callback"],
    below: boolean,
    ...data: LineData["data"]
  ) {
    (below ? this.belowLines : this.lines).splice(index, 1, {
      callback,
      data,
    });

    return index;
  }

  public removeLine(index: number, below: boolean) {
    (below ? this.belowLines : this.lines).splice(index, 1);

    return index;
  }

  public log(...data: LineData["data"]) {
    const index = this.pushLine(this.console.log, false, ...data);
    this.render();

    return {
      clear: () => {
        this.removeLine(index, false);
      },
      replace: (...data: LineData["data"]) => {
        this.replaceLine(index, this.console.log, false, ...data);
      },
    };
  }

  public warn(...data: LineData["data"]) {
    const index = this.pushLine(this.console.warn, false, ...data);
    this.render();

    return {
      clear: () => {
        this.removeLine(index, false);
      },
      replace: (...data: LineData["data"]) => {
        this.replaceLine(index, this.console.warn, false, ...data);
      },
    };
  }

  public error(...data: LineData["data"]) {
    const index = this.pushLine(this.console.error, false, ...data);
    this.render();

    return {
      clear: () => {
        this.removeLine(index, false);
      },
      replace: (...data: LineData["data"]) => {
        this.replaceLine(index, this.console.error, false, ...data);
      },
    };
  }

  public progress(
    current: number,
    max: number,
    conf: {
      backgroundBar?: string;
      currentBar?: string;
      showPercent?: boolean;
      showLength?: boolean;
      beforeText?: string;
      afterText?: string;
      loop?: boolean;
      alwaysBelow?: boolean;
    },
  ) {
    let output = "";
    let loopInterval: null | number = null;

    const backgroundBar =
      conf.backgroundBar !== undefined ? conf.backgroundBar : "_";
    const currentBar = conf.currentBar !== undefined ? conf.currentBar : "#";

    const below = conf.alwaysBelow ? true : false;

    const createBar = (current: number, max: number) => {
      const barLength = 20;
      const currentBarP = current / max;
      const currentBarLength = Math.round(barLength * currentBarP);

      const percent = conf.showPercent
        ? `${Math.floor(currentBarP * 100)}%`
        : "";
      const length = conf.showLength ? `${current}/${max}` : "";
      const beforeText = conf.beforeText ? conf.beforeText : "";
      const afterText = conf.afterText ? conf.afterText : "";

      const bar =
        currentBar.repeat(currentBarLength) +
        backgroundBar.repeat(barLength - currentBarLength);

      return `${beforeText} [${length}] ${percent} ${bar} ${afterText}`;
    };

    output = createBar(current, max);
    const index = this.pushLine(this.console.log, below, output);
    this.render();

    if (conf.loop) {
      const frames = ["-", "\\", "|", "/"];
      let i = 0;
      loopInterval = window.setInterval(() => {
        this.replaceLine(
          index,
          this.console.log,
          below,
          frames[i] + " " + output,
        );

        if (i !== 3) {
          i++;
        } else {
          i = 0;
        }

        this.render();
      }, 200);
    }

    return {
      update: (updateCurrent: number) => {
        output = createBar(updateCurrent, max);
        this.replaceLine(index, this.console.log, below, output);
        if (!conf.loop) {
          this.render();
        }
      },
      clear: () => {
        if (loopInterval !== null) {
          clearInterval(loopInterval);
        }
        this.removeLine(index, below);
      },
    };
  }
}

export interface ConsolWebConf {
  bindNative?: boolean;
  setGlobalThis?: boolean;
}

export interface LineData {
  callback: typeof console.log | typeof console.error | typeof console.warn;
  data: (string | number)[];
}

declare global {
  interface Window {
    consolweb: ConsolWeb;
    [name: string]: (...arg: string[]) => void;
  }
}
