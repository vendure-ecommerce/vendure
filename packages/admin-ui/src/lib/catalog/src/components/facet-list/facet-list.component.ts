import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseListComponent,
    DataService,
    DataTableService,
    FacetFilterParameter,
    FacetSortParameter,
    GetFacetListQuery,
    ItemOf,
    LanguageCode,
    ModalService,
    NotificationService,
    ServerConfigService,
} from '@vendure/admin-ui/core';
import { Observable } from 'rxjs';

@Component({
    selector: 'vdr-facet-list',
    templateUrl: './facet-list.component.html',
    styleUrls: ['./facet-list.component.scss'],
})
export class FacetListComponent
    extends BaseListComponent<GetFacetListQuery, ItemOf<GetFacetListQuery, 'facets'>>
    implements OnInit
{
    availableLanguages$: Observable<LanguageCode[]>;
    contentLanguage$: Observable<LanguageCode>;
    readonly initialLimit = 3;
    displayLimit: { [id: string]: number } = {};

    readonly filters = this.dataTableService
        .createFilterCollection<FacetFilterParameter>()
        .addDateFilters()
        .addFilter({
            name: 'visibility',
            type: { kind: 'boolean' },
            label: _('common.visibility'),
            toFilterInput: value => ({
                isPrivate: { eq: !value },
            }),
        })
        .connectToRoute(this.route);

    readonly sorts = this.dataTableService
        .createSortCollection<FacetSortParameter>()
        .defaultSort('createdAt', 'DESC')
        .addSort({ name: 'createdAt' })
        .addSort({ name: 'updatedAt' })
        .addSort({ name: 'name' })
        .addSort({ name: 'code' })
        .connectToRoute(this.route);

    constructor(
        private dataService: DataService,
        private modalService: ModalService,
        private notificationService: NotificationService,
        private serverConfigService: ServerConfigService,
        private dataTableService: DataTableService,
        router: Router,
        route: ActivatedRoute,
    ) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) => this.dataService.facet.getFacets(...args).refetchOnChannelChange(),
            data => data.facets,
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
        super.refreshListOnChanges(this.filters.valueChanges, this.sorts.valueChanges, this.contentLanguage$);
    }

    toggleDisplayLimit(facet: ItemOf<GetFacetListQuery, 'facets'>) {
        if (this.displayLimit[facet.id] === facet.values.length) {
            this.displayLimit[facet.id] = this.initialLimit;
        } else {
            this.displayLimit[facet.id] = facet.values.length;
        }
    }

    setLanguage(code: LanguageCode) {
        this.dataService.client.setContentLanguage(code).subscribe();
    }
}
