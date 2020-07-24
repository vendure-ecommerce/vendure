import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { FormInputComponent } from '../../../common/component-registry-types';

@Component({
    selector: 'vdr-select-form-input',
    templateUrl: './select-form-input.component.html',
    styleUrls: ['./select-form-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectFormInputComponent implements FormInputComponent {
    @Input() readonly: boolean;
    formControl: FormControl;
    config: {
        component: string;
        options: Array<{ value: string; label?: string }>;
    };
}
