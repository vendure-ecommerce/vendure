import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseListComponent,
    DataService,
    DataTableService,
    GetPaymentMethodListQuery,
    ItemOf,
    LanguageCode,
    NavBuilderService,
    PaymentMethodFilterParameter,
    PaymentMethodSortParameter,
    ServerConfigService,
} from '@vendure/admin-ui/core';
import { Observable } from 'rxjs';

@Component({
    selector: 'vdr-payment-method-list',
    templateUrl: './payment-method-list.component.html',
    styleUrls: ['./payment-method-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentMethodListComponent
    extends BaseListComponent<GetPaymentMethodListQuery, ItemOf<GetPaymentMethodListQuery, 'paymentMethods'>>
    implements OnInit
{
    availableLanguages$: Observable<LanguageCode[]>;
    contentLanguage$: Observable<LanguageCode>;
    readonly customFields = this.serverConfigService.getCustomFieldsFor('PaymentMethod');
    readonly filters = this.dataTableService
        .createFilterCollection<PaymentMethodFilterParameter>()
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
            name: 'enabled',
            type: { kind: 'boolean' },
            label: _('common.enabled'),
            filterField: 'enabled',
        })
        .addFilter({
            name: 'description',
            type: { kind: 'text' },
            label: _('common.description'),
            filterField: 'description',
        })
        .addCustomFieldFilters(this.customFields)
        .connectToRoute(this.route);

    readonly sorts = this.dataTableService
        .createSortCollection<PaymentMethodSortParameter>()
        .defaultSort('createdAt', 'DESC')
        .addSort({ name: 'createdAt' })
        .addSort({ name: 'updatedAt' })
        .addSort({ name: 'name' })
        .addSort({ name: 'code' })
        .addSort({ name: 'description' })
        .addCustomFieldSorts(this.customFields)
        .connectToRoute(this.route);

    constructor(
        router: Router,
        route: ActivatedRoute,
        navBuilderService: NavBuilderService,
        private dataService: DataService,
        private dataTableService: DataTableService,
        private serverConfigService: ServerConfigService,
    ) {
        super(router, route);
        navBuilderService.addActionBarItem({
            id: 'create-payment-method',
            label: _('settings.create-new-payment-method'),
            locationId: 'payment-method-list',
            icon: 'plus',
            routerLink: ['./create'],
            requiresPermission: ['CreateSettings', 'CreatePaymentMethod'],
        });
        super.setQueryFn(
            (...args: any[]) => this.dataService.settings.getPaymentMethods(...args).refetchOnChannelChange(),
            data => data.paymentMethods,
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
        this.availableLanguages$ = this.serverConfigService.getAvailableLanguages();
        this.contentLanguage$ = this.dataService.client
            .uiState()
            .mapStream(({ uiState }) => uiState.contentLanguage);

        super.refreshListOnChanges(this.contentLanguage$, this.filters.valueChanges, this.sorts.valueChanges);
    }

    setLanguage(code: LanguageCode) {
        this.dataService.client.setContentLanguage(code).subscribe();
    }
}
