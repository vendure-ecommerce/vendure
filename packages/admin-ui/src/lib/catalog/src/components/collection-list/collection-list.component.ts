import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseListComponent,
    CollectionFilterParameter,
    CollectionSortParameter,
    DataService,
    DataTableService,
    GetCollectionListQuery,
    ItemOf,
    LanguageCode,
    ModalService,
    NotificationService,
    ServerConfigService,
} from '@vendure/admin-ui/core';
import { combineLatest, EMPTY, Observable, of } from 'rxjs';
import { distinctUntilChanged, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { CollectionOrderEvent } from '../collection-data-table/collection-data-table.component';

@Component({
    selector: 'vdr-collection-list',
    templateUrl: './collection-list.component.html',
    styleUrls: ['./collection-list.component.scss', './collection-list-common.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionListComponent
    extends BaseListComponent<GetCollectionListQuery, ItemOf<GetCollectionListQuery, 'collections'>>
    implements OnInit
{
    activeCollectionId$: Observable<string | null>;
    activeCollectionIndex$: Observable<number>;
    activeCollectionTitle$: Observable<string>;
    subCollections$: Observable<Array<ItemOf<GetCollectionListQuery, 'collections'>>>;
    availableLanguages$: Observable<LanguageCode[]>;
    contentLanguage$: Observable<LanguageCode>;
    expandedIds: string[] = [];
    readonly customFields = this.serverConfigService.getCustomFieldsFor('Collection');

    readonly filters = this.dataTableService
        .createFilterCollection<CollectionFilterParameter>()
        .addDateFilters()
        .addFilter({
            name: 'slug',
            label: _('common.slug'),
            type: { kind: 'text' },
            filterField: 'slug',
        })
        .connectToRoute(this.route);

    readonly sorts = this.dataTableService
        .createSortCollection<CollectionSortParameter>()
        .defaultSort('position', 'ASC')
        .addSort({ name: 'createdAt' })
        .addSort({ name: 'updatedAt' })
        .addSort({ name: 'name' })
        .addSort({ name: 'slug' })
        .addSort({ name: 'position' })
        .connectToRoute(this.route);

    constructor(
        private dataService: DataService,
        private notificationService: NotificationService,
        private modalService: ModalService,
        router: Router,
        route: ActivatedRoute,
        private serverConfigService: ServerConfigService,
        private changeDetectorRef: ChangeDetectorRef,
        private dataTableService: DataTableService,
    ) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) => this.dataService.collection.getCollections().refetchOnChannelChange(),
            data => data.collections,
            (skip, _take) => {
                const topLevelOnly =
                    this.searchTermControl.value === '' && this.filters.activeFilters.length === 0
                        ? true
                        : undefined;
                return {
                    options: {
                        skip,
                        take: _take,
                        filter: {
                            name: { contains: this.searchTermControl.value },
                            ...this.filters.createFilterInput(),
                        },
                        topLevelOnly,
                        sort: this.sorts.createSortInput(),
                    },
                };
            },
        );
    }

    ngOnInit() {
        super.ngOnInit();
        this.activeCollectionId$ = this.route.paramMap.pipe(
            map(pm => pm.get('contents')),
            distinctUntilChanged(),
        );
        const expandedIds$ = this.route.queryParamMap.pipe(
            map(qpm => qpm.get('expanded')),
            distinctUntilChanged(),
            map(ids => (ids ? ids.split(',') : [])),
        );
        expandedIds$.pipe(takeUntil(this.destroy$)).subscribe(ids => {
            this.expandedIds = ids;
        });
        this.subCollections$ = combineLatest(expandedIds$, this.refresh$).pipe(
            switchMap(([ids]) => {
                if (ids.length) {
                    return this.dataService.collection
                        .getCollections({
                            take: 999,
                            filter: {
                                parentId: { in: ids },
                            },
                        })
                        .mapStream(data => data.collections.items);
                } else {
                    return of([]);
                }
            }),
        );

        this.activeCollectionTitle$ = combineLatest(this.activeCollectionId$, this.items$).pipe(
            map(([id, collections]) => {
                if (id) {
                    const match = collections.find(c => c.id === id);
                    return match ? match.name : '';
                }
                return '';
            }),
        );
        this.activeCollectionIndex$ = combineLatest(this.activeCollectionId$, this.items$).pipe(
            map(([id, collections]) => (id ? collections.findIndex(c => c.id === id) : -1)),
        );
        this.availableLanguages$ = this.serverConfigService.getAvailableLanguages();
        this.contentLanguage$ = this.dataService.client
            .uiState()
            .mapStream(({ uiState }) => uiState.contentLanguage)
            .pipe(tap(() => this.refresh()));

        super.refreshListOnChanges(this.contentLanguage$, this.filters.valueChanges, this.sorts.valueChanges);
    }

    onRearrange(event: CollectionOrderEvent) {
        this.dataService.collection.moveCollection([event]).subscribe({
            next: () => {
                this.notificationService.success(_('common.notify-saved-changes'));
                this.refresh();
            },
            error: err => {
                this.notificationService.error(_('common.notify-save-changes-error'));
            },
        });
    }

    deleteCollection(id: string) {
        this.items$
            .pipe(
                take(1),
                map(items => -1 < items.findIndex(i => i.parentId === id)),
                switchMap(hasChildren =>
                    this.modalService.dialog({
                        title: _('catalog.confirm-delete-collection'),
                        body: hasChildren
                            ? _('catalog.confirm-delete-collection-and-children-body')
                            : undefined,
                        buttons: [
                            { type: 'secondary', label: _('common.cancel') },
                            { type: 'danger', label: _('common.delete'), returnValue: true },
                        ],
                    }),
                ),
                switchMap(response => (response ? this.dataService.collection.deleteCollection(id) : EMPTY)),
            )
            .subscribe(
                () => {
                    this.notificationService.success(_('common.notify-delete-success'), {
                        entity: 'Collection',
                    });
                    this.refresh();
                },
                err => {
                    this.notificationService.error(_('common.notify-delete-error'), {
                        entity: 'Collection',
                    });
                },
            );
    }

    closeContents() {
        const params = { ...this.route.snapshot.params };
        delete params.contents;
        this.router.navigate(['./', params], { relativeTo: this.route, queryParamsHandling: 'preserve' });
    }

    setLanguage(code: LanguageCode) {
        this.dataService.client.setContentLanguage(code).subscribe();
    }

    toggleExpanded(collection: ItemOf<GetCollectionListQuery, 'collections'>) {
        let expandedIds = this.expandedIds;
        if (!expandedIds.includes(collection.id)) {
            expandedIds.push(collection.id);
        } else {
            expandedIds = expandedIds.filter(id => id !== collection.id);
        }
        this.router.navigate(['./'], {
            queryParams: {
                expanded: expandedIds.filter(id => !!id).join(','),
            },
            queryParamsHandling: 'merge',
            relativeTo: this.route,
        });
    }
}
