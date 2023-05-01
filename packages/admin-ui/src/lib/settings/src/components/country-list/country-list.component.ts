import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseListComponent,
    CountryFilterParameter,
    CountrySortParameter,
    DataService,
    DataTableService,
    DeletionResult,
    GetCountryListQuery,
    ItemOf,
    LanguageCode,
    ModalService,
    NotificationService,
    ServerConfigService,
} from '@vendure/admin-ui/core';
import { EMPTY, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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
        .connectToRoute(this.route);

    readonly sorts = this.dataTableService
        .createSortCollection<CountrySortParameter>()
        .defaultSort('createdAt', 'DESC')
        .addSort({ name: 'createdAt' })
        .addSort({ name: 'updatedAt' })
        .addSort({ name: 'name' })
        .connectToRoute(this.route);

    constructor(
        private dataService: DataService,
        private notificationService: NotificationService,
        private modalService: ModalService,
        private serverConfigService: ServerConfigService,
        route: ActivatedRoute,
        router: Router,
        private dataTableService: DataTableService,
    ) {
        super(router, route);
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

    deleteCountry(countryId: string) {
        this.modalService
            .dialog({
                title: _('catalog.confirm-delete-country'),
                buttons: [
                    { type: 'secondary', label: _('common.cancel') },
                    { type: 'danger', label: _('common.delete'), returnValue: true },
                ],
            })
            .pipe(
                switchMap(response =>
                    response ? this.dataService.settings.deleteCountry(countryId) : EMPTY,
                ),
            )
            .subscribe(
                response => {
                    if (response.deleteCountry.result === DeletionResult.DELETED) {
                        this.notificationService.success(_('common.notify-delete-success'), {
                            entity: 'Country',
                        });
                        this.dataService.settings.getCountries(999, 0).single$.subscribe();
                    } else {
                        this.notificationService.error(response.deleteCountry.message || '');
                    }
                },
                err => {
                    this.notificationService.error(_('common.notify-delete-error'), {
                        entity: 'Country',
                    });
                },
            );
    }
}
