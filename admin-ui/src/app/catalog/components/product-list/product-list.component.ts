import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { GetProductList, SearchProducts } from 'shared/generated-types';

import { BaseListComponent } from '../../../common/base-list.component';
import { DataService } from '../../../data/providers/data.service';

@Component({
    selector: 'vdr-products-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent
    extends BaseListComponent<SearchProducts.Query, SearchProducts.Items, SearchProducts.Variables>
    implements OnInit {
    searchForm: FormGroup | undefined;
    groupByProduct = true;
    constructor(private dataService: DataService, router: Router, route: ActivatedRoute) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) =>
                this.dataService.product.searchProducts(this.getFormValue('searchTerm', ''), ...args),
            data => data.search,
            (skip, take) => ({
                input: {
                    skip,
                    take,
                    term: this.getFormValue('searchTerm', ''),
                    groupByProduct: this.getFormValue('groupByProduct', true),
                },
            }),
        );
    }

    ngOnInit() {
        super.ngOnInit();
        this.searchForm = new FormGroup({
            searchTerm: new FormControl(''),
            groupByProduct: new FormControl(true),
        });
        this.searchForm.valueChanges
            .pipe(
                debounceTime(250),
                takeUntil(this.destroy$),
            )
            .subscribe(() => this.refresh());
    }

    private getFormValue<T>(controlName: string, defaultValue: T): T {
        if (!this.searchForm) {
            return defaultValue;
        }
        const control = this.searchForm.get(controlName);
        if (control) {
            return control.value;
        } else {
            throw new Error(`Form does not contain a control named ${controlName}`);
        }
    }
}
