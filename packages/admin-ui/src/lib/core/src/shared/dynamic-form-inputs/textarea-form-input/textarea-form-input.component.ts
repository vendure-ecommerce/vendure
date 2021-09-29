import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DefaultFormComponentConfig, DefaultFormComponentId } from '@vendure/common/lib/shared-types';

import { FormInputComponent, InputComponentConfig } from '../../../common/component-registry-types';

@Component({
    selector: 'vdr-textarea-form-input',
    templateUrl: './textarea-form-input.component.html',
    styleUrls: ['./textarea-form-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaFormInputComponent implements FormInputComponent {
    static readonly id: DefaultFormComponentId = 'textarea-form-input';
    readonly: boolean;
    formControl: FormControl;
    config: DefaultFormComponentConfig<'textarea-form-input'>;

    get spellcheck(): boolean {
        return this.config.spellcheck === true;
    }
}
