import { Component, OnInit } from '@angular/core';
import gql from 'graphql-tag';
import { DataService } from '../../../core/providers/data/data.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'vdr-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    products$: Observable<any[]>;

    constructor(private dataService: DataService) { }

    ngOnInit() {
        this.products$ = this.dataService.product.getProducts();
    }

}
