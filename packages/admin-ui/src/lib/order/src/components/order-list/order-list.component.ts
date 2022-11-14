import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseListComponent,
    DataService,
    GetOrderList,
    LocalStorageService,
    LogicalOperator,
    ModalService,
    NotificationService,
    OrderDataService,
    OrderListOptions,
    ServerConfigService,
    SortOrder,
} from '@vendure/admin-ui/core';
import { Order } from '@vendure/common/lib/generated-types';
import { EMPTY, merge, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, takeUntil } from 'rxjs/operators';

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
    implements OnInit, OnDestroy
{
    refreshInterval: any;
    searchControl = new FormControl('');
    searchOrderCodeControl = new FormControl('');
    searchLastNameControl = new FormControl('');
    customFilterForm: FormGroup;
    orderStates = this.serverConfigService.getOrderProcessStates().map(item => item.name);
    filterPresets: FilterPreset[] = [
        {
            name: 'open', // have this show everything
            label: _('order.filter-preset-open'),
            config: {
                active: false,
                states: this.orderStates.filter(s => s !== 'Completed' && s !== 'Cancelled' && s !== 'Draft'),
            },
        },

        {
            name: 'completed',
            label: _('order.filter-preset-completed'),
            config: {
                states: ['Completed', 'Cancelled'],
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

    constructor(
        private serverConfigService: ServerConfigService,
        private dataService: DataService,
        private localStorageService: LocalStorageService,
        router: Router,
        route: ActivatedRoute,
        private modalService: ModalService,
        private notificationService: NotificationService,
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
        this.setItemsPerPage(50); // default to 50
        this.refreshInterval = setInterval(() => {
            this.refresh();
        }, 10000);
    }
    getNextState(order: Order) {
        const settledCashPayment = order.payments?.filter(
            p => p.state === 'Settled' && p.method === 'cash',
        )[0];
        if (order.state === 'PaymentSettled') {
            if (settledCashPayment) {
                return 'Completed';
            } else {
                return 'Received';
            }
        }
        if (order.state === 'Received') {
            return 'Processing';
        }
        if (order.state === 'Processing') {
            return 'ReadyToPickup';
        }
        if (order.state === 'ReadyToPickup') {
            if (order.shippingLines[0].shippingMethod.code === 'delivery') {
                return 'Delivering';
            }
            if (settledCashPayment) {
                return 'PaymentSettled';
            } else {
                return 'Completed';
            }
        }
        if (order.state === 'Delivering') {
            if (settledCashPayment) {
                return 'PaymentSettled';
            } else {
                return 'Completed';
            }
        }

        return 'Received';
    }
    toNextState(order: Order) {
        return this.modalService
            .dialog({
                title: `Proceed to ${this.getNextState(order)}?`,
                body: `Are you sure you want to proceed to '${this.getNextState(order)}'?`,
                buttons: [
                    { type: 'secondary', label: _('common.cancel') },
                    { type: 'primary', label: 'Confirm', returnValue: true },
                ],
            })
            .pipe(
                switchMap(async res => {
                    if (res) {
                        if (this.getNextState(order) === 'PaymentSettled') {
                            const settledCashPayment = order.payments?.filter(
                                p => p.state === 'Settled' && p.method === 'cash',
                            )[0];
                            if (settledCashPayment) {
                                await this.dataService.order
                                    .settlePayment(settledCashPayment?.id.toString())
                                    .toPromise();
                            }
                        }
                        await this.dataService.order
                            .transitionToState(order.id.toString(), this.getNextState(order))
                            .toPromise();
                        return true;
                    }
                    return EMPTY;
                }),
            )
            .subscribe(
                () => {
                    this.notificationService.success('Successfully Updated Order State');
                    this.refresh();
                },
                err => {
                    this.notificationService.error('Error Updating Order State');
                },
            );
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
        let filter: any = {};
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

    ngOnDestroy(): void {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
    }
}
