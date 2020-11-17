import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseListComponent,
    DataService,
    GetOrderList,
    ServerConfigService,
    SortOrder,
} from '@vendure/admin-ui/core';
import { merge, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, skip, takeUntil } from 'rxjs/operators';

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
                states: this.orderStates.filter(s => s !== 'Delivered' && s !== 'Cancelled' && s !== 'Shipped'),
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
                    this.searchTerm.value,
                    this.route.snapshot.queryParamMap.get('filter') || 'open',
                ),
        );
    }

    ngOnInit() {
        super.ngOnInit();
        this.activePreset$ = this.route.queryParamMap.pipe(
            map(qpm => qpm.get('filter') || 'open'),
            distinctUntilChanged(),
        );
        merge(this.searchTerm.valueChanges, this.activePreset$.pipe(skip(1)))
            .pipe(debounceTime(250), takeUntil(this.destroy$))
            .subscribe(() => this.refresh());
        this.customFilterForm = new FormGroup({
            states: new FormControl([]),
            placedAtStart: new FormControl(),
            placedAtEnd: new FormControl(),
        });
    }

    selectFilterPreset(presetName: string) {
        this.setQueryParam(
            {
                filter: presetName,
                page: 1,
            },
            true,
        );
    }

    applyCustomFilters() {
        this.customFilterForm.markAsPristine();
        this.refresh();
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
            const formValue = this.customFilterForm?.value ?? {};
            if (formValue.states?.length) {
                filter.state = {
                    in: formValue.states,
                };
            }
            if (formValue.placedAtStart && formValue.placedAtEnd) {
                filter.orderPlacedAt = {
                    between: {
                        start: formValue.placedAtStart,
                        end: formValue.placedAtEnd,
                    },
                };
            } else if (formValue.placedAtStart) {
                filter.orderPlacedAt = {
                    after: formValue.placedAtStart,
                };
            } else if (formValue.placedAtEnd) {
                filter.orderPlacedAt = {
                    before: formValue.placedAtEnd,
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
