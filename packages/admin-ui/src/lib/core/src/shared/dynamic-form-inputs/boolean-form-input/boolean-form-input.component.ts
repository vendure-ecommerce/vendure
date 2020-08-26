import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DefaultFormComponentConfig, DefaultFormComponentId } from '@vendure/common/lib/shared-types';

import { FormInputComponent, InputComponentConfig } from '../../../common/component-registry-types';

@Component({
    selector: 'vdr-boolean-form-input',
    templateUrl: './boolean-form-input.component.html',
    styleUrls: ['./boolean-form-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooleanFormInputComponent implements FormInputComponent {
    static readonly id: DefaultFormComponentId = 'boolean-form-input';
    readonly: boolean;
    formControl: FormControl;
    config: DefaultFormComponentConfig<'boolean-form-input'>;
}
