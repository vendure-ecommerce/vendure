import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseListComponent,
    DataService,
    DataTableService,
    GetShippingMethodListQuery,
    ItemOf,
    LanguageCode,
    NavBuilderService,
    ServerConfigService,
    ShippingMethodFilterParameter,
    ShippingMethodSortParameter,
} from '@vendure/admin-ui/core';
import { Observable } from 'rxjs';

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
    availableLanguages$: Observable<LanguageCode[]>;
    contentLanguage$: Observable<LanguageCode>;
    readonly customFields = this.serverConfigService.getCustomFieldsFor('ShippingMethod');
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
        .addCustomFieldFilters(this.customFields)
        .connectToRoute(this.route);

    readonly sorts = this.dataTableService
        .createSortCollection<ShippingMethodSortParameter>()
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
        private serverConfigService: ServerConfigService,
        private dataTableService: DataTableService,
    ) {
        super(router, route);
        navBuilderService.addActionBarItem({
            id: 'create-shipping-method',
            label: _('settings.create-new-shipping-method'),
            locationId: 'shipping-method-list',
            icon: 'plus',
            routerLink: ['./create'],
            requiresPermission: ['CreateSettings', 'CreateShippingMethod'],
        });
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
