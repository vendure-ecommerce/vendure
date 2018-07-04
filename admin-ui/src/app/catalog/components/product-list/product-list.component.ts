import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { DataService } from '../../../data/providers/data.service';

@Component({
    selector: 'vdr-products-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit, OnDestroy {

    products$: Observable<any[]>;
    totalItems$: Observable<number>;
    itemsPerPage$: Observable<number>;
    currentPage$: Observable<number>;
    private destroy$ = new Subject<void>();

    constructor(private dataService: DataService,
                private router: Router,
                private route: ActivatedRoute) { }

    ngOnInit() {
        const productsQuery = this.dataService.product.getProducts(10, 0);

        const fetchPage = ([currentPage, itemsPerPage]: [number, number]) => {
            const take = itemsPerPage;
            const skip = (currentPage - 1) * itemsPerPage;
            productsQuery.ref.refetch({ skip, take });
        };

        this.products$ = productsQuery.stream$.pipe(map(data => data.products.items));
        this.totalItems$ = productsQuery.stream$.pipe(map(data => data.products.totalItems));
        this.currentPage$ = this.route.queryParamMap.pipe(
            map(qpm => qpm.get('page')),
            map(page => !page ? 1 : +page),
        );
        this.itemsPerPage$ = this.route.queryParamMap.pipe(
            map(qpm => qpm.get('perPage')),
            map(perPage => !perPage ? 10 : +perPage),
        );

        combineLatest(this.currentPage$, this.itemsPerPage$)
            .pipe(takeUntil(this.destroy$))
            .subscribe(fetchPage);
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    setPageNumber(page: number) {
        this.setQueryParam('page', page);
    }

    setItemsPerPage(perPage: number) {
        this.setQueryParam('perPage', perPage);
    }

    private setQueryParam(key: string, value: any) {
        this.router.navigate(['./'], { queryParams: { [key]: value }, relativeTo: this.route, queryParamsHandling: 'merge' });
    }
}
