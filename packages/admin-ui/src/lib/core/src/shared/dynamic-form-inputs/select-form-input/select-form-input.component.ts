import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DefaultFormComponentConfig, DefaultFormComponentId } from '@vendure/common/lib/shared-types';

import { FormInputComponent, InputComponentConfig } from '../../../common/component-registry-types';
import { CustomFieldConfigFragment } from '../../../common/generated-types';

@Component({
    selector: 'vdr-select-form-input',
    templateUrl: './select-form-input.component.html',
    styleUrls: ['./select-form-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectFormInputComponent implements FormInputComponent {
    static readonly id: DefaultFormComponentId = 'select-form-input';
    @Input() readonly: boolean;
    formControl: FormControl;
    config: DefaultFormComponentConfig<'select-form-input'> & CustomFieldConfigFragment;
}
