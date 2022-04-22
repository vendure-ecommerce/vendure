import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    DataService,
    GetCollectionList,
    LanguageCode,
    ModalService,
    NotificationService,
    QueryResult,
    ServerConfigService,
} from '@vendure/admin-ui/core';
import { combineLatest, EMPTY, Observable, Subject } from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    map,
    shareReplay,
    switchMap,
    take,
    takeUntil,
    tap,
} from 'rxjs/operators';

import { RearrangeEvent } from '../collection-tree/collection-tree.component';

@Component({
    selector: 'vdr-collection-list',
    templateUrl: './collection-list.component.html',
    styleUrls: ['./collection-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionListComponent implements OnInit, OnDestroy {
    filterTermControl = new FormControl('');
    activeCollectionId$: Observable<string | null>;
    activeCollectionTitle$: Observable<string>;
    items$: Observable<GetCollectionList.Items[]>;
    availableLanguages$: Observable<LanguageCode[]>;
    contentLanguage$: Observable<LanguageCode>;
    expandAll = false;
    expandedIds: string[] = [];
    private queryResult: QueryResult<any>;
    private destroy$ = new Subject<void>();

    constructor(
        private dataService: DataService,
        private notificationService: NotificationService,
        private modalService: ModalService,
        private router: Router,
        private route: ActivatedRoute,
        private serverConfigService: ServerConfigService,
    ) {}

    ngOnInit() {
        this.queryResult = this.dataService.collection.getCollections(1000, 0).refetchOnChannelChange();
        this.items$ = this.queryResult.mapStream(data => data.collections.items).pipe(shareReplay(1));
        this.activeCollectionId$ = this.route.paramMap.pipe(
            map(pm => pm.get('contents')),
            distinctUntilChanged(),
        );
        this.expandedIds = this.route.snapshot.queryParamMap.get('expanded')?.split(',') ?? [];
        this.expandAll = this.route.snapshot.queryParamMap.get('expanded') === 'all';

        this.activeCollectionTitle$ = combineLatest(this.activeCollectionId$, this.items$).pipe(
            map(([id, collections]) => {
                if (id) {
                    const match = collections.find(c => c.id === id);
                    return match ? match.name : '';
                }
                return '';
            }),
        );
        this.availableLanguages$ = this.serverConfigService.getAvailableLanguages();
        this.contentLanguage$ = this.dataService.client
            .uiState()
            .mapStream(({ uiState }) => uiState.contentLanguage)
            .pipe(tap(() => this.refresh()));

        this.filterTermControl.valueChanges
            .pipe(debounceTime(250), takeUntil(this.destroy$))
            .subscribe(term => {
                this.router.navigate(['./'], {
                    queryParams: {
                        q: term || undefined,
                    },
                    queryParamsHandling: 'merge',
                    relativeTo: this.route,
                });
            });

        this.route.queryParamMap
            .pipe(
                map(qpm => qpm.get('q')),
                distinctUntilChanged(),
                takeUntil(this.destroy$),
            )
            .subscribe(() => this.refresh());
        this.filterTermControl.patchValue(this.route.snapshot.queryParamMap.get('q'));
    }

    ngOnDestroy() {
        this.queryResult.completed$.next();
        this.destroy$.next(undefined);
        this.destroy$.complete();
    }

    toggleExpandAll() {
        this.router.navigate(['./'], {
            queryParams: {
                expanded: this.expandAll ? 'all' : undefined,
            },
            queryParamsHandling: 'merge',
            relativeTo: this.route,
        });
    }

    onRearrange(event: RearrangeEvent) {
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
                map(items => -1 < items.findIndex(i => i.parent && i.parent.id === id)),
                switchMap(hasChildren => {
                    return this.modalService.dialog({
                        title: _('catalog.confirm-delete-collection'),
                        body: hasChildren
                            ? _('catalog.confirm-delete-collection-and-children-body')
                            : undefined,
                        buttons: [
                            { type: 'secondary', label: _('common.cancel') },
                            { type: 'danger', label: _('common.delete'), returnValue: true },
                        ],
                    });
                }),
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

    private refresh() {
        const filterTerm = this.route.snapshot.queryParamMap.get('q');
        this.queryResult.ref.refetch({
            options: {
                skip: 0,
                take: 1000,
                ...(filterTerm
                    ? {
                          filter: {
                              name: {
                                  contains: filterTerm,
                              },
                          },
                      }
                    : {}),
            },
        });
    }
}
