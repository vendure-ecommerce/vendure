import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseListComponent,
    DataService,
    GetActiveChannel,
    GetShippingMethodList,
    LanguageCode,
    ModalService,
    NotificationService,
    ServerConfigService,
    ShippingMethodQuote,
    TestEligibleShippingMethodsInput,
} from '@vendure/admin-ui/core';
import { EMPTY, Observable, Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { TestAddress } from '../test-address-form/test-address-form.component';
import { TestOrderLine } from '../test-order-builder/test-order-builder.component';

@Component({
    selector: 'vdr-shipping-method-list',
    templateUrl: './shipping-method-list.component.html',
    styleUrls: ['./shipping-method-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShippingMethodListComponent
    extends BaseListComponent<GetShippingMethodList.Query, GetShippingMethodList.Items>
    implements OnInit {
    activeChannel$: Observable<GetActiveChannel.ActiveChannel>;
    testAddress: TestAddress;
    testOrderLines: TestOrderLine[];
    testDataUpdated = false;
    testResult$: Observable<ShippingMethodQuote[] | undefined>;
    availableLanguages$: Observable<LanguageCode[]>;
    contentLanguage$: Observable<LanguageCode>;
    private fetchTestResult$ = new Subject<[TestAddress, TestOrderLine[]]>();

    constructor(
        private modalService: ModalService,
        private notificationService: NotificationService,
        private dataService: DataService,
        private serverConfigService: ServerConfigService,
        router: Router,
        route: ActivatedRoute,
    ) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) =>
                this.dataService.shippingMethod.getShippingMethods(...args).refetchOnChannelChange(),
            data => data.shippingMethods,
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
            .mapStream(({ uiState }) => uiState.contentLanguage)
            .pipe(tap(() => this.refresh()));
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
