import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseListComponent,
    DataService,
    GetOrderList,
    LocalStorageService,
    ServerConfigService,
    SortOrder,
} from '@vendure/admin-ui/core';
import { merge, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, skip, takeUntil, tap } from 'rxjs/operators';

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
    searchTerm = new FormControl('');
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
            (...args: any[]) => this.dataService.order.getOrders(...args).refetchOnChannelChange(),
            data => data.orders,
            // tslint:disable-next-line:no-shadowed-variable
            (skip, take) =>
                this.createQueryOptions(
                    skip,
                    take,
                    this.searchTerm.value,
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
        merge(this.searchTerm.valueChanges.pipe(debounceTime(250)), this.route.queryParamMap)
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

    // tslint:disable-next-line:no-shadowed-variable
    private createQueryOptions(skip: number, take: number, searchTerm: string, activeFilterPreset?: string) {
        const filterConfig = this.filterPresets.find(p => p.name === activeFilterPreset);
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
                        contains: searchTerm,
                    },
                },
                sort: {
                    updatedAt: SortOrder.DESC,
                },
            },
        };
    }
}
