import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    OnChanges,
    OnInit,
    Output,
    Provider,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { unique } from '@vendure/common/lib/unique';

export const OPTION_VALUE_INPUT_VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OptionValueInputComponent),
    multi: true,
};

interface Option {
    id?: string;
    name: string;
    locked: boolean;
}

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
    @Input() options: Option[];
    @Output() add = new EventEmitter<Option>();
    @Output() remove = new EventEmitter<Option>();
    @Input() disabled = false;
    input = '';
    isFocussed = false;
    lastSelected = false;
    formValue: Option[];
    onChangeFn: (value: any) => void;
    onTouchFn: (value: any) => void;

    get optionValues(): Option[] {
        return this.formValue ?? this.options ?? [];
    }

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
        this.formValue = obj || [];
    }

    focus() {
        this.textArea.nativeElement.focus();
    }

    removeOption(option: Option) {
        if (!option.locked) {
            if (this.formValue) {
                this.formValue = this.formValue?.filter(o => o.name !== option.name);
                this.onChangeFn(this.formValue);
            } else {
                this.remove.emit(option);
            }
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
        const options = this.parseInputIntoOptions(this.input);
        if (!this.formValue && this.options) {
            for (const option of options) {
                this.add.emit(option);
            }
        } else {
            this.formValue = unique([...this.formValue, ...options]);
            this.onChangeFn(this.formValue);
        }
        this.input = '';
    }

    private parseInputIntoOptions(input: string): Option[] {
        return input
            .split(/[,\n]/)
            .map(s => s.trim())
            .filter(s => s !== '')
            .map(s => ({ name: s, locked: false }));
    }

    private removeLastOption() {
        if (this.optionValues.length) {
            const option = this.optionValues[this.optionValues.length - 1];
            this.removeOption(option);
        }
    }
}
