import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    forwardRef,
    Input,
    Provider,
    ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { unique } from '@vendure/common/lib/unique';

export const OPTION_VALUE_INPUT_VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OptionValueInputComponent),
    multi: true,
};

@Component({
    selector: 'vdr-option-value-input',
    templateUrl: './option-value-input.component.html',
    styleUrls: ['./option-value-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [OPTION_VALUE_INPUT_VALUE_ACCESSOR],
})
export class OptionValueInputComponent implements ControlValueAccessor {
    @Input() groupName = '';
    @ViewChild('textArea', { static: true }) textArea: ElementRef<HTMLTextAreaElement>;
    options: Array<{ name: string; locked: boolean }>;
    disabled = false;
    input = '';
    isFocussed = false;
    lastSelected = false;
    onChangeFn: (value: any) => void;
    onTouchFn: (value: any) => void;

    constructor(private changeDetector: ChangeDetectorRef) {}

    registerOnChange(fn: any): void {
        this.onChangeFn = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouchFn = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
        this.changeDetector.markForCheck();
    }

    writeValue(obj: any): void {
        this.options = obj || [];
    }

    focus() {
        this.textArea.nativeElement.focus();
    }

    removeOption(option: { name: string; locked: boolean }) {
        if (!option.locked) {
            this.options = this.options.filter(o => o.name !== option.name);
            this.onChangeFn(this.options);
        }
    }

    handleKey(event: KeyboardEvent) {
        switch (event.key) {
            case ',':
            case 'Enter':
                this.addOptionValue();
                event.preventDefault();
                break;
            case 'Backspace':
                if (this.lastSelected) {
                    this.removeLastOption();
                    this.lastSelected = false;
                } else if (this.input === '') {
                    this.lastSelected = true;
                }
                break;
            default:
                this.lastSelected = false;
        }
    }

    handleBlur() {
        this.isFocussed = false;
        this.addOptionValue();
    }

    private addOptionValue() {
        this.options = unique([...this.options, ...this.parseInputIntoOptions(this.input)]);
        this.input = '';
        this.onChangeFn(this.options);
    }

    private parseInputIntoOptions(input: string): Array<{ name: string; locked: boolean }> {
        return input
            .split(/[,\n]/)
            .map(s => s.trim())
            .filter(s => s !== '')
            .map(s => ({ name: s, locked: false }));
    }

    private removeLastOption() {
        if (!this.options[this.options.length - 1].locked) {
            this.options = this.options.slice(0, this.options.length - 1);
        }
    }
}
