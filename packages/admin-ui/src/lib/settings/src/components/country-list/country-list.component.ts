import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseListComponent,
    CountryFilterParameter,
    CountrySortParameter,
    DataService,
    DataTableService,
    GetCountryListQuery,
    ItemOf,
    LanguageCode,
    NavBuilderService,
    ServerConfigService,
} from '@vendure/admin-ui/core';
import { Observable } from 'rxjs';

@Component({
    selector: 'vdr-country-list',
    templateUrl: './country-list.component.html',
    styleUrls: ['./country-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryListComponent
    extends BaseListComponent<GetCountryListQuery, ItemOf<GetCountryListQuery, 'countries'>>
    implements OnInit
{
    availableLanguages$: Observable<LanguageCode[]>;
    contentLanguage$: Observable<LanguageCode>;

    readonly customFields = this.serverConfigService.getCustomFieldsFor('Region');
    readonly filters = this.dataTableService
        .createFilterCollection<CountryFilterParameter>()
        .addDateFilters()
        .addFilter({
            name: 'name',
            type: { kind: 'text' },
            label: _('common.name'),
            filterField: 'name',
        })
        .addFilter({
            name: 'enabled',
            type: { kind: 'boolean' },
            label: _('common.enabled'),
            filterField: 'enabled',
        })
        .addCustomFieldFilters(this.customFields)
        .connectToRoute(this.route);

    readonly sorts = this.dataTableService
        .createSortCollection<CountrySortParameter>()
        .defaultSort('createdAt', 'DESC')
        .addSort({ name: 'createdAt' })
        .addSort({ name: 'updatedAt' })
        .addSort({ name: 'name' })
        .addCustomFieldSorts(this.customFields)
        .connectToRoute(this.route);

    constructor(
        route: ActivatedRoute,
        router: Router,
        navBuilderService: NavBuilderService,
        private dataService: DataService,
        private serverConfigService: ServerConfigService,
        private dataTableService: DataTableService,
    ) {
        super(router, route);
        navBuilderService.addActionBarItem({
            id: 'create-country',
            label: _('settings.create-new-country'),
            locationId: 'country-list',
            icon: 'plus',
            routerLink: ['./create'],
            requiresPermission: ['CreateSettings', 'CreateCountry'],
        });
        super.setQueryFn(
            (...args: any[]) => this.dataService.settings.getCountries(...args).refetchOnChannelChange(),
            data => data.countries,
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
        this.contentLanguage$ = this.dataService.client
            .uiState()
            .mapStream(({ uiState }) => uiState.contentLanguage);
        this.availableLanguages$ = this.serverConfigService.getAvailableLanguages();

        super.refreshListOnChanges(this.filters.valueChanges, this.sorts.valueChanges, this.contentLanguage$);
    }

    setLanguage(code: LanguageCode) {
        this.dataService.client.setContentLanguage(code).subscribe();
    }
}
