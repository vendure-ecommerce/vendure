import { ChangeDetectionStrategy, Component, NgModule, OnInit } from '@angular/core';
import { CoreModule, DataService, GetOrderList, SharedModule, SortOrder } from '@vendure/admin-ui/core';
import { Observable } from 'rxjs';

@Component({
    selector: 'vdr-latest-orders-widget',
    templateUrl: './latest-orders-widget.component.html',
    styleUrls: ['./latest-orders-widget.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LatestOrdersWidgetComponent implements OnInit {
    latestOrders$: Observable<GetOrderList.Items[]>;
    constructor(private dataService: DataService) {}

    ngOnInit(): void {
        this.latestOrders$ = this.dataService.order
            .getOrders({
                take: 10,
                filter: {
                    active: { eq: false },
                },
                sort: {
                    orderPlacedAt: SortOrder.DESC,
                },
            })
            .refetchOnChannelChange()
            .mapStream(data => data.orders.items);
    }
}

@NgModule({
    imports: [CoreModule, SharedModule],
    declarations: [LatestOrdersWidgetComponent],
})
export class LatestOrdersWidgetModule {}
