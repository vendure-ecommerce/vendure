import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetOrderList } from 'shared/generated-types';

import { BaseListComponent } from '../../../common/base-list.component';
import { DataService } from '../../../data/providers/data.service';

@Component({
    selector: 'vdr-order-list',
    templateUrl: './order-list.component.html',
    styleUrls: ['./order-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderListComponent extends BaseListComponent<GetOrderList.Query, GetOrderList.Items> {
    constructor(private dataService: DataService, router: Router, route: ActivatedRoute) {
        super(router, route);
        super.setQueryFn((...args: any[]) => this.dataService.order.getOrders(...args), data => data.orders);
    }
}
