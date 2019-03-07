import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    map,
    startWith,
    switchMap,
    takeUntil,
    tap,
} from 'rxjs/operators';
import { GetCollectionContents, GetCollectionList } from 'shared/generated-types';

import { BaseListComponent } from '../../../common/base-list.component';
import { _ } from '../../../core/providers/i18n/mark-for-extraction';
import { NotificationService } from '../../../core/providers/notification/notification.service';
import { DataService } from '../../../data/providers/data.service';
import { RearrangeEvent } from '../collection-tree/collection-tree.component';

@Component({
    selector: 'vdr-collection-list',
    templateUrl: './collection-list.component.html',
    styleUrls: ['./collection-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionListComponent
    extends BaseListComponent<GetCollectionList.Query, GetCollectionList.Items>
    implements OnInit {
    contents$: Observable<GetCollectionContents.Items[]>;
    contentsTotalItems$: Observable<number>;
    contentsItemsPerPage$: Observable<number>;
    contentsCurrentPage$: Observable<number>;
    activeCollectionId$: Observable<string | null>;
    activeCollectionTitle$: Observable<string>;
    filterTermControl = new FormControl('');

    constructor(
        private dataService: DataService,
        private notificationService: NotificationService,
        router: Router,
        route: ActivatedRoute,
    ) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) => this.dataService.collection.getCollections(99999, 0),
            data => data.collections,
        );
    }

    ngOnInit() {
        super.ngOnInit();

        this.activeCollectionId$ = this.route.paramMap.pipe(
            map(pm => pm.get('contents')),
            distinctUntilChanged(),
        );
        this.contentsCurrentPage$ = this.route.paramMap.pipe(
            map(qpm => qpm.get('contentsPage')),
            map(page => (!page ? 1 : +page)),
            startWith(1),
            distinctUntilChanged(),
        );
        this.contentsItemsPerPage$ = this.route.paramMap.pipe(
            map(qpm => qpm.get('contentsPerPage')),
            map(perPage => (!perPage ? 10 : +perPage)),
            startWith(10),
            distinctUntilChanged(),
        );

        const filterTerm$ = this.filterTermControl.valueChanges.pipe(
            debounceTime(250),
            tap(() => this.setContentsPageNumber(1)),
            startWith(''),
        );

        const collection$ = combineLatest(
            this.activeCollectionId$,
            this.contentsCurrentPage$,
            this.contentsItemsPerPage$,
            filterTerm$,
        ).pipe(
            takeUntil(this.destroy$),
            switchMap(([id, currentPage, itemsPerPage, filterTerm]) => {
                if (id) {
                    const take = itemsPerPage;
                    const skip = (currentPage - 1) * itemsPerPage;
                    return this.dataService.collection
                        .getCollectionContents(id, take, skip, filterTerm)
                        .mapSingle(data => data.collection);
                } else {
                    return of(null);
                }
            }),
        );

        this.contents$ = collection$.pipe(map(result => (result ? result.productVariants.items : [])));
        this.contentsTotalItems$ = collection$.pipe(
            map(result => (result ? result.productVariants.totalItems : 0)),
        );
        this.activeCollectionTitle$ = collection$.pipe(map(result => (result ? result.name : '')));
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

    setContentsPageNumber(page: number) {
        this.setParam('contentsPage', page);
    }

    setContentsItemsPerPage(perPage: number) {
        this.setParam('contentsPerPage', perPage);
    }

    closeContents() {
        this.setParam('contents', null);
    }

    private setParam(key: string, value: any) {
        this.router.navigate(['./', { ...this.route.snapshot.params, [key]: value }], {
            relativeTo: this.route,
            queryParamsHandling: 'merge',
        });
    }
}
