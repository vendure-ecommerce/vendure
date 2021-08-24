import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
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
import { combineLatest, EMPTY, Observable } from 'rxjs';
import { distinctUntilChanged, map, shareReplay, switchMap, take, tap } from 'rxjs/operators';

import { RearrangeEvent } from '../collection-tree/collection-tree.component';

@Component({
    selector: 'vdr-collection-list',
    templateUrl: './collection-list.component.html',
    styleUrls: ['./collection-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionListComponent implements OnInit, OnDestroy {
    activeCollectionId$: Observable<string | null>;
    activeCollectionTitle$: Observable<string>;
    items$: Observable<GetCollectionList.Items[]>;
    availableLanguages$: Observable<LanguageCode[]>;
    contentLanguage$: Observable<LanguageCode>;
    expandAll = false;
    private queryResult: QueryResult<any>;

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
    }

    ngOnDestroy() {
        this.queryResult.completed$.next();
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
        this.queryResult.ref.refetch();
    }
}
