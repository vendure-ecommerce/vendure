import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { merge } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { BaseListComponent } from '@vendure/admin-ui/core';
import { GetOrderList, SortOrder } from '@vendure/admin-ui/core';
import { DataService } from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-order-list',
    templateUrl: './order-list.component.html',
    styleUrls: ['./order-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderListComponent extends BaseListComponent<GetOrderList.Query, GetOrderList.Items>
    implements OnInit {
    searchTerm = new FormControl('');
    stateFilter = new FormControl('all');

    constructor(private dataService: DataService, router: Router, route: ActivatedRoute) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) => this.dataService.order.getOrders(...args),
            data => data.orders,
            (skip, take) => {
                const stateFilter = this.stateFilter.value;
                const state = stateFilter === 'all' ? null : { eq: stateFilter };
                return {
                    options: {
                        skip,
                        take,
                        filter: {
                            code: {
                                contains: this.searchTerm.value,
                            },
                            state,
                        },
                        sort: {
                            updatedAt: SortOrder.DESC,
                        },
                    },
                };
            },
        );
    }

    ngOnInit() {
        super.ngOnInit();
        merge(this.searchTerm.valueChanges, this.stateFilter.valueChanges)
            .pipe(
                debounceTime(250),
                takeUntil(this.destroy$),
            )
            .subscribe(() => this.refresh());
    }
}
