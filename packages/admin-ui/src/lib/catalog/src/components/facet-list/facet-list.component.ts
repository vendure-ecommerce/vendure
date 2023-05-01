import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseListComponent,
    DataService,
    DeletionResult,
    FacetFilterParameter,
    FacetSortParameter,
    GetFacetListQuery,
    getOrderStateTranslationToken,
    ItemOf,
    LanguageCode,
    ModalService,
    NotificationService,
    OrderFilterParameter,
    SelectionManager,
    ServerConfigService,
} from '@vendure/admin-ui/core';
import { SortOrder } from '@vendure/common/lib/generated-types';
import { EMPTY, merge, Observable } from 'rxjs';
import { debounceTime, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { DataTableService } from '../../../../core/src/providers/data-table/data-table.service';

@Component({
    selector: 'vdr-facet-list',
    templateUrl: './facet-list.component.html',
    styleUrls: ['./facet-list.component.scss'],
})
export class FacetListComponent
    extends BaseListComponent<GetFacetListQuery, ItemOf<GetFacetListQuery, 'facets'>>
    implements OnInit
{
    searchTermControl = new UntypedFormControl('');
    availableLanguages$: Observable<LanguageCode[]>;
    contentLanguage$: Observable<LanguageCode>;
    readonly initialLimit = 3;
    displayLimit: { [id: string]: number } = {};
    selectionManager = new SelectionManager<ItemOf<GetFacetListQuery, 'facets'>>({
        multiSelect: true,
        itemsAreEqual: (a, b) => a.id === b.id,
        additiveMode: true,
    });

    readonly filters = this.dataTableService
        .createFilterCollection<FacetFilterParameter>()
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
            .mapStream(({ uiState }) => uiState.contentLanguage)
            .pipe(tap(() => this.refresh()));
        const searchTerm$ = this.searchTermControl.valueChanges.pipe(
            filter(value => 2 <= value.length || value.length === 0),
            debounceTime(250),
        );
        merge(searchTerm$, this.filters.valueChanges, this.sorts.valueChanges)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.refresh());
    }

    toggleDisplayLimit(facet: ItemOf<GetFacetListQuery, 'facets'>) {
        if (this.displayLimit[facet.id] === facet.values.length) {
            this.displayLimit[facet.id] = this.initialLimit;
        } else {
            this.displayLimit[facet.id] = facet.values.length;
        }
    }

    deleteFacet(facetValueId: string) {
        this.showModalAndDelete(facetValueId)
            .pipe(
                switchMap(response => {
                    if (response.result === DeletionResult.DELETED) {
                        return [true];
                    } else {
                        return this.showModalAndDelete(facetValueId, response.message || '').pipe(
                            map(r => r.result === DeletionResult.DELETED),
                        );
                    }
                }),
                // Refresh the cached facets to reflect the changes
                switchMap(() => this.dataService.facet.getAllFacets().single$),
            )
            .subscribe(
                () => {
                    this.notificationService.success(_('common.notify-delete-success'), {
                        entity: 'FacetValue',
                    });
                    this.refresh();
                },
                err => {
                    this.notificationService.error(_('common.notify-delete-error'), {
                        entity: 'FacetValue',
                    });
                },
            );
    }

    setLanguage(code: LanguageCode) {
        this.dataService.client.setContentLanguage(code).subscribe();
    }

    private showModalAndDelete(facetId: string, message?: string) {
        return this.modalService
            .dialog({
                title: _('catalog.confirm-delete-facet'),
                body: message,
                buttons: [
                    { type: 'secondary', label: _('common.cancel') },
                    {
                        type: 'danger',
                        label: message ? _('common.force-delete') : _('common.delete'),
                        returnValue: true,
                    },
                ],
            })
            .pipe(
                switchMap(res => (res ? this.dataService.facet.deleteFacet(facetId, !!message) : EMPTY)),
                map(res => res.deleteFacet),
            );
    }
}
