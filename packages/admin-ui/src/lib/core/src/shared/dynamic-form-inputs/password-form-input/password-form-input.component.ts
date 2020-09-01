import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DefaultFormComponentId } from '@vendure/common/lib/shared-types';

import { FormInputComponent, InputComponentConfig } from '../../../common/component-registry-types';

@Component({
    selector: 'vdr-password-form-input',
    templateUrl: './password-form-input.component.html',
    styleUrls: ['./password-form-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordFormInputComponent implements FormInputComponent {
    static readonly id: DefaultFormComponentId = 'password-form-input';
    readonly: boolean;
    formControl: FormControl;
    config: InputComponentConfig;
}
