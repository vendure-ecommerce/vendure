import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Customer } from 'shared/generated-types';
import { CustomFieldConfig } from 'shared/shared-types';

import { BaseDetailComponent } from '../../../common/base-detail.component';
import { ServerConfigService } from '../../../data/server-config';

@Component({
    selector: 'vdr-customer-detail',
    templateUrl: './customer-detail.component.html',
    styleUrls: ['./customer-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerDetailComponent extends BaseDetailComponent<Customer.Fragment>
    implements OnInit, OnDestroy {
    customerForm: FormGroup;
    customFields: CustomFieldConfig[];

    constructor(
        route: ActivatedRoute,
        router: Router,
        serverConfigService: ServerConfigService,
        private formBuilder: FormBuilder,
    ) {
        super(route, router, serverConfigService);

        this.customFields = this.getCustomFieldConfig('Customer');
        this.customerForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            customFields: this.formBuilder.group(
                this.customFields.reduce((hash, field) => ({ ...hash, [field.name]: '' }), {}),
            ),
        });
    }

    ngOnInit() {
        this.init();
    }

    ngOnDestroy() {
        this.destroy();
    }

    customFieldIsSet(name: string): boolean {
        return !!this.customerForm.get(['customFields', name]);
    }

    protected setFormValues(entity: Customer.Fragment): void {
        this.customerForm.patchValue({
            firstName: entity.firstName,
            lastName: entity.lastName,
        });

        if (this.customFields.length) {
            const customFieldsGroup = this.customerForm.get(['customFields']) as FormGroup;

            for (const fieldDef of this.customFields) {
                const key = fieldDef.name;
                const value = (entity as any).customFields[key];
                const control = customFieldsGroup.get(key);
                if (control) {
                    control.patchValue(value);
                }
            }
        }
    }
}
