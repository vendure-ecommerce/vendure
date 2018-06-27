import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../core/providers/data/data.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
    selector: 'vdr-products-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

    products$: Observable<any[]>;
    totalItems: number;
    itemsPerPage = 25;
    currentPage = 1;

    constructor(private dataService: DataService) { }

    ngOnInit() {
        this.getPage(1);
    }

    getPage(pageNumber: number): void {
        const take = this.itemsPerPage;
        const skip = (pageNumber - 1) * this.itemsPerPage;
        this.products$ = this.dataService.product.getProducts(take, skip).pipe(
            tap(val => { this.totalItems = val.totalItems; }),
            map(val => val.items),
        );
    }
}
