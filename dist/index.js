class ConsolWeb {
    constructor(config = {}) {
        Object.defineProperty(this, "console", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "lines", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        this.console =
            config.console !== undefined ? config.console : window.console;
        if (config.bindNative) {
            this.bind_native();
        }
        if (config.setGlobalThis) {
            window.consolweb = this;
        }
        this.clear();
    }
    bind_native() {
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
    render() {
        this.console.clear();
        this.lines.forEach((lineData) => {
            lineData.callback(...lineData.data);
        });
    }
    clear() {
        this.lines = [];
        this.render();
    }
    pushLine(callback, ...data) {
        this.lines.push({
            callback,
            data,
        });
        return this.lines.length - 1;
    }
    replaceLine(index, callback, ...data) {
        this.lines.splice(index, 1, {
            callback,
            data,
        });
        return index;
    }
    removeLine(index) {
        this.lines.splice(index, 1);
        return index;
    }
    log(...data) {
        const index = this.pushLine(this.console.log, ...data);
        this.render();
        return {
            clear: () => {
                this.removeLine(index);
                this.render();
            },
            replace: (...data) => {
                this.replaceLine(index, this.console.log, ...data);
            },
        };
    }
    warn(...data) {
        const index = this.pushLine(this.console.warn, ...data);
        this.render();
        return {
            clear: () => {
                this.removeLine(index);
                this.render();
            },
            replace: (...data) => {
                this.replaceLine(index, this.console.warn, ...data);
            },
        };
    }
    error(...data) {
        const index = this.pushLine(this.console.error, ...data);
        this.render();
        return {
            clear: () => {
                this.removeLine(index);
                this.render();
            },
            replace: (...data) => {
                this.replaceLine(index, this.console.error, ...data);
            },
        };
    }
    progress(current, max, conf) {
        let output = "";
        let loopInterval = null;
        const backgroundBar = conf.backgroundBar !== undefined ? conf.backgroundBar : "_";
        const currentBar = conf.currentBar !== undefined ? conf.currentBar : "#";
        const createBar = (current, max) => {
            const barLength = 20;
            const currentBarP = current / max;
            const currentBarLength = Math.round(barLength * currentBarP);
            const percent = conf.showPercent
                ? `${Math.floor(currentBarP * 100)}% `
                : "";
            const length = conf.showLength ? `[${current}/${max}] ` : "";
            const beforeText = conf.beforeText ? `${conf.beforeText} ` : "";
            const afterText = conf.afterText ? conf.afterText : "";
            const bar = currentBar.repeat(currentBarLength) +
                backgroundBar.repeat(barLength - currentBarLength);
            return `${beforeText}${length}${percent}${bar} ${afterText}`;
        };
        const createLoop = () => {
            const frames = ["-", "\\", "|", "/"];
            let i = 0;
            loopInterval = setInterval(() => {
                this.replaceLine(index, this.console.log, frames[i] + " " + output);
                if (i !== 3) {
                    i++;
                }
                else {
                    i = 0;
                }
                this.render();
            }, 200);
        };
        output = createBar(current, max);
        const index = this.pushLine(this.console.log, output);
        this.render();
        if (conf.loop) {
            createLoop();
        }
        return {
            update: (updateCurrent) => {
                output = createBar(updateCurrent, max);
                this.replaceLine(index, this.console.log, output);
                if (!conf.loop) {
                    this.render();
                }
            },
            clear: () => {
                if (loopInterval !== null) {
                    clearInterval(loopInterval);
                    loopInterval = null;
                }
                this.removeLine(index);
                this.render();
            },
            stopLoop: () => {
                if (loopInterval !== null) {
                    clearInterval(loopInterval);
                    loopInterval = null;
                }
            },
            startLoop: () => {
                if (loopInterval === null) {
                    createLoop();
                }
            },
        };
    }
}

export { ConsolWeb };
