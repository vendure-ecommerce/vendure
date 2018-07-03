import { Component, OnDestroy, OnInit } from '@angular/core';
import { QueryRef } from 'apollo-angular';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { DataService } from '../../../data/providers/data.service';
import { GetProductList, GetProductListVariables } from '../../../data/types/gql-generated-types';

@Component({
    selector: 'vdr-products-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit, OnDestroy {

    products$: Observable<any[]>;
    totalItems: number;
    itemsPerPage = 25;
    currentPage = 1;
    private productsQuery: QueryRef<GetProductList, GetProductListVariables>;
    private destroy$ = new Subject<void>();

    constructor(private dataService: DataService) { }

    ngOnInit() {
        this.productsQuery = this.dataService.product.getProducts(this.itemsPerPage, 0).ref;
        this.products$ = this.productsQuery.valueChanges.pipe(
            takeUntil(this.destroy$),
            tap(val => { this.totalItems = val.data.products.totalItems; }),
            map(val => val.data.products.items),
        );
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    getPage(pageNumber: number): void {
        const take = this.itemsPerPage;
        const skip = (pageNumber - 1) * this.itemsPerPage;
        this.productsQuery.refetch({ skip, take });
    }
}
