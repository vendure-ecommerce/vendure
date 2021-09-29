import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseListComponent,
    DataService,
    GetCustomerList,
    ModalService,
    NotificationService,
} from '@vendure/admin-ui/core';
import { SortOrder } from '@vendure/common/lib/generated-shop-types';
import { EMPTY, merge } from 'rxjs';
import { debounceTime, filter, switchMap, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'vdr-customer-list',
    templateUrl: './customer-list.component.html',
    styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent
    extends BaseListComponent<GetCustomerList.Query, GetCustomerList.Items>
    implements OnInit {
    emailSearchTerm = new FormControl('');
    lastNameSearchTerm = new FormControl('');
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
                            contains: this.emailSearchTerm.value,
                        },
                        lastName: {
                            contains: this.lastNameSearchTerm.value,
                        },
                    },
                    sort: {
                        createdAt: SortOrder.DESC,
                    },
                },
            }),
        );
    }

    ngOnInit() {
        super.ngOnInit();
        merge(this.emailSearchTerm.valueChanges, this.lastNameSearchTerm.valueChanges)
            .pipe(
                filter(value => 2 < value.length || value.length === 0),
                debounceTime(250),
                takeUntil(this.destroy$),
            )
            .subscribe(() => this.refresh());
    }

    deleteCustomer(customer: GetCustomerList.Items) {
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
