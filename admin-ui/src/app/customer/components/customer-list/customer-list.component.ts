import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseListComponent } from '../../../common/base-list.component';
import { GetCustomerList } from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';

@Component({
    selector: 'vdr-customer-list',
    templateUrl: './customer-list.component.html',
    styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent extends BaseListComponent<GetCustomerList.Query, GetCustomerList.Items> {
    constructor(private dataService: DataService, router: Router, route: ActivatedRoute) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) => this.dataService.customer.getCustomerList(...args),
            data => data.customers,
        );
    }
}
