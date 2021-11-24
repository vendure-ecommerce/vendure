import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateZoneInput, CustomFieldConfig, Dialog, ServerConfigService } from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-zone-detail-dialog',
    templateUrl: './zone-detail-dialog.component.html',
    styleUrls: ['./zone-detail-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZoneDetailDialogComponent implements Dialog<CreateZoneInput>, OnInit {
    zone: { id?: string; name: string; customFields?: { [name: string]: any } };
    resolveWith: (result?: CreateZoneInput) => void;

    customFields: CustomFieldConfig[];
    form: FormGroup;

    constructor(private serverConfigService: ServerConfigService, private formBuilder: FormBuilder) {
        this.customFields = this.serverConfigService.getCustomFieldsFor('CustomerGroup');
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            name: [this.zone.name, Validators.required],
            customFields: this.formBuilder.group(
                this.customFields.reduce((hash, field) => ({ ...hash, [field.name]: '' }), {}),
            ),
        });
        if (this.customFields.length) {
            const customFieldsGroup = this.form.get('customFields') as FormGroup;

            for (const fieldDef of this.customFields) {
                const key = fieldDef.name;
                const value = this.zone.customFields?.[key];
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
