import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { DataService } from '../../../core/providers/data/data.service';

@Component({
    selector: 'vdr-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {

    product$: Observable<any>;

    constructor(private dataService: DataService,
                private route: ActivatedRoute) { }

    ngOnInit() {
        this.product$ = this.dataService.product.getProduct(this.route.snapshot.paramMap.get('id'));
    }

}
