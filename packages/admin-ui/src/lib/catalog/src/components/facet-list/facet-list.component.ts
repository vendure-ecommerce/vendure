import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseListComponent,
    DataService,
    DeletionResult,
    GetFacetListQuery,
    ItemOf,
    LanguageCode,
    ModalService,
    NotificationService,
    SelectionManager,
    ServerConfigService,
} from '@vendure/admin-ui/core';
import { SortOrder } from '@vendure/common/lib/generated-types';
import { EMPTY, Observable } from 'rxjs';
import { debounceTime, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'vdr-facet-list',
    templateUrl: './facet-list.component.html',
    styleUrls: ['./facet-list.component.scss'],
})
export class FacetListComponent
    extends BaseListComponent<GetFacetListQuery, ItemOf<GetFacetListQuery, 'facets'>>
    implements OnInit
{
    filterTermControl = new UntypedFormControl('');
    availableLanguages$: Observable<LanguageCode[]>;
    contentLanguage$: Observable<LanguageCode>;
    readonly initialLimit = 3;
    displayLimit: { [id: string]: number } = {};
    selectionManager: SelectionManager<ItemOf<GetFacetListQuery, 'facets'>>;

    constructor(
        private dataService: DataService,
        private modalService: ModalService,
        private notificationService: NotificationService,
        private serverConfigService: ServerConfigService,
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
                            contains: this.filterTermControl.value,
                        },
                    },
                    sort: {
                        createdAt: SortOrder.DESC,
                    },
                },
            }),
        );
        this.selectionManager = new SelectionManager({
            multiSelect: true,
            itemsAreEqual: (a, b) => a.id === b.id,
            additiveMode: true,
        });
    }

    ngOnInit() {
        super.ngOnInit();
        this.availableLanguages$ = this.serverConfigService.getAvailableLanguages();
        this.contentLanguage$ = this.dataService.client
            .uiState()
            .mapStream(({ uiState }) => uiState.contentLanguage)
            .pipe(tap(() => this.refresh()));
        this.filterTermControl.valueChanges
            .pipe(
                filter(value => 2 <= value.length || value.length === 0),
                debounceTime(250),
                takeUntil(this.destroy$),
            )
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
