import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DefaultFormComponentConfig, DefaultFormComponentId } from '@vendure/common/lib/shared-types';
import { Observable } from 'rxjs';

import { FormInputComponent, InputComponentConfig } from '../../../common/component-registry-types';
import { CurrencyCode } from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';

@Component({
    selector: 'vdr-currency-form-input',
    templateUrl: './currency-form-input.component.html',
    styleUrls: ['./currency-form-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyFormInputComponent implements FormInputComponent {
    static readonly id: DefaultFormComponentId = 'currency-form-input';
    @Input() readonly: boolean;
    formControl: FormControl;
    currencyCode$: Observable<CurrencyCode>;
    config: DefaultFormComponentConfig<'currency-form-input'>;

    constructor(private dataService: DataService) {
        this.currencyCode$ = this.dataService.settings
            .getActiveChannel()
            .mapStream(data => data.activeChannel.currencyCode);
    }
}
