import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseListComponent,
    ChannelService,
    DataService,
    FacetSortParameter,
    GetOrderListQuery,
    getOrderStateTranslationToken,
    ItemOf,
    LocalStorageService,
    LogicalOperator,
    OrderFilterParameter,
    OrderListOptions,
    OrderSortParameter,
    OrderType,
    ServerConfigService,
    SortOrder,
} from '@vendure/admin-ui/core';
import { Order } from '@vendure/common/lib/generated-types';
import { merge } from 'rxjs';
import { debounceTime, filter, takeUntil, tap } from 'rxjs/operators';
import { DataTableService } from '../../../../core/src/providers/data-table/data-table.service';

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
    searchControl = new UntypedFormControl('');
    orderStates = this.serverConfigService.getOrderProcessStates().map(item => item.name);
    readonly filters = this.dataTableService
        .createFilterCollection<OrderFilterParameter>()
        .addFilter({
            name: 'createdAt',
            type: { kind: 'dateRange' },
            label: _('common.created-at'),
            toFilterInput: value => ({
                createdAt: value.dateOperators,
            }),
        })
        .addFilter({
            name: 'active',
            type: { kind: 'boolean' },
            label: _('order.filter-is-active'),
            toFilterInput: value => ({
                active: {
                    eq: value,
                },
            }),
        })
        .addFilter({
            name: 'totalWithTax',
            type: { kind: 'number', inputType: 'currency', currencyCode: 'USD' },
            label: _('order.total'),
            toFilterInput: value => ({
                totalWithTax: {
                    [value.operator]: +value.amount,
                },
            }),
        })
        .addFilter({
            name: 'state',
            type: {
                kind: 'select',
                options: this.orderStates.map(s => ({ value: s, label: getOrderStateTranslationToken(s) })),
            },
            label: _('order.state'),
            toFilterInput: value => ({
                state: {
                    in: value,
                },
            }),
        })
        .addFilter({
            name: 'orderPlacedAt',
            type: {
                kind: 'dateRange',
            },
            label: _('order.placed-at'),
            toFilterInput: value => ({
                orderPlacedAt: value.dateOperators,
            }),
        })
        .addFilter({
            name: 'customerLastName',
            type: { kind: 'text' },
            label: _('customer.last-name'),
            toFilterInput: value => ({
                customerLastName: {
                    [value.operator]: value.term,
                },
            }),
        })
        .addFilter({
            name: 'transactionId',
            type: { kind: 'text' },
            label: _('order.transaction-id'),
            toFilterInput: value => ({
                transactionId: {
                    [value.operator]: value.term,
                },
            }),
        })
        .connectToRoute(this.route);

    readonly sorts = this.dataTableService
        .createSortCollection<OrderSortParameter>()
        .defaultSort('updatedAt', 'DESC')
        .addSort({
            name: 'orderPlacedAt',
        })
        .addSort({
            name: 'customerLastName',
        })
        .addSort({
            name: 'state',
        })
        .addSort({
            name: 'totalWithTax',
        })
        .connectToRoute(this.route);

    canCreateDraftOrder = false;
    private activeChannelIsDefaultChannel = false;

    constructor(
        private serverConfigService: ServerConfigService,
        private dataService: DataService,
        private localStorageService: LocalStorageService,
        private channelService: ChannelService,
        private dataTableService: DataTableService,
        router: Router,
        route: ActivatedRoute,
    ) {
        super(router, route);
        super.setQueryFn(
            // eslint-disable-next-line @typescript-eslint/no-shadow
            (take, skip) => this.dataService.order.getOrders({ take, skip }).refetchOnChannelChange(),
            data => data.orders,
            // eslint-disable-next-line @typescript-eslint/no-shadow
            (skip, take) => this.createQueryOptions(skip, take, this.searchControl.value),
        );
        this.canCreateDraftOrder = !!this.serverConfigService
            .getOrderProcessStates()
            .find(state => state.name === 'Created')
            ?.to.includes('Draft');
    }

    ngOnInit() {
        super.ngOnInit();
        const lastFilters = this.localStorageService.get('orderListLastCustomFilters');
        if (lastFilters) {
            this.setQueryParam(lastFilters, { replaceUrl: true });
        }
        const searchTerms$ = merge(this.searchControl.valueChanges).pipe(
            filter(value => 2 < value.length || value.length === 0),
            debounceTime(250),
        );
        const isDefaultChannel$ = this.channelService.defaultChannelIsActive$.pipe(
            tap(isDefault => (this.activeChannelIsDefaultChannel = isDefault)),
        );
        merge(searchTerms$, isDefaultChannel$, this.route.queryParamMap, this.filters.valueChanges)
            .pipe(debounceTime(50), takeUntil(this.destroy$))
            .subscribe(val => {
                this.refresh();
            });

        const queryParamMap = this.route.snapshot.queryParamMap;
    }

    private createQueryOptions(
        // eslint-disable-next-line @typescript-eslint/no-shadow
        skip: number,
        take: number,
        searchTerm: string,
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
