export class TerminalTyper {
    private lines: string[];
    private timer: number;

    constructor(private terminalElement: HTMLElement, commands: string) {
        this.terminalElement = terminalElement;
        this.lines = commands.split('\n');
    }

    start() {
        this.clear();
        const terminalEl = this.terminalElement;
        let pos = 0;
        let currLine = 0;
        const type = () => {
            if (pos < this.lines[currLine].length) {
                const char = this.lines[currLine][pos];
                terminalEl.innerHTML = terminalEl.innerHTML + char;
                pos++;
            } else {
                terminalEl.innerHTML = terminalEl.innerHTML + '<br>';
                currLine++;
                pos = 0;
            }
            if (this.lines[currLine] && pos <= this.lines[currLine].length) {
                this.timer = window.setTimeout(type, pos === 0 ? 400 : 20);
            }
        };
        type();
    }

    clear() {
        window.clearTimeout(this.timer);
        this.terminalElement.innerHTML = '';
    }

    fill() {
        this.clear();
        const terminalEl = this.terminalElement;
        for (let currLine = 0; currLine < this.lines.length; currLine++) {
            // tslint:disable-next-line
            for (let pos = 0; pos < this.lines[currLine].length; pos++) {
                const char = this.lines[currLine][pos];
                terminalEl.innerHTML = terminalEl.innerHTML + char;
            }
            if (currLine < this.lines.length - 1) {
                terminalEl.innerHTML = terminalEl.innerHTML + '<br>';
            }
        }
    }
}
