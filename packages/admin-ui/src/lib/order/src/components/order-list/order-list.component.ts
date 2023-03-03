import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseListComponent,
    ChannelService,
    DataService,
    GetOrderListQuery,
    ItemOf,
    LocalStorageService,
    LogicalOperator,
    OrderFilterParameter,
    OrderListOptions,
    OrderType,
    ServerConfigService,
    SortOrder,
} from '@vendure/admin-ui/core';
import { Order } from '@vendure/common/lib/generated-types';
import { merge, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, takeUntil, tap } from 'rxjs/operators';

interface OrderFilterConfig {
    active?: boolean;
    states?: string[];
}

interface FilterPreset {
    name: string;
    label: string;
    config: OrderFilterConfig;
}

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
    searchControl = new FormControl('');
    searchOrderCodeControl = new FormControl('');
    searchLastNameControl = new FormControl('');
    customFilterForm: FormGroup;
    orderStates = this.serverConfigService.getOrderProcessStates().map(item => item.name);
    filterPresets: FilterPreset[] = [
        {
            name: 'open',
            label: _('order.filter-preset-open'),
            config: {
                active: false,
                states: this.orderStates.filter(
                    s => s !== 'Delivered' && s !== 'Cancelled' && s !== 'Shipped' && s !== 'Draft',
                ),
            },
        },
        {
            name: 'shipped',
            label: _('order.filter-preset-shipped'),
            config: {
                active: false,
                states: ['Shipped'],
            },
        },
        {
            name: 'completed',
            label: _('order.filter-preset-completed'),
            config: {
                active: false,
                states: ['Delivered', 'Cancelled'],
            },
        },
        {
            name: 'active',
            label: _('order.filter-preset-active'),
            config: {
                active: true,
            },
        },
        {
            name: 'draft',
            label: _('order.filter-preset-draft'),
            config: {
                active: false,
                states: ['Draft'],
            },
        },
    ];
    activePreset$: Observable<string>;
    canCreateDraftOrder = false;
    private activeChannelIsDefaultChannel = false;

    constructor(
        private serverConfigService: ServerConfigService,
        private dataService: DataService,
        private localStorageService: LocalStorageService,
        private channelService: ChannelService,
        router: Router,
        route: ActivatedRoute,
    ) {
        super(router, route);
        super.setQueryFn(
            // tslint:disable-next-line:no-shadowed-variable
            (take, skip) => this.dataService.order.getOrders({ take, skip }).refetchOnChannelChange(),
            data => data.orders,
            // tslint:disable-next-line:no-shadowed-variable
            (skip, take) =>
                this.createQueryOptions(
                    skip,
                    take,
                    this.searchControl.value,
                    this.route.snapshot.queryParamMap.get('filter') || 'open',
                ),
        );
        const lastFilters = this.localStorageService.get('orderListLastCustomFilters');
        if (lastFilters) {
            this.setQueryParam(lastFilters, { replaceUrl: true });
        }
        this.canCreateDraftOrder = !!this.serverConfigService
            .getOrderProcessStates()
            .find(state => state.name === 'Created')
            ?.to.includes('Draft');
        if (!this.canCreateDraftOrder) {
            this.filterPresets = this.filterPresets.filter(p => p.name !== 'draft');
        }
    }

    ngOnInit() {
        super.ngOnInit();
        this.activePreset$ = this.route.queryParamMap.pipe(
            map(qpm => qpm.get('filter') || 'open'),
            distinctUntilChanged(),
        );
        const searchTerms$ = merge(this.searchControl.valueChanges).pipe(
            filter(value => 2 < value.length || value.length === 0),
            debounceTime(250),
        );
        const isDefaultChannel$ = this.channelService.defaultChannelIsActive$.pipe(
            tap(isDefault => (this.activeChannelIsDefaultChannel = isDefault)),
        );
        merge(searchTerms$, isDefaultChannel$, this.route.queryParamMap)
            .pipe(debounceTime(50), takeUntil(this.destroy$))
            .subscribe(val => {
                this.refresh();
            });

        const queryParamMap = this.route.snapshot.queryParamMap;
        this.customFilterForm = new FormGroup({
            states: new FormControl(queryParamMap.getAll('states') ?? []),
            placedAtStart: new FormControl(queryParamMap.get('placedAtStart')),
            placedAtEnd: new FormControl(queryParamMap.get('placedAtEnd')),
        });
    }

    selectFilterPreset(presetName: string) {
        const lastCustomFilters = this.localStorageService.get('orderListLastCustomFilters') ?? {};
        const emptyCustomFilters = { states: undefined, placedAtStart: undefined, placedAtEnd: undefined };
        const filters = presetName === 'custom' ? lastCustomFilters : emptyCustomFilters;
        this.setQueryParam(
            {
                filter: presetName,
                page: 1,
                ...filters,
            },
            { replaceUrl: true },
        );
    }

    applyCustomFilters() {
        const formValue = this.customFilterForm.value;
        const customFilters = {
            states: formValue.states,
            placedAtStart: formValue.placedAtStart,
            placedAtEnd: formValue.placedAtEnd,
        };
        this.setQueryParam({
            filter: 'custom',
            ...customFilters,
        });
        this.customFilterForm.markAsPristine();
        this.localStorageService.set('orderListLastCustomFilters', customFilters);
    }

    private createQueryOptions(
        // tslint:disable-next-line:no-shadowed-variable
        skip: number,
        take: number,
        searchTerm: string,
        activeFilterPreset?: string,
    ): { options: OrderListOptions } {
        const filterConfig = this.filterPresets.find(p => p.name === activeFilterPreset);
        // tslint:disable-next-line:no-shadowed-variable
        let filter: OrderFilterParameter = {};
        let filterOperator: LogicalOperator = LogicalOperator.AND;
        if (filterConfig) {
            if (filterConfig.config.active != null) {
                filter.active = {
                    eq: filterConfig.config.active,
                };
            }
            if (filterConfig.config.states) {
                filter.state = {
                    in: filterConfig.config.states,
                };
            }
        } else if (activeFilterPreset === 'custom') {
            const queryParams = this.route.snapshot.queryParamMap;
            const states = queryParams.getAll('states') ?? [];
            const placedAtStart = queryParams.get('placedAtStart');
            const placedAtEnd = queryParams.get('placedAtEnd');
            if (states.length) {
                filter.state = {
                    in: states,
                };
            }
            if (placedAtStart && placedAtEnd) {
                filter.orderPlacedAt = {
                    between: {
                        start: placedAtStart,
                        end: placedAtEnd,
                    },
                };
            } else if (placedAtStart) {
                filter.orderPlacedAt = {
                    after: placedAtStart,
                };
            } else if (placedAtEnd) {
                filter.orderPlacedAt = {
                    before: placedAtEnd,
                };
            }
        }
        if (this.activeChannelIsDefaultChannel) {
            filter = {
                ...(filter ?? {}),
                type: {
                    notEq: OrderType.Seller,
                },
            };
        }
        if (searchTerm) {
            filter = {
                customerLastName: {
                    contains: searchTerm,
                },
                transactionId: {
                    contains: searchTerm,
                },
                code: {
                    contains: searchTerm,
                },
            };
            filterOperator = LogicalOperator.OR;
        }
        return {
            options: {
                skip,
                take,
                filter: {
                    ...(filter ?? {}),
                },
                sort: {
                    updatedAt: SortOrder.DESC,
                },
                filterOperator,
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
