import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { CustomFieldConfig } from '../../../common/generated-types';

/**
 * This component renders the appropriate type of form input control based
 * on the "type" property of the provided CustomFieldConfig.
 */
@Component({
    selector: 'vdr-custom-field-control',
    templateUrl: './custom-field-control.component.html',
    styleUrls: ['./custom-field-control.component.scss'],
})
export class CustomFieldControlComponent implements OnInit {
    @Input('customFieldsFormGroup') formGroup: FormGroup;
    @Input() customField: CustomFieldConfig;
    @Input() showLabel = true;
    label: string;

    ngOnInit() {
        if (this.showLabel) {
            this.label = this.customField.name;
        }
    }
}
