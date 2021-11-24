import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
    CreateCustomerGroupInput,
    CustomFieldConfig,
    Dialog,
    ServerConfigService,
    UpdateCustomerGroupInput,
} from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-customer-group-detail-dialog',
    templateUrl: './customer-group-detail-dialog.component.html',
    styleUrls: ['./customer-group-detail-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerGroupDetailDialogComponent implements Dialog<CreateCustomerGroupInput>, OnInit {
    group: { id?: string; name: string; customFields?: { [name: string]: any } };
    resolveWith: (result?: CreateCustomerGroupInput) => void;
    customFields: CustomFieldConfig[];
    form: FormGroup;

    constructor(private serverConfigService: ServerConfigService, private formBuilder: FormBuilder) {
        this.customFields = this.serverConfigService.getCustomFieldsFor('CustomerGroup');
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            name: [this.group.name, Validators.required],
            customFields: this.formBuilder.group(
                this.customFields.reduce((hash, field) => ({ ...hash, [field.name]: '' }), {}),
            ),
        });
        if (this.customFields.length) {
            const customFieldsGroup = this.form.get('customFields') as FormGroup;

            for (const fieldDef of this.customFields) {
                const key = fieldDef.name;
                const value = this.group.customFields?.[key];
                const control = customFieldsGroup.get(key);
                if (control) {
                    control.patchValue(value);
                }
            }
        }
    }

    cancel() {
        this.resolveWith();
    }

    save() {
        this.resolveWith(this.form.value);
    }
}
