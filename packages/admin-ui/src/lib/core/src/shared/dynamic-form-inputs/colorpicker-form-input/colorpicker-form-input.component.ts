import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { throwServerError } from '@apollo/client';
import { DefaultFormComponentConfig, DefaultFormComponentId } from '@vendure/common/lib/shared-types';

import { FormInputComponent, InputComponentConfig } from '../../../common/component-registry-types';

/**
 * @description
 * Uses a regular text form input. This is the default input for `string` and `localeString` type fields.
 *
 * @docsCategory custom-input-components
 * @docsPage default-inputs
 */
@Component({
    selector: 'vdr-colorpicker-form-input',
    templateUrl: './colorpicker-form-input.component.html',
    styleUrls: ['./colorpicker-form-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorPickerFormInputComponent implements FormInputComponent, OnInit {
    static readonly id: DefaultFormComponentId = 'colorpicker-form-input';
    readonly: boolean;
    formControl: FormControl;
    color: string;
    config: DefaultFormComponentConfig<'colorpicker-form-input'>;

    ngOnInit() {
        this.color = this.formControl.value;
    }

    updateColor(color: string) {
        this.color = color;
        this.formControl.patchValue(color);
        this.formControl.markAsDirty();
    }

    get prefix() {
        return this.config.ui?.prefix || this.config.prefix;
    }

    get suffix() {
        return this.config.ui?.suffix || this.config.suffix;
    }
}
