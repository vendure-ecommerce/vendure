import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseListComponent,
    DataService,
    DataTableService,
    GetActiveChannelQuery,
    GetShippingMethodListQuery,
    ItemOf,
    LanguageCode,
    ServerConfigService,
    ShippingMethodFilterParameter,
    ShippingMethodQuote,
    ShippingMethodSortParameter,
    TestEligibleShippingMethodsInput,
} from '@vendure/admin-ui/core';
import { Observable, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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

    readonly filters = this.dataTableService
        .createFilterCollection<ShippingMethodFilterParameter>()
        .addDateFilters()
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
        router: Router,
        route: ActivatedRoute,
        private dataService: DataService,
        private serverConfigService: ServerConfigService,
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
        this.contentLanguage$ = this.dataService.client
            .uiState()
            .mapStream(({ uiState }) => uiState.contentLanguage);

        super.refreshListOnChanges(this.contentLanguage$, this.filters.valueChanges, this.sorts.valueChanges);
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
