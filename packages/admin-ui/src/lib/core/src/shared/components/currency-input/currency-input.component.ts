import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService } from '../../../data/providers/data.service';

/**
 * A form input control which displays currency in decimal format, whilst working
 * with the integer cent value in the background.
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
export class CurrencyInputComponent implements ControlValueAccessor, OnInit, OnChanges {
    @Input() disabled = false;
    @Input() readonly = false;
    @Input() value: number;
    @Input() currencyCode = '';
    @Output() valueChange = new EventEmitter();
    prefix$: Observable<string>;
    suffix$: Observable<string>;
    onChange: (val: any) => void;
    onTouch: () => void;
    _decimalValue: string;
    private currencyCode$ = new BehaviorSubject<string>('');

    constructor(private dataService: DataService, private changeDetectorRef: ChangeDetectorRef) {}

    ngOnInit() {
        const languageCode$ = this.dataService.client.uiState().mapStream(data => data.uiState.language);
        const shouldPrefix$ = combineLatest(languageCode$, this.currencyCode$).pipe(
            map(([languageCode, currencyCode]) => {
                if (!currencyCode) {
                    return '';
                }
                const locale = languageCode.replace(/_/g, '-');
                const parts = (new Intl.NumberFormat(locale, {
                    style: 'currency',
                    currency: currencyCode,
                    currencyDisplay: 'symbol',
                }) as any).formatToParts();
                const NaNString = parts.find(p => p.type === 'nan')?.value ?? 'NaN';
                const localised = new Intl.NumberFormat(locale, {
                    style: 'currency',
                    currency: currencyCode,
                    currencyDisplay: 'symbol',
                }).format(undefined as any);
                return localised.indexOf(NaNString) > 0;
            }),
        );
        this.prefix$ = shouldPrefix$.pipe(map(shouldPrefix => (shouldPrefix ? this.currencyCode : '')));
        this.suffix$ = shouldPrefix$.pipe(map(shouldPrefix => (shouldPrefix ? '' : this.currencyCode)));
    }

    ngOnChanges(changes: SimpleChanges) {
        if ('value' in changes) {
            this.writeValue(changes['value'].currentValue);
        }
        if ('currencyCode' in changes) {
            this.currencyCode$.next(this.currencyCode);
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
        if (typeof this.onChange === 'function') {
            this.onChange(integerValue);
        }
        this.valueChange.emit(integerValue);
        const delta = Math.abs(Number(this._decimalValue) - Number(value));
        if (0.009 < delta && delta < 0.011) {
            this._decimalValue = this.toNumericString(value);
        } else {
            this._decimalValue = value;
        }
    }

    onFocus() {
        if (typeof this.onTouch === 'function') {
            this.onTouch();
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
