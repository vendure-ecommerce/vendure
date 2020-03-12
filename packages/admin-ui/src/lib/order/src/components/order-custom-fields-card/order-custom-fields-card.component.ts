import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { CustomFieldConfig } from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-order-custom-fields-card',
    templateUrl: './order-custom-fields-card.component.html',
    styleUrls: ['./order-custom-fields-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderCustomFieldsCardComponent implements OnInit {
    @Input() customFieldsConfig: CustomFieldConfig[] = [];
    @Input() customFieldValues: { [name: string]: any } = {};
    customFieldForm: FormGroup;
    constructor(private formBuilder: FormBuilder) {}

    ngOnInit() {
        this.customFieldForm = this.formBuilder.group({});
        for (const field of this.customFieldsConfig) {
            this.customFieldForm.addControl(
                field.name,
                this.formBuilder.control(this.customFieldValues[field.name]),
            );
        }
    }
}
