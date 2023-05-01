import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseListComponent,
    DataService,
    DataTableService,
    GetActiveChannelQuery,
    GetFacetListQuery,
    GetShippingMethodListQuery,
    ItemOf,
    LanguageCode,
    ModalService,
    NotificationService,
    SelectionManager,
    ServerConfigService,
    ShippingMethodFilterParameter,
    ShippingMethodQuote,
    ShippingMethodSortParameter,
    TestEligibleShippingMethodsInput,
} from '@vendure/admin-ui/core';
import { EMPTY, merge, Observable, Subject } from 'rxjs';
import { debounceTime, filter, switchMap, takeUntil } from 'rxjs/operators';

import { TestAddress } from '../test-address-form/test-address-form.component';
import { TestOrderLine } from '../test-order-builder/test-order-builder.component';

@Component({
    selector: 'vdr-shipping-method-list',
    templateUrl: './shipping-method-list.component.html',
    styleUrls: ['./shipping-method-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShippingMethodListComponent
    extends BaseListComponent<
        GetShippingMethodListQuery,
        ItemOf<GetShippingMethodListQuery, 'shippingMethods'>
    >
    implements OnInit
{
    activeChannel$: Observable<GetActiveChannelQuery['activeChannel']>;
    testAddress: TestAddress;
    testOrderLines: TestOrderLine[];
    testDataUpdated = false;
    testResult$: Observable<ShippingMethodQuote[] | undefined>;
    availableLanguages$: Observable<LanguageCode[]>;
    contentLanguage$: Observable<LanguageCode>;
    private fetchTestResult$ = new Subject<[TestAddress, TestOrderLine[]]>();
    searchTermControl = new FormControl('');
    selectionManager = new SelectionManager<ItemOf<GetFacetListQuery, 'facets'>>({
        multiSelect: true,
        itemsAreEqual: (a, b) => a.id === b.id,
        additiveMode: true,
    });
    readonly filters = this.dataTableService
        .createFilterCollection<ShippingMethodFilterParameter>()
        .addFilter({
            name: 'createdAt',
            type: { kind: 'dateRange' },
            label: _('common.created-at'),
            filterField: 'createdAt',
        })
        .addFilter({
            name: 'updatedAt',
            type: { kind: 'dateRange' },
            label: _('common.updated-at'),
            filterField: 'updatedAt',
        })
        .addFilter({
            name: 'name',
            type: { kind: 'text' },
            label: _('common.name'),
            filterField: 'name',
        })
        .addFilter({
            name: 'code',
            type: { kind: 'text' },
            label: _('common.code'),
            filterField: 'code',
        })
        .addFilter({
            name: 'description',
            type: { kind: 'text' },
            label: _('common.description'),
            filterField: 'description',
        })
        .connectToRoute(this.route);

    readonly sorts = this.dataTableService
        .createSortCollection<ShippingMethodSortParameter>()
        .defaultSort('createdAt', 'DESC')
        .addSort({ name: 'createdAt' })
        .addSort({ name: 'updatedAt' })
        .addSort({ name: 'name' })
        .addSort({ name: 'code' })
        .addSort({ name: 'description' })
        .connectToRoute(this.route);

    constructor(
        private modalService: ModalService,
        private notificationService: NotificationService,
        private dataService: DataService,
        private serverConfigService: ServerConfigService,
        router: Router,
        route: ActivatedRoute,
        private dataTableService: DataTableService,
    ) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) =>
                this.dataService.shippingMethod.getShippingMethods(...args).refetchOnChannelChange(),
            data => data.shippingMethods,
            (skip, take) => ({
                options: {
                    skip,
                    take,
                    filter: {
                        name: {
                            contains: this.searchTermControl.value,
                        },
                        ...this.filters.createFilterInput(),
                    },
                    sort: this.sorts.createSortInput(),
                },
            }),
        );
    }

    ngOnInit() {
        super.ngOnInit();
        this.testResult$ = this.fetchTestResult$.pipe(
            switchMap(([address, lines]) => {
                const input: TestEligibleShippingMethodsInput = {
                    shippingAddress: { ...address, streetLine1: 'test' },
                    lines: lines.map(l => ({ productVariantId: l.id, quantity: l.quantity })),
                };
                return this.dataService.shippingMethod
                    .testEligibleShippingMethods(input)
                    .mapSingle(result => result.testEligibleShippingMethods);
            }),
        );
        this.activeChannel$ = this.dataService.settings
            .getActiveChannel()
            .mapStream(data => data.activeChannel);
        this.availableLanguages$ = this.serverConfigService.getAvailableLanguages();

        const searchTerm$ = this.searchTermControl.valueChanges.pipe(
            filter(value => value != null && (2 <= value.length || value.length === 0)),
            debounceTime(250),
        );
        this.contentLanguage$ = this.dataService.client
            .uiState()
            .mapStream(({ uiState }) => uiState.contentLanguage);
        merge(searchTerm$, this.contentLanguage$, this.filters.valueChanges, this.sorts.valueChanges)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.refresh());
    }

    deleteShippingMethod(id: string) {
        this.modalService
            .dialog({
                title: _('catalog.confirm-delete-shipping-method'),
                buttons: [
                    { type: 'secondary', label: _('common.cancel') },
                    { type: 'danger', label: _('common.delete'), returnValue: true },
                ],
            })
            .pipe(
                switchMap(response =>
                    response ? this.dataService.shippingMethod.deleteShippingMethod(id) : EMPTY,
                ),
            )
            .subscribe(
                () => {
                    this.notificationService.success(_('common.notify-delete-success'), {
                        entity: 'ShippingMethod',
                    });
                    this.refresh();
                },
                err => {
                    this.notificationService.error(_('common.notify-delete-error'), {
                        entity: 'ShippingMethod',
                    });
                },
            );
    }

    setTestOrderLines(event: TestOrderLine[]) {
        this.testOrderLines = event;
        this.testDataUpdated = true;
    }

    setTestAddress(event: TestAddress) {
        this.testAddress = event;
        this.testDataUpdated = true;
    }

    allTestDataPresent(): boolean {
        return !!(this.testAddress && this.testOrderLines && this.testOrderLines.length);
    }

    runTest() {
        this.fetchTestResult$.next([this.testAddress, this.testOrderLines]);
        this.testDataUpdated = false;
    }

    setLanguage(code: LanguageCode) {
        this.dataService.client.setContentLanguage(code).subscribe();
    }
}
