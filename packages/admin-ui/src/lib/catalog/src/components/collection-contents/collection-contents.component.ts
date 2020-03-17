import {
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    TemplateRef,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    map,
    startWith,
    switchMap,
    takeUntil,
    tap,
} from 'rxjs/operators';

import { GetCollectionContents } from '@vendure/admin-ui/core';
import { DataService } from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-collection-contents',
    templateUrl: './collection-contents.component.html',
    styleUrls: ['./collection-contents.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionContentsComponent implements OnInit, OnChanges, OnDestroy {
    @Input() collectionId: string;
    @ContentChild(TemplateRef, { static: true }) headerTemplate: TemplateRef<any>;

    contents$: Observable<GetCollectionContents.Items[]>;
    contentsTotalItems$: Observable<number>;
    contentsItemsPerPage$: Observable<number>;
    contentsCurrentPage$: Observable<number>;
    filterTermControl = new FormControl('');
    private collectionIdChange$ = new BehaviorSubject<string>('');
    private refresh$ = new BehaviorSubject<boolean>(true);
    private destroy$ = new Subject<void>();

    constructor(private route: ActivatedRoute, private router: Router, private dataService: DataService) {}

    ngOnInit() {
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
            this.collectionIdChange$,
            this.contentsCurrentPage$,
            this.contentsItemsPerPage$,
            filterTerm$,
            this.refresh$,
        ).pipe(
            takeUntil(this.destroy$),
            switchMap(([id, currentPage, itemsPerPage, filterTerm]) => {
                const take = itemsPerPage;
                const skip = (currentPage - 1) * itemsPerPage;
                if (id) {
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
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ('collectionId' in changes) {
            this.collectionIdChange$.next(changes.collectionId.currentValue);
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    setContentsPageNumber(page: number) {
        this.setParam('contentsPage', page);
    }

    setContentsItemsPerPage(perPage: number) {
        this.setParam('contentsPerPage', perPage);
    }

    refresh() {
        this.refresh$.next(true);
    }

    private setParam(key: string, value: any) {
        this.router.navigate(['./', { ...this.route.snapshot.params, [key]: value }], {
            relativeTo: this.route,
            queryParamsHandling: 'merge',
        });
    }
}
