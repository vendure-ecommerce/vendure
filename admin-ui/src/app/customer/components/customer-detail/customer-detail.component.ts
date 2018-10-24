import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, mergeMap, take } from 'rxjs/operators';
import {
    CreateAdministratorInput,
    CreateCustomerInput,
    Customer,
    UpdateAdministratorInput,
    UpdateCustomerInput,
} from 'shared/generated-types';
import { CustomFieldConfig } from 'shared/shared-types';

import { BaseDetailComponent } from '../../../common/base-detail.component';
import { _ } from '../../../core/providers/i18n/mark-for-extraction';
import { NotificationService } from '../../../core/providers/notification/notification.service';
import { DataService } from '../../../data/providers/data.service';
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
        private changeDetector: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private dataService: DataService,
        private notificationService: NotificationService,
    ) {
        super(route, router, serverConfigService);

        this.customFields = this.getCustomFieldConfig('Customer');
        this.customerForm = this.formBuilder.group({
            title: '',
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            phoneNumber: '',
            emailAddress: '',
            password: '',
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

    create() {
        const formValue = this.customerForm.value;
        const customer: CreateCustomerInput = {
            title: formValue.title,
            emailAddress: formValue.emailAddress,
            firstName: formValue.firstName,
            lastName: formValue.lastName,
        };
        this.dataService.customer.createCustomer(customer, formValue.password).subscribe(
            data => {
                this.notificationService.success(_('common.notify-create-success'), {
                    entity: 'Customer',
                });
                this.customerForm.markAsPristine();
                this.changeDetector.markForCheck();
                this.router.navigate(['../', data.createCustomer.id], { relativeTo: this.route });
            },
            err => {
                this.notificationService.error(_('common.notify-create-error'), {
                    entity: 'Customer',
                });
            },
        );
    }

    save() {
        this.entity$
            .pipe(
                take(1),
                mergeMap(({ id }) => {
                    const formValue = this.customerForm.value;
                    const customer: UpdateCustomerInput = {
                        id,
                        title: formValue.title,
                        emailAddress: formValue.emailAddress,
                        firstName: formValue.firstName,
                        lastName: formValue.lastName,
                    };
                    return this.dataService.customer.updateCustomer(customer);
                }),
            )
            .subscribe(
                data => {
                    this.notificationService.success(_('common.notify-update-success'), {
                        entity: 'Customer',
                    });
                    this.customerForm.markAsPristine();
                    this.changeDetector.markForCheck();
                },
                err => {
                    this.notificationService.error(_('common.notify-update-error'), {
                        entity: 'Customer',
                    });
                },
            );
    }

    protected setFormValues(entity: Customer.Fragment): void {
        this.customerForm.patchValue({
            title: entity.title,
            firstName: entity.firstName,
            lastName: entity.lastName,
            phoneNumber: entity.phoneNumber,
            emailAddress: entity.emailAddress,
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
