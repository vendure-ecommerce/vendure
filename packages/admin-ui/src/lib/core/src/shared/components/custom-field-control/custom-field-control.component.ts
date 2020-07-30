import {
    AfterViewInit,
    Component,
    ComponentFactory,
    Input,
    OnInit,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { InputComponentConfig } from '../../../common/component-registry-types';
import { CustomFieldConfig, CustomFieldsFragment } from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';
import {
    CustomFieldComponentService,
    CustomFieldControl,
    CustomFieldEntityName,
} from '../../../providers/custom-field-component/custom-field-component.service';

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
    @Input() entityName: CustomFieldEntityName;
    @Input('customFieldsFormGroup') formGroup: FormGroup;
    @Input() customField: CustomFieldsFragment;
    @Input() compact = false;
    @Input() showLabel = true;
    @Input() readonly = false;
    hasCustomControl = false;
    @ViewChild('customComponentPlaceholder', { read: ViewContainerRef })
    private customComponentPlaceholder: ViewContainerRef;
    private customComponentFactory: ComponentFactory<CustomFieldControl> | undefined;

    constructor(
        private dataService: DataService,
        private customFieldComponentService: CustomFieldComponentService,
    ) {}

    getFieldDefinition(): CustomFieldConfig & { ui?: InputComponentConfig } {
        const config: CustomFieldsFragment & { ui?: InputComponentConfig } = {
            ...this.customField,
        };
        const id = this.customFieldComponentService.customFieldComponentExists(
            this.entityName,
            this.customField.name,
        );
        if (id) {
            config.ui = { component: id };
        }
        switch (config.__typename) {
            case 'IntCustomFieldConfig':
                return {
                    ...config,
                    min: config.intMin,
                    max: config.intMax,
                    step: config.intStep,
                };
            case 'FloatCustomFieldConfig':
                return {
                    ...config,
                    min: config.floatMin,
                    max: config.floatMax,
                    step: config.floatStep,
                };
            case 'DateTimeCustomFieldConfig':
                return {
                    ...config,
                    min: config.datetimeMin,
                    max: config.datetimeMax,
                    step: config.datetimeStep,
                };
            default:
                return {
                    ...config,
                };
        }
    }
}
