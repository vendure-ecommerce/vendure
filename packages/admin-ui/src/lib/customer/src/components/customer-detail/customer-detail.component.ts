import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseDetailComponent,
    CreateAddressInput,
    CreateCustomerAddress,
    CreateCustomerAddressMutation,
    CreateCustomerInput,
    Customer,
    CustomFieldConfig,
    DataService,
    DeleteCustomerAddress,
    EditNoteDialogComponent,
    GetAvailableCountries,
    GetCustomer,
    GetCustomerHistory,
    GetCustomerQuery,
    HistoryEntry,
    ModalService,
    NotificationService,
    ServerConfigService,
    SortOrder,
    UpdateCustomer,
    UpdateCustomerAddress,
    UpdateCustomerAddressMutation,
    UpdateCustomerInput,
    UpdateCustomerMutation,
} from '@vendure/admin-ui/core';
import { assertNever, notNullOrUndefined } from '@vendure/common/lib/shared-utils';
import { EMPTY, forkJoin, from, Observable, Subject } from 'rxjs';
import {
    concatMap,
    filter,
    map,
    merge,
    mergeMap,
    shareReplay,
    startWith,
    switchMap,
    take,
} from 'rxjs/operators';

import { SelectCustomerGroupDialogComponent } from '../select-customer-group-dialog/select-customer-group-dialog.component';

type CustomerWithOrders = NonNullable<GetCustomerQuery['customer']>;

@Component({
    selector: 'vdr-customer-detail',
    templateUrl: './customer-detail.component.html',
    styleUrls: ['./customer-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerDetailComponent
    extends BaseDetailComponent<CustomerWithOrders>
    implements OnInit, OnDestroy
{
    detailForm: FormGroup;
    customFields: CustomFieldConfig[];
    addressCustomFields: CustomFieldConfig[];
    availableCountries$: Observable<GetAvailableCountries.Items[]>;
    orders$: Observable<GetCustomer.Items[]>;
    ordersCount$: Observable<number>;
    history$: Observable<GetCustomerHistory.Items[] | undefined>;
    fetchHistory = new Subject<void>();
    defaultShippingAddressId: string;
    defaultBillingAddressId: string;
    addressesToDeleteIds = new Set<string>();
    addressDefaultsUpdated = false;
    ordersPerPage = 10;
    currentOrdersPage = 1;
    private orderListUpdates$ = new Subject<CustomerWithOrders>();

    constructor(
        route: ActivatedRoute,
        router: Router,
        serverConfigService: ServerConfigService,
        private changeDetector: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        protected dataService: DataService,
        private modalService: ModalService,
        private notificationService: NotificationService,
    ) {
        super(route, router, serverConfigService, dataService);

        this.customFields = this.getCustomFieldConfig('Customer');
        this.addressCustomFields = this.getCustomFieldConfig('Address');
        this.detailForm = this.formBuilder.group({
            customer: this.formBuilder.group({
                title: '',
                firstName: ['', Validators.required],
                lastName: ['', Validators.required],
                phoneNumber: '',
                emailAddress: ['', [Validators.required, Validators.email]],
                password: '',
                customFields: this.formBuilder.group(
                    this.customFields.reduce((hash, field) => ({ ...hash, [field.name]: '' }), {}),
                ),
            }),
            addresses: new FormArray([]),
        });
    }

    ngOnInit() {
        this.init();
        this.availableCountries$ = this.dataService.settings
            .getAvailableCountries()
            .mapSingle(result => result.countries.items)
            .pipe(shareReplay(1));

        const customerWithUpdates$ = this.entity$.pipe(merge(this.orderListUpdates$));
        this.orders$ = customerWithUpdates$.pipe(map(customer => customer.orders.items));
        this.ordersCount$ = this.entity$.pipe(map(customer => customer.orders.totalItems));
        this.history$ = this.fetchHistory.pipe(
            startWith(null),
            switchMap(() => {
                return this.dataService.customer
                    .getCustomerHistory(this.id, {
                        sort: {
                            createdAt: SortOrder.DESC,
                        },
                    })
                    .mapStream(data => data.customer?.history.items);
            }),
        );
    }

    ngOnDestroy() {
        this.destroy();
        this.orderListUpdates$.complete();
    }

    getAddressFormControls(): FormControl[] {
        const formArray = this.detailForm.get(['addresses']) as FormArray;
        return formArray.controls as FormControl[];
    }

    setDefaultBillingAddressId(id: string) {
        this.defaultBillingAddressId = id;
        this.addressDefaultsUpdated = true;
    }

    setDefaultShippingAddressId(id: string) {
        this.defaultShippingAddressId = id;
        this.addressDefaultsUpdated = true;
    }

    toggleDeleteAddress(id: string) {
        if (this.addressesToDeleteIds.has(id)) {
            this.addressesToDeleteIds.delete(id);
        } else {
            this.addressesToDeleteIds.add(id);
        }
    }

    addAddress() {
        const addressFormArray = this.detailForm.get('addresses') as FormArray;
        const newAddress = this.formBuilder.group({
            fullName: '',
            company: '',
            streetLine1: ['', Validators.required],
            streetLine2: '',
            city: '',
            province: '',
            postalCode: '',
            countryCode: ['', Validators.required],
            phoneNumber: '',
            defaultShippingAddress: false,
            defaultBillingAddress: false,
        });
        if (this.addressCustomFields.length) {
            const customFieldsGroup = this.formBuilder.group({});
            for (const fieldDef of this.addressCustomFields) {
                customFieldsGroup.addControl(fieldDef.name, new FormControl(''));
            }
            newAddress.addControl('customFields', customFieldsGroup);
        }
        addressFormArray.push(newAddress);
    }

    setOrderItemsPerPage(itemsPerPage: number) {
        this.ordersPerPage = +itemsPerPage;
        this.fetchOrdersList();
    }

    setOrderCurrentPage(page: number) {
        this.currentOrdersPage = +page;
        this.fetchOrdersList();
    }

    create() {
        const customerForm = this.detailForm.get('customer');
        if (!customerForm) {
            return;
        }
        const formValue = customerForm.value;
        const customFields = customerForm.get('customFields')?.value;
        const customer: CreateCustomerInput = {
            title: formValue.title,
            emailAddress: formValue.emailAddress,
            firstName: formValue.firstName,
            lastName: formValue.lastName,
            phoneNumber: formValue.phoneNumber,
            customFields,
        };
        this.dataService.customer
            .createCustomer(customer, formValue.password)
            .subscribe(({ createCustomer }) => {
                switch (createCustomer.__typename) {
                    case 'Customer':
                        this.notificationService.success(_('common.notify-create-success'), {
                            entity: 'Customer',
                        });
                        if (createCustomer.emailAddress && !formValue.password) {
                            this.notificationService.notify({
                                message: _('customer.email-verification-sent'),
                                translationVars: { emailAddress: formValue.emailAddress },
                                type: 'info',
                                duration: 10000,
                            });
                        }
                        this.detailForm.markAsPristine();
                        this.addressDefaultsUpdated = false;
                        this.changeDetector.markForCheck();
                        this.router.navigate(['../', createCustomer.id], { relativeTo: this.route });
                        break;
                    case 'EmailAddressConflictError':
                        this.notificationService.error(createCustomer.message);
                }
            });
    }

    save() {
        this.entity$
            .pipe(
                take(1),
                mergeMap(({ id }) => {
                    const saveOperations: Array<
                        Observable<
                            | UpdateCustomer.UpdateCustomer
                            | CreateCustomerAddress.CreateCustomerAddress
                            | UpdateCustomerAddress.UpdateCustomerAddress
                            | DeleteCustomerAddress.DeleteCustomerAddress
                        >
                    > = [];
                    const customerForm = this.detailForm.get('customer');
                    if (customerForm && customerForm.dirty) {
                        const formValue = customerForm.value;
                        const customFields = customerForm.get('customFields')?.value;
                        const customer: UpdateCustomerInput = {
                            id,
                            title: formValue.title,
                            emailAddress: formValue.emailAddress,
                            firstName: formValue.firstName,
                            lastName: formValue.lastName,
                            phoneNumber: formValue.phoneNumber,
                            customFields,
                        };
                        saveOperations.push(
                            this.dataService.customer
                                .updateCustomer(customer)
                                .pipe(map(res => res.updateCustomer)),
                        );
                    }
                    const addressFormArray = this.detailForm.get('addresses') as FormArray;
                    if ((addressFormArray && addressFormArray.dirty) || this.addressDefaultsUpdated) {
                        for (const addressControl of addressFormArray.controls) {
                            if (addressControl.dirty || this.addressDefaultsUpdated) {
                                const address = addressControl.value;
                                const input: CreateAddressInput = {
                                    fullName: address.fullName,
                                    company: address.company,
                                    streetLine1: address.streetLine1,
                                    streetLine2: address.streetLine2,
                                    city: address.city,
                                    province: address.province,
                                    postalCode: address.postalCode,
                                    countryCode: address.countryCode,
                                    phoneNumber: address.phoneNumber,
                                    defaultShippingAddress: this.defaultShippingAddressId === address.id,
                                    defaultBillingAddress: this.defaultBillingAddressId === address.id,
                                    customFields: address.customFields,
                                };
                                if (!address.id) {
                                    saveOperations.push(
                                        this.dataService.customer
                                            .createCustomerAddress(id, input)
                                            .pipe(map(res => res.createCustomerAddress)),
                                    );
                                } else {
                                    if (this.addressesToDeleteIds.has(address.id)) {
                                        saveOperations.push(
                                            this.dataService.customer
                                                .deleteCustomerAddress(address.id)
                                                .pipe(map(res => res.deleteCustomerAddress)),
                                        );
                                    } else {
                                        saveOperations.push(
                                            this.dataService.customer
                                                .updateCustomerAddress({
                                                    ...input,
                                                    id: address.id,
                                                })
                                                .pipe(map(res => res.updateCustomerAddress)),
                                        );
                                    }
                                }
                            }
                        }
                    }
                    return forkJoin(saveOperations);
                }),
            )
            .subscribe(
                data => {
                    let notified = false;
                    for (const result of data) {
                        switch (result.__typename) {
                            case 'Customer':
                            case 'Address':
                            case 'Success':
                                if (!notified) {
                                    this.notificationService.success(_('common.notify-update-success'), {
                                        entity: 'Customer',
                                    });
                                    notified = true;
                                    this.detailForm.markAsPristine();
                                    this.addressDefaultsUpdated = false;
                                    this.changeDetector.markForCheck();
                                    this.fetchHistory.next();
                                    this.dataService.customer.getCustomer(this.id).single$.subscribe();
                                }
                                break;
                            case 'EmailAddressConflictError':
                                this.notificationService.error(result.message);
                                break;
                        }
                    }
                },
                err => {
                    this.notificationService.error(_('common.notify-update-error'), {
                        entity: 'Customer',
                    });
                },
            );
    }

    addToGroup() {
        this.modalService
            .fromComponent(SelectCustomerGroupDialogComponent, {
                size: 'md',
            })
            .pipe(
                switchMap(groupIds => (groupIds ? from(groupIds) : EMPTY)),
                concatMap(groupId => this.dataService.customer.addCustomersToGroup(groupId, [this.id])),
            )
            .subscribe({
                next: res => {
                    this.notificationService.success(_(`customer.add-customers-to-group-success`), {
                        customerCount: 1,
                        groupName: res.addCustomersToGroup.name,
                    });
                },
                complete: () => {
                    this.dataService.customer.getCustomer(this.id, { take: 0 }).single$.subscribe();
                    this.fetchHistory.next();
                },
            });
    }

    removeFromGroup(group: GetCustomer.Groups) {
        this.modalService
            .dialog({
                title: _('customer.confirm-remove-customer-from-group'),
                buttons: [
                    { type: 'secondary', label: _('common.cancel') },
                    { type: 'danger', label: _('common.delete'), returnValue: true },
                ],
            })
            .pipe(
                switchMap(response =>
                    response
                        ? this.dataService.customer.removeCustomersFromGroup(group.id, [this.id])
                        : EMPTY,
                ),
                switchMap(() => this.dataService.customer.getCustomer(this.id, { take: 0 }).single$),
            )
            .subscribe(result => {
                this.notificationService.success(_(`customer.remove-customers-from-group-success`), {
                    customerCount: 1,
                    groupName: group.name,
                });
                this.fetchHistory.next();
            });
    }

    addNoteToCustomer({ note }: { note: string }) {
        this.dataService.customer.addNoteToCustomer(this.id, note).subscribe(() => {
            this.fetchHistory.next();
            this.notificationService.success(_('common.notify-create-success'), {
                entity: 'Note',
            });
        });
    }

    updateNote(entry: HistoryEntry) {
        this.modalService
            .fromComponent(EditNoteDialogComponent, {
                closable: true,
                locals: {
                    displayPrivacyControls: false,
                    note: entry.data.note,
                },
            })
            .pipe(
                switchMap(result => {
                    if (result) {
                        return this.dataService.customer.updateCustomerNote({
                            noteId: entry.id,
                            note: result.note,
                        });
                    } else {
                        return EMPTY;
                    }
                }),
            )
            .subscribe(result => {
                this.fetchHistory.next();
                this.notificationService.success(_('common.notify-update-success'), {
                    entity: 'Note',
                });
            });
    }

    deleteNote(entry: HistoryEntry) {
        return this.modalService
            .dialog({
                title: _('common.confirm-delete-note'),
                body: entry.data.note,
                buttons: [
                    { type: 'secondary', label: _('common.cancel') },
                    { type: 'danger', label: _('common.delete'), returnValue: true },
                ],
            })
            .pipe(switchMap(res => (res ? this.dataService.customer.deleteCustomerNote(entry.id) : EMPTY)))
            .subscribe(() => {
                this.fetchHistory.next();
                this.notificationService.success(_('common.notify-delete-success'), {
                    entity: 'Note',
                });
            });
    }

    protected setFormValues(entity: CustomerWithOrders): void {
        const customerGroup = this.detailForm.get('customer');
        if (customerGroup) {
            customerGroup.patchValue({
                title: entity.title,
                firstName: entity.firstName,
                lastName: entity.lastName,
                phoneNumber: entity.phoneNumber,
                emailAddress: entity.emailAddress,
            });
        }

        if (entity.addresses) {
            const addressesArray = new FormArray([]);
            for (const address of entity.addresses) {
                const { customFields, ...rest } = address as any;
                const addressGroup = this.formBuilder.group({
                    ...rest,
                    countryCode: address.country.code,
                });
                addressesArray.push(addressGroup);
                if (address.defaultShippingAddress) {
                    this.defaultShippingAddressId = address.id;
                }
                if (address.defaultBillingAddress) {
                    this.defaultBillingAddressId = address.id;
                }

                if (this.addressCustomFields.length) {
                    const customFieldsGroup = this.formBuilder.group({});
                    for (const fieldDef of this.addressCustomFields) {
                        const key = fieldDef.name;
                        const value = (address as any).customFields?.[key];
                        const control = new FormControl(value);
                        customFieldsGroup.addControl(key, control);
                    }
                    addressGroup.addControl('customFields', customFieldsGroup);
                }
            }
            this.detailForm.setControl('addresses', addressesArray);
        }

        if (this.customFields.length) {
            this.setCustomFieldFormValues(
                this.customFields,
                this.detailForm.get(['customer', 'customFields']),
                entity,
            );
        }
        this.changeDetector.markForCheck();
    }

    /**
     * Refetch the customer with the current order list settings.
     */
    private fetchOrdersList() {
        this.dataService.customer
            .getCustomer(this.id, {
                take: this.ordersPerPage,
                skip: (this.currentOrdersPage - 1) * this.ordersPerPage,
            })
            .single$.pipe(
                map(data => data.customer),
                filter(notNullOrUndefined),
            )
            .subscribe(result => this.orderListUpdates$.next(result));
    }
}
