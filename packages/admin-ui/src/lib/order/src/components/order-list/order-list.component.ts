import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseListComponent,
    DataService,
    GetOrderList,
    LocalStorageService,
    OrderListOptions,
    ServerConfigService,
    SortOrder,
} from '@vendure/admin-ui/core';
import { Order } from '@vendure/common/lib/generated-types';
import { merge, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, skip, takeUntil, tap } from 'rxjs/operators';

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
    extends BaseListComponent<GetOrderList.Query, GetOrderList.Items>
    implements OnInit {
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
                    s => s !== 'Delivered' && s !== 'Cancelled' && s !== 'Shipped',
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
    ];
    activePreset$: Observable<string>;

    constructor(
        private serverConfigService: ServerConfigService,
        private dataService: DataService,
        private localStorageService: LocalStorageService,
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
                    this.searchOrderCodeControl.value,
                    this.searchLastNameControl.value,
                    this.route.snapshot.queryParamMap.get('filter') || 'open',
                ),
        );
        const lastFilters = this.localStorageService.get('orderListLastCustomFilters');
        if (lastFilters) {
            this.setQueryParam(lastFilters, { replaceUrl: true });
        }
    }

    ngOnInit() {
        super.ngOnInit();
        this.activePreset$ = this.route.queryParamMap.pipe(
            map(qpm => qpm.get('filter') || 'open'),
            distinctUntilChanged(),
        );
        const searchTerms$ = merge(
            this.searchOrderCodeControl.valueChanges,
            this.searchLastNameControl.valueChanges,
        ).pipe(
            filter(value => 2 < value.length || value.length === 0),
            debounceTime(250),
        );
        merge(searchTerms$, this.route.queryParamMap)
            .pipe(takeUntil(this.destroy$))
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
        orderCodeSearchTerm: string,
        customerNameSearchTerm: string,
        activeFilterPreset?: string,
    ): { options: OrderListOptions } {
        const filterConfig = this.filterPresets.find(p => p.name === activeFilterPreset);
        // tslint:disable-next-line:no-shadowed-variable
        const filter: any = {};
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
        return {
            options: {
                skip,
                take,
                filter: {
                    ...(filter ?? {}),
                    code: {
                        contains: orderCodeSearchTerm,
                    },
                    customerLastName: {
                        contains: customerNameSearchTerm,
                    },
                },
                sort: {
                    updatedAt: SortOrder.DESC,
                },
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
