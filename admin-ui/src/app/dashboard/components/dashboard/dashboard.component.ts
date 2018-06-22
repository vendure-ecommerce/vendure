import { Component, OnInit } from '@angular/core';
import gql from 'graphql-tag';
import { DataService } from '../../../core/providers/data/data.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
    selector: 'vdr-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    products$: Observable<any[]>;
    currentPage = 1;
    totalItems: number;

    constructor(private dataService: DataService) { }

    ngOnInit() {
        this.getPage(1);
    }

    getPage(pageNumber: number): void {
        const itemsPerPage = 10;
        const take = itemsPerPage;
        const skip = (pageNumber - 1) * itemsPerPage;
        this.products$ = this.dataService.product.getProducts(take, skip).pipe(
            tap(val => { this.totalItems = val.totalItems; }),
            map(val => val.items),
        );
    }

}
