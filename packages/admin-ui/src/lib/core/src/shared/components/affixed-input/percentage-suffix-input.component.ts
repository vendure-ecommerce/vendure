import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataService } from '../../../data/providers/data.service';

/**
 * A form input control which displays a number input with a percentage sign suffix.
 */
@Component({
    selector: 'vdr-percentage-suffix-input',
    template: `
        <vdr-affixed-input suffix="%">
            <input
                type="text"
                [id]="inputId"
                [value]="_displayValue"
                [disabled]="disabled"
                [readonly]="readonly"
                (input)="onInput($event.target.value)"
                (blur)="onBlur()"
                (focus)="onTouch()"
            />
        </vdr-affixed-input>
    `,
    styles: [
        `
            :host {
                display: block;
            }
            input {
                text-align: right;
            }
        `,
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: PercentageSuffixInputComponent,
            multi: true,
        },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class PercentageSuffixInputComponent implements ControlValueAccessor, OnChanges, OnInit, OnDestroy {
    @Input() disabled = false;
    @Input() readonly = false;
    @Input() value: number | null;
    @Input() inputId: string;

    onChange: (val: any) => void;
    onTouch: () => void;
    _displayValue = '';
    private decimalSeparator = '.';
    private subscription: Subscription;

    constructor(
        private dataService: DataService,
        private cdr: ChangeDetectorRef,
    ) {}

    ngOnInit() {
        this.subscription = this.dataService.client
            .uiState()
            .mapStream(data => data.uiState.language)
            .subscribe(languageCode => {
                const locale = languageCode.replace(/_/g, '-');
                const parts = new Intl.NumberFormat(locale).formatToParts(1.1);
                this.decimalSeparator = parts.find(p => p.type === 'decimal')?.value ?? '.';
                this.formatDisplayValue();
            });
    }

    ngOnChanges(changes: SimpleChanges) {
        if ('value' in changes) {
            this.writeValue(changes['value'].currentValue);
        }
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    registerOnChange(fn: any) {
        this.onChange = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouch = fn;
    }

    setDisabledState(isDisabled: boolean) {
        this.disabled = isDisabled;
        this.cdr.markForCheck();
    }

    onInput(value: string) {
        this._displayValue = value;
        // Replace the localized separator with dot for parsing
        const normalized = value.replace(this.decimalSeparator, '.');
        const numericValue = parseFloat(normalized);

        if (!isNaN(numericValue)) {
            if (typeof this.onChange === 'function') {
                this.onChange(numericValue);
            }
        } else if (value === '') {
            if (typeof this.onChange === 'function') {
                this.onChange(null);
            }
        }
    }

    onBlur() {
        if (typeof this.onTouch === 'function') {
            this.onTouch();
        }
        this.formatDisplayValue();
    }

    writeValue(value: any): void {
        const numericValue = +value;
        if (!Number.isNaN(numericValue) && value !== null && value !== undefined) {
            this.value = numericValue;
            this.formatDisplayValue();
        } else {
            this.value = null;
            this._displayValue = '';
        }
        this.cdr.markForCheck();
    }

    private formatDisplayValue() {
        if (this.value != null && !Number.isNaN(this.value)) {
            this._displayValue = this.value.toString().replace('.', this.decimalSeparator);
        } else {
            this._displayValue = '';
        }
        this.cdr.markForCheck();
    }
}
