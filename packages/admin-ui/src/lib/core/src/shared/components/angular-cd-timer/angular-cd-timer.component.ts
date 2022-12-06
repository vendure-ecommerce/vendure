import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    Renderer2,
} from '@angular/core';
import dayjs from 'dayjs';

import { TimeInterface } from './angular-cd-timer.interface';

@Component({
    selector: 'vdr-cd-timer',
    template: ' <ng-content></ng-content>',
})
export class CdTimerComponent implements AfterViewInit, OnDestroy {
    private timeoutId: any;
    private tickCounter: number;
    private ngContentSchema: string;

    private seconds: number;
    private minutes: number;
    private hours: number;
    private days: number;

    @Input() startTime: number;
    @Input() endTime: number;
    @Input() countdown: boolean;
    @Input() autoStart: boolean;
    @Input() maxTimeUnit: string;
    @Input() placedTime: Date;
    @Input() format: string;
    @Output() onStart: EventEmitter<CdTimerComponent> = new EventEmitter<CdTimerComponent>();
    @Output() onStop: EventEmitter<CdTimerComponent> = new EventEmitter<CdTimerComponent>();
    @Output() onTick: EventEmitter<TimeInterface> = new EventEmitter<TimeInterface>();
    @Output() onComplete: EventEmitter<CdTimerComponent> = new EventEmitter<CdTimerComponent>();

    constructor(private elt: ElementRef, private renderer: Renderer2) {
        // Initialization
        this.autoStart = true;
        this.startTime = 0;
        this.endTime = 0;
        this.timeoutId = null;
        this.countdown = true;
        this.format = 'default';
    }

    ngAfterViewInit() {
        const ngContentNode = this.elt.nativeElement.lastChild; // Get last child, defined by user or span
        this.ngContentSchema = ngContentNode ? ngContentNode.nodeValue : '';
        if (this.autoStart === undefined || this.autoStart === true) {
            const fifteen = 60 * 15;
            const dayPlacedTime = dayjs(this.placedTime);
            const diffFromNow = dayPlacedTime.diff(Date.now(), 'seconds');
            // console.log(dayPlacedTime);
            console.log(diffFromNow);
            const diff = fifteen + diffFromNow;
            if (diff < 0) {
                this.startTime = 0;
                this.renderer.setProperty(this.elt.nativeElement, 'innerHTML', 'Time up');
            } else {
                this.startTime = diff;
                this.start();
            }
        }
    }

    ngOnDestroy() {
        this.resetTimeout();
    }

    /**
     * Start the timer
     */
    public start() {
        this.initVar();
        this.resetTimeout();
        this.computeTimeUnits();
        this.startTickCount();

        this.onStart.emit(this);
    }

    /**
     * Resume the timer
     */
    public resume() {
        this.resetTimeout();

        this.startTickCount();
    }

    /**
     * Stop the timer
     */
    public stop() {
        this.clear();

        this.onStop.emit(this);
    }

    /**
     * Reset the timer
     */
    public reset() {
        this.initVar();
        this.resetTimeout();
        this.clear();
        this.computeTimeUnits();
        this.renderText();
    }

    /**
     * Get the time information
     * @returns TimeInterface
     */
    public get() {
        return {
            seconds: this.seconds,
            minutes: this.minutes,
            hours: this.hours,
            days: this.days,
            timer: this.timeoutId,
            tick_count: this.tickCounter,
        };
    }

    /**
     * Initialize variable before start
     */
    private initVar() {
        this.startTime = this.startTime || 0;
        this.endTime = this.endTime || 0;
        this.countdown = this.countdown || false;
        this.tickCounter = this.startTime;

        // Disable countdown if start time not defined
        if (this.countdown && this.startTime === 0) {
            this.countdown = false;
        }

        // Determine auto format
        if (!this.format) {
            this.format = this.ngContentSchema.length > 5 ? 'user' : 'default';
        }
    }

    /**
     * Reset timeout
     */
    private resetTimeout() {
        if (this.timeoutId) {
            clearInterval(this.timeoutId);
        }
    }

    /**
     * Render the time to DOM
     */
    private renderText() {
        let outputText;
        if (this.format === 'user') {
            // User presentation
            const items = {
                seconds: this.seconds,
                minutes: this.minutes,
                hours: this.hours,
                days: this.days,
            };

            outputText = this.ngContentSchema;

            for (const key of Object.keys(items)) {
                outputText = outputText.replace('[' + key + ']', (items as any)[key].toString());
            }
        } else if (this.format === 'intelli') {
            // Intelli presentation
            outputText = '';
            if (this.days > 0) {
                outputText += this.days.toString() + 'day' + (this.days > 1 ? 's' : '') + ' ';
            }
            if (this.hours > 0 || this.days > 0) {
                outputText += this.hours.toString() + 'h ';
            }
            if ((this.minutes > 0 || this.hours > 0) && this.days === 0) {
                outputText += this.minutes.toString().padStart(2, '0') + 'min ';
            }
            if (this.hours === 0 && this.days === 0) {
                outputText += this.seconds.toString().padStart(2, '0') + 's';
            }
        } else if (this.format === 'hms') {
            // Hms presentation
            outputText = this.hours.toString().padStart(2, '0') + ':';
            outputText += this.minutes.toString().padStart(2, '0') + ':';
            outputText += this.seconds.toString().padStart(2, '0');
        } else if (this.format === 'ms') {
            // ms presentation
            outputText = '';
            if (this.hours > 0) {
                outputText = this.hours.toString().padStart(2, '0') + ':';
            }
            outputText += this.minutes.toString().padStart(2, '0') + ':';
            outputText += this.seconds.toString().padStart(2, '0');
        } else {
            // Default presentation
            outputText = this.days.toString() + 'd ';
            outputText += this.hours.toString() + 'h ';
            outputText += this.minutes.toString() + 'm ';
            outputText += this.seconds.toString() + 's';
        }

        this.renderer.setProperty(this.elt.nativeElement, 'innerHTML', outputText);
    }

    private clear() {
        this.resetTimeout();
        this.timeoutId = null;
    }

    /**
     * Compute each unit (seconds, minutes, hours, days) for further manipulation
     * @protected
     */
    protected computeTimeUnits() {
        if (!this.maxTimeUnit || this.maxTimeUnit === 'day') {
            this.seconds = Math.floor(this.tickCounter % 60);
            this.minutes = Math.floor((this.tickCounter / 60) % 60);
            this.hours = Math.floor((this.tickCounter / 3600) % 24);
            this.days = Math.floor(this.tickCounter / 3600 / 24);
        } else if (this.maxTimeUnit === 'second') {
            this.seconds = this.tickCounter;
            this.minutes = 0;
            this.hours = 0;
            this.days = 0;
        } else if (this.maxTimeUnit === 'minute') {
            this.seconds = Math.floor(this.tickCounter % 60);
            this.minutes = Math.floor(this.tickCounter / 60);
            this.hours = 0;
            this.days = 0;
        } else if (this.maxTimeUnit === 'hour') {
            this.seconds = Math.floor(this.tickCounter % 60);
            this.minutes = Math.floor((this.tickCounter / 60) % 60);
            this.hours = Math.floor(this.tickCounter / 3600);
            this.days = 0;
        }
        if (this.tickCounter === 0) {
            this.renderer.setProperty(this.elt.nativeElement, 'innerHTML', 'Time up');
        } else {
            this.renderText();
        }
    }

    /**
     * Start tick count, base of this component
     * @protected
     */
    protected startTickCount() {
        const that = this;

        that.timeoutId = setInterval(() => {
            let counter;
            if (that.countdown) {
                // Compute finish counter for countdown
                counter = that.tickCounter;

                if (that.startTime > that.endTime) {
                    counter = that.tickCounter - that.endTime - 1;
                }
            } else {
                // Compute finish counter for timer
                counter = that.tickCounter - that.startTime;

                if (that.endTime > that.startTime) {
                    counter = that.endTime - that.tickCounter - 1;
                }
            }

            that.computeTimeUnits();

            const timer: TimeInterface = {
                seconds: that.seconds,
                minutes: that.minutes,
                hours: that.hours,
                days: that.days,
                timer: that.timeoutId,
                tick_count: that.tickCounter,
            };

            that.onTick.emit(timer);

            if (counter < 0) {
                that.stop();

                that.onComplete.emit(that);
                return;
            }

            if (that.countdown) {
                that.tickCounter--;
            } else {
                that.tickCounter++;
            }
        }, 1000); // Each seconds
    }
}
