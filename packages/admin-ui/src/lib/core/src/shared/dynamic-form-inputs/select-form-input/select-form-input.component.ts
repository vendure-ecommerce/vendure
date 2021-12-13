import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DefaultFormComponentConfig, DefaultFormComponentId } from '@vendure/common/lib/shared-types';

import { FormInputComponent, InputComponentConfig } from '../../../common/component-registry-types';
import { CustomFieldConfigFragment } from '../../../common/generated-types';

/**
 * @description
 * Uses a select input to allow the selection of a string value. Should be used with
 * `string` type fields with options.
 *
 * @docsCategory custom-input-components
 * @docsPage default-inputs
 */
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

    get options() {
        return this.config.ui?.options || this.config.options;
    }
}
