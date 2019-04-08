import { TerminalTyper } from './terminal-typer';

export class Sequencer {

    private readonly playTimer: { [name: string]: number; };
    private readonly onTransition?: (className: string) => void;

    constructor(private sceneElement: HTMLDivElement,
                private terminal: TerminalTyper,
                onTransitionFn?: (className: string) => void) {
        this.sceneElement = sceneElement;
        this.playTimer = {};
        this.onTransition = onTransitionFn;
    }

    async play() {
        Object.values(this.playTimer).forEach(k => clearTimeout(k));
        await this.sleep('initial', 0);
        this.scene0();
        await this.sleep('start-typing', 1000);
        this.scene1();
        await this.sleep('zoom-out', 1500);
        this.scene2();
        await this.sleep('data-flow', 1200);
        this.scene3();
        await this.sleep('websites', 1000);
        this.scene4();
        await this.sleep('logo', 2000);
        this.scene5();
        await this.sleep('final', 1000);
        this.scene6();
    }

    jumpTo(scene: 0 | 1 | 2 | 3 | 4 | 5 | 6) {
        Object.values(this.playTimer).forEach(k => clearTimeout(k));
        (this as any)['scene' + scene]();
    }

    private scene0() {
        this.setScene('scene-0');
        this.terminal.clear();
    }

    private scene1() {
        this.setScene('scene-1');
        this.terminal.start();
    }

    private scene2() {
        this.setScene('scene-2');
        this.terminal.fill();
    }

    private scene3() {
        this.setScene('scene-3');
        this.terminal.fill();
    }

    private scene4() {
        this.setScene('scene-4');
        this.terminal.fill();
    }

    private scene5() {
        this.setScene('scene-5');
        this.terminal.fill();
    }

    private scene6() {
        this.setScene('scene-6');
        this.terminal.fill();
    }

    private setScene(className: string) {
        this.sceneElement.classList.value = `visible scene ${className}`;
        if (typeof this.onTransition === 'function') {
            this.onTransition(className);
        }
    }

    private sleep(id: string, duration: number) {
        clearTimeout(this.playTimer[id]);
        return new Promise(resolve => {
            this.playTimer[id] = setTimeout(resolve, duration);
        });
    }
}
