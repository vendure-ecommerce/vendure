import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { FormInputComponent } from '../../../common/component-registry-types';

@Component({
    selector: 'vdr-date-form-input',
    templateUrl: './date-form-input.component.html',
    styleUrls: ['./date-form-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateFormInputComponent implements FormInputComponent {
    @Input() readonly: boolean;
    formControl: FormControl;
    config: {
        component: string;
        min: string;
        max: string;
    };
}
