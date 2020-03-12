import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SortOrder } from '@vendure/common/lib/generated-shop-types';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { BaseListComponent } from '@vendure/admin-ui/core';
import { GetCustomerList } from '@vendure/admin-ui/core';
import { DataService } from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-customer-list',
    templateUrl: './customer-list.component.html',
    styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent extends BaseListComponent<GetCustomerList.Query, GetCustomerList.Items>
    implements OnInit {
    searchTerm = new FormControl('');
    constructor(private dataService: DataService, router: Router, route: ActivatedRoute) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) => this.dataService.customer.getCustomerList(...args),
            data => data.customers,
            (skip, take) => ({
                options: {
                    skip,
                    take,
                    filter: {
                        emailAddress: {
                            contains: this.searchTerm.value,
                        },
                    },
                    sort: {
                        createdAt: SortOrder.DESC,
                    },
                },
            }),
        );
    }

    ngOnInit() {
        super.ngOnInit();
        this.searchTerm.valueChanges
            .pipe(
                debounceTime(250),
                takeUntil(this.destroy$),
            )
            .subscribe(() => this.refresh());
    }
}
