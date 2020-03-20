import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * A form input control which displays currency in decimal format, whilst working
 * with the intege cent value in the background.
 */
@Component({
    selector: 'vdr-currency-input',
    templateUrl: './currency-input.component.html',
    styleUrls: ['./currency-input.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: CurrencyInputComponent,
            multi: true,
        },
    ],
})
export class CurrencyInputComponent implements ControlValueAccessor, OnChanges {
    @Input() disabled = false;
    @Input() readonly = false;
    @Input() value: number;
    @Input() currencyCode = '';
    onChange: (val: any) => void;
    onTouch: () => void;
    _decimalValue: string;

    ngOnChanges(changes: SimpleChanges) {
        if ('value' in changes) {
            this.writeValue(changes['value'].currentValue);
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
    }

    onInput(value: string) {
        const integerValue = Math.round(+value * 100);
        this.onChange(integerValue);
        const delta = Math.abs(Number(this._decimalValue) - Number(value));
        if (0.009 < delta && delta < 0.011) {
            this._decimalValue = this.toNumericString(value);
        } else {
            this._decimalValue = value;
        }
    }

    writeValue(value: any): void {
        const numericValue = +value;
        if (!Number.isNaN(numericValue)) {
            this._decimalValue = this.toNumericString(Math.floor(value) / 100);
        }
    }

    private toNumericString(value: number | string): string {
        return Number(value).toFixed(2);
    }
}
