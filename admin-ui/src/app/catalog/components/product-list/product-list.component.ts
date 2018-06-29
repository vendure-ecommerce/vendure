import { Component, OnInit } from '@angular/core';
import { QueryRef } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { GetProductListQuery, GetProductListQueryVariables } from '../../../common/types/gql-generated-types';
import { DataService } from '../../../core/providers/data/data.service';

@Component({
    selector: 'vdr-products-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {

    products$: Observable<any[]>;
    totalItems: number;
    itemsPerPage = 25;
    currentPage = 1;
    private productsQuery: QueryRef<GetProductListQuery, GetProductListQueryVariables>;

    constructor(private dataService: DataService) { }

    ngOnInit() {
        this.productsQuery = this.dataService.product.getProducts(this.itemsPerPage, 0);
        this.products$ = this.productsQuery.valueChanges.pipe(
            tap(val => { this.totalItems = val.data.products.totalItems; }),
            map(val => val.data.products.items),
        );
    }

    getPage(pageNumber: number): void {
        const take = this.itemsPerPage;
        const skip = (pageNumber - 1) * this.itemsPerPage;
        this.productsQuery.refetch({ skip, take });
    }
}
