import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseListComponent,
    DataService,
    GetCustomerListQuery,
    ItemOf,
    LogicalOperator,
    ModalService,
    NotificationService,
} from '@vendure/admin-ui/core';
import { SortOrder } from '@vendure/common/lib/generated-types';
import { EMPTY } from 'rxjs';
import { debounceTime, filter, switchMap, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'vdr-customer-list',
    templateUrl: './customer-list.component.html',
    styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent
    extends BaseListComponent<GetCustomerListQuery, ItemOf<GetCustomerListQuery, 'customers'>>
    implements OnInit
{
    searchTerm = new UntypedFormControl('');
    constructor(
        private dataService: DataService,
        router: Router,
        route: ActivatedRoute,
        private modalService: ModalService,
        private notificationService: NotificationService,
    ) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) => this.dataService.customer.getCustomerList(...args).refetchOnChannelChange(),
            data => data.customers,
            (skip, take) => ({
                options: {
                    skip,
                    take,
                    filter: {
                        emailAddress: {
                            contains: this.searchTerm.value,
                        },
                        lastName: {
                            contains: this.searchTerm.value,
                        },
                        postalCode: {
                            contains: this.searchTerm.value,
                        },
                    },
                    filterOperator: LogicalOperator.OR,
                    sort: {
                        createdAt: SortOrder.DESC,
                    },
                },
            }),
        );
    }

    ngOnInit() {
        super.ngOnInit();
        this.searchTerm.valueChanges
            .pipe(
                filter(value => 2 < value.length || value.length === 0),
                debounceTime(250),
                takeUntil(this.destroy$),
            )
            .subscribe(() => this.refresh());
    }

    deleteCustomer(customer: ItemOf<GetCustomerListQuery, 'customers'>) {
        return this.modalService
            .dialog({
                title: _('catalog.confirm-delete-customer'),
                body: `${customer.firstName} ${customer.lastName}`,
                buttons: [
                    { type: 'secondary', label: _('common.cancel') },
                    { type: 'danger', label: _('common.delete'), returnValue: true },
                ],
            })
            .pipe(switchMap(res => (res ? this.dataService.customer.deleteCustomer(customer.id) : EMPTY)))
            .subscribe(
                () => {
                    this.notificationService.success(_('common.notify-delete-success'), {
                        entity: 'Customer',
                    });
                    this.refresh();
                },
                err => {
                    this.notificationService.error(_('common.notify-delete-error'), {
                        entity: 'Customer',
                    });
                },
            );
    }
}
