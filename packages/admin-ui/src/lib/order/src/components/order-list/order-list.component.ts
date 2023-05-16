import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseListComponent,
    ChannelService,
    DataService,
    DataTableService,
    GetOrderListQuery,
    getOrderStateTranslationToken,
    ItemOf,
    LocalStorageService,
    NavBuilderService,
    OrderFilterParameter,
    OrderListOptions,
    OrderSortParameter,
    OrderType,
    ServerConfigService,
} from '@vendure/admin-ui/core';
import { Order } from '@vendure/common/lib/generated-types';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'vdr-order-list',
    templateUrl: './order-list.component.html',
    styleUrls: ['./order-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderListComponent
    extends BaseListComponent<GetOrderListQuery, ItemOf<GetOrderListQuery, 'orders'>>
    implements OnInit
{
    orderStates = this.serverConfigService.getOrderProcessStates().map(item => item.name);
    readonly customFields = this.serverConfigService.getCustomFieldsFor('Order');
    readonly filters = this.dataTableService
        .createFilterCollection<OrderFilterParameter>()
        .addDateFilters()
        .addFilter({
            name: 'active',
            type: { kind: 'boolean' },
            label: _('order.filter-is-active'),
            filterField: 'active',
        })
        .addFilter({
            name: 'totalWithTax',
            type: { kind: 'number', inputType: 'currency', currencyCode: 'USD' },
            label: _('order.total'),
            filterField: 'totalWithTax',
        })
        .addFilter({
            name: 'state',
            type: {
                kind: 'select',
                options: this.orderStates.map(s => ({ value: s, label: getOrderStateTranslationToken(s) })),
            },
            label: _('order.state'),
            filterField: 'state',
        })
        .addFilter({
            name: 'orderPlacedAt',
            type: { kind: 'dateRange' },
            label: _('order.placed-at'),
            filterField: 'orderPlacedAt',
        })
        .addFilter({
            name: 'customerLastName',
            type: { kind: 'text' },
            label: _('customer.last-name'),
            filterField: 'customerLastName',
        })
        .addFilter({
            name: 'transactionId',
            type: { kind: 'text' },
            label: _('order.transaction-id'),
            filterField: 'transactionId',
        })
        .addCustomFieldFilters(this.customFields)
        .connectToRoute(this.route);

    readonly sorts = this.dataTableService
        .createSortCollection<OrderSortParameter>()
        .defaultSort('updatedAt', 'DESC')
        .addSort({ name: 'createdAt' })
        .addSort({ name: 'updatedAt' })
        .addSort({ name: 'orderPlacedAt' })
        .addSort({ name: 'customerLastName' })
        .addSort({ name: 'state' })
        .addSort({ name: 'totalWithTax' })
        .addCustomFieldSorts(this.customFields)
        .connectToRoute(this.route);

    canCreateDraftOrder = false;
    private activeChannelIsDefaultChannel = false;

    constructor(
        private serverConfigService: ServerConfigService,
        private dataService: DataService,
        private localStorageService: LocalStorageService,
        private channelService: ChannelService,
        private dataTableService: DataTableService,
        navBuilderService: NavBuilderService,
        router: Router,
        route: ActivatedRoute,
    ) {
        super(router, route);
        navBuilderService.addActionBarItem({
            id: 'create-draft-order',
            label: _('catalog.create-draft-order'),
            locationId: 'order-list',
            icon: 'plus',
            routerLink: ['./draft/create'],
            requiresPermission: ['CreateOrder'],
        });
        super.setQueryFn(
            // eslint-disable-next-line @typescript-eslint/no-shadow
            (take, skip) => this.dataService.order.getOrders({ take, skip }).refetchOnChannelChange(),
            data => data.orders,
            // eslint-disable-next-line @typescript-eslint/no-shadow
            (skip, take) => this.createQueryOptions(skip, take, this.searchTermControl.value),
        );
        this.canCreateDraftOrder = !!this.serverConfigService
            .getOrderProcessStates()
            .find(state => state.name === 'Created')
            ?.to.includes('Draft');
    }

    ngOnInit() {
        super.ngOnInit();
        const isDefaultChannel$ = this.channelService.defaultChannelIsActive$.pipe(
            tap(isDefault => (this.activeChannelIsDefaultChannel = isDefault)),
        );
        super.refreshListOnChanges(this.filters.valueChanges, this.sorts.valueChanges, isDefaultChannel$);
    }

    private createQueryOptions(
        // eslint-disable-next-line @typescript-eslint/no-shadow
        skip: number,
        take: number,
        searchTerm: string | null,
    ): { options: OrderListOptions } {
        let filterInput = this.filters.createFilterInput();
        if (this.activeChannelIsDefaultChannel) {
            filterInput = {
                ...(filterInput ?? {}),
                type: {
                    notEq: OrderType.Seller,
                },
            };
        }
        if (searchTerm) {
            filterInput = {
                code: {
                    contains: searchTerm,
                },
            };
        }
        return {
            options: {
                skip,
                take,
                filter: {
                    ...(filterInput ?? {}),
                },
                sort: this.sorts.createSortInput(),
            },
        };
    }

    getShippingNames(order: Order) {
        if (order.shippingLines.length) {
            return order.shippingLines.map(shippingLine => shippingLine.shippingMethod.name).join(', ');
        } else {
            return '';
        }
    }
}
