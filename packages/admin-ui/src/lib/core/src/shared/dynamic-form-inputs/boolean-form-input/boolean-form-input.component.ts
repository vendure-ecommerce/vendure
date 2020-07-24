import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';

import { FormInputComponent, InputComponentConfig } from '../../../common/component-registry-types';

@Component({
    selector: 'vdr-boolean-form-input',
    templateUrl: './boolean-form-input.component.html',
    styleUrls: ['./boolean-form-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooleanFormInputComponent implements FormInputComponent {
    readonly: boolean;
    formControl: FormControl;
    config: InputComponentConfig;
}
