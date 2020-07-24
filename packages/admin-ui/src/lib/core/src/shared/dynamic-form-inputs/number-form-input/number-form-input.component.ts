import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { FormInputComponent } from '../../../common/component-registry-types';

@Component({
    selector: 'vdr-number-form-input',
    templateUrl: './number-form-input.component.html',
    styleUrls: ['./number-form-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumberFormInputComponent implements FormInputComponent {
    @Input() readonly: boolean;
    formControl: FormControl;
    config: {
        component: string;
        prefix?: string;
        suffix?: string;
    };
}
