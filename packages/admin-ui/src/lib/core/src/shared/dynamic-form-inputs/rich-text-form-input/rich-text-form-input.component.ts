import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DefaultFormComponentConfig, DefaultFormComponentId } from '@vendure/common/lib/shared-types';

import { FormInputComponent, InputComponentConfig } from '../../../common/component-registry-types';

@Component({
    selector: 'vdr-rich-text-form-input',
    templateUrl: './rich-text-form-input.component.html',
    styleUrls: ['./rich-text-form-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RichTextFormInputComponent implements FormInputComponent {
    static readonly id: DefaultFormComponentId = 'rich-text-form-input';
    readonly: boolean;
    formControl: FormControl;
    config: DefaultFormComponentConfig<'rich-text-form-input'>;
}
