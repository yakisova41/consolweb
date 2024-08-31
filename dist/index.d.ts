declare class ConsolWeb {
    private console;
    private lines;
    constructor(config?: ConsolWebConf);
    private bind_native;
    render(): void;
    clear(): void;
    pushLine(callback: LineData["callback"], ...data: LineData["data"]): number;
    replaceLine(index: number, callback: LineData["callback"], ...data: LineData["data"]): number;
    removeLine(index: number): number;
    log(...data: LineData["data"]): {
        clear: () => void;
        replace: (...data: LineData["data"]) => void;
    };
    warn(...data: LineData["data"]): {
        clear: () => void;
        replace: (...data: LineData["data"]) => void;
    };
    error(...data: LineData["data"]): {
        clear: () => void;
        replace: (...data: LineData["data"]) => void;
    };
    progress(current: number, max: number, conf: {
        backgroundBar?: string;
        currentBar?: string;
        showPercent?: boolean;
        showLength?: boolean;
        beforeText?: string;
        afterText?: string;
        loop?: boolean;
    }): {
        update: (updateCurrent: number) => void;
        clear: () => void;
        stopLoop: () => void;
        startLoop: () => void;
    };
}
interface ConsolWebConf {
    bindNative?: boolean;
    setGlobalThis?: boolean;
    console?: Console;
}
interface LineData {
    callback: typeof console.log | typeof console.error | typeof console.warn;
    data: (string | number)[];
}
declare global {
    interface Window {
        consolweb: ConsolWeb;
        [name: string]: (...arg: string[]) => void;
    }
}

export { ConsolWeb, type ConsolWebConf, type LineData };
