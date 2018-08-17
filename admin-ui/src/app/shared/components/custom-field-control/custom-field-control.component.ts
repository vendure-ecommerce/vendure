import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { CustomFieldConfig } from '../../../../../../shared/shared-types';

/**
 * This component renders the appropriate type of form input control based
 * on the "type" property of the provided CustomFieldConfig.
 */
@Component({
    selector: 'vdr-custom-field-control',
    templateUrl: './custom-field-control.component.html',
    styleUrls: ['./custom-field-control.component.scss'],
})
export class CustomFieldControlComponent {
    @Input('customFieldsFormGroup') formGroup: FormGroup;
    @Input() customField: CustomFieldConfig;
}
