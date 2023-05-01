import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
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
    GetFacetListQuery,
    ItemOf,
    LanguageCode,
    ModalService,
    NotificationService,
    SelectionManager,
    SellerFilterParameter,
    SellerSortParameter,
    ServerConfigService,
} from '@vendure/admin-ui/core';
import { EMPTY, merge, Observable } from 'rxjs';
import { debounceTime, filter, switchMap, takeUntil } from 'rxjs/operators';

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
    searchTermControl = new FormControl('');
    selectionManager = new SelectionManager<ItemOf<GetFacetListQuery, 'facets'>>({
        multiSelect: true,
        itemsAreEqual: (a, b) => a.id === b.id,
        additiveMode: true,
    });
    availableLanguages$: Observable<LanguageCode[]>;
    contentLanguage$: Observable<LanguageCode>;

    readonly filters = this.dataTableService
        .createFilterCollection<CountryFilterParameter>()
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

        const searchTerm$ = this.searchTermControl.valueChanges.pipe(
            filter(value => value != null && (2 <= value.length || value.length === 0)),
            debounceTime(250),
        );
        merge(searchTerm$, this.filters.valueChanges, this.sorts.valueChanges)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.refresh());
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
