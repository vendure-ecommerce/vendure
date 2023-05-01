import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseListComponent,
    CustomerFilterParameter,
    CustomerSortParameter,
    DataService,
    DataTableService,
    GetCustomerListQuery,
    ItemOf,
    LogicalOperator,
    ModalService,
    NotificationService,
} from '@vendure/admin-ui/core';
import { EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
    selector: 'vdr-customer-list',
    templateUrl: './customer-list.component.html',
    styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent
    extends BaseListComponent<GetCustomerListQuery, ItemOf<GetCustomerListQuery, 'customers'>>
    implements OnInit
{
    readonly filters = this.dataTableService
        .createFilterCollection<CustomerFilterParameter>()
        .addDateFilters()
        .addFilter({
            name: 'firstName',
            type: { kind: 'text' },
            label: _('customer.first-name'),
            filterField: 'firstName',
        })
        .addFilter({
            name: 'lastName',
            type: { kind: 'text' },
            label: _('customer.last-name'),
            filterField: 'lastName',
        })
        .addFilter({
            name: 'emailAddress',
            type: { kind: 'text' },
            label: _('customer.email-address'),
            filterField: 'emailAddress',
        })
        .connectToRoute(this.route);

    readonly sorts = this.dataTableService
        .createSortCollection<CustomerSortParameter>()
        .defaultSort('createdAt', 'DESC')
        .addSort({ name: 'createdAt' })
        .addSort({ name: 'updatedAt' })
        .addSort({ name: 'lastName' })
        .addSort({ name: 'emailAddress' })
        .connectToRoute(this.route);

    constructor(
        private dataService: DataService,
        router: Router,
        route: ActivatedRoute,
        private modalService: ModalService,
        private notificationService: NotificationService,
        private dataTableService: DataTableService,
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
                            contains: this.searchTermControl.value,
                        },
                        lastName: {
                            contains: this.searchTermControl.value,
                        },
                        postalCode: {
                            contains: this.searchTermControl.value,
                        },
                        ...this.filters.createFilterInput(),
                    },
                    filterOperator: this.searchTermControl.value ? LogicalOperator.OR : LogicalOperator.AND,
                    sort: this.sorts.createSortInput(),
                },
            }),
        );
    }

    ngOnInit() {
        super.ngOnInit();
        super.refreshListOnChanges(this.filters.valueChanges, this.sorts.valueChanges);
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
