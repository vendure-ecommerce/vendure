import { ChangeDetectionStrategy, Component, NgModule, OnInit } from '@angular/core';
import { CoreModule, DataService } from '@vendure/admin-ui/core';
import dayjs from 'dayjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map, shareReplay, switchMap } from 'rxjs/operators';

export type Timeframe = 'day' | 'week' | 'month';

@Component({
    selector: 'vdr-order-summary-widget',
    templateUrl: './order-summary-widget.component.html',
    styleUrls: ['./order-summary-widget.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderSummaryWidgetComponent implements OnInit {
    totalOrderCount$: Observable<number>;
    totalOrderValue$: Observable<number>;
    currencyCode$: Observable<string | undefined>;
    timeframe$ = new BehaviorSubject<Timeframe>('day');
    dateRange$: Observable<{ start: Date; end: Date }>;

    constructor(private dataService: DataService) {}

    ngOnInit(): void {
        this.dateRange$ = this.timeframe$.pipe(
            distinctUntilChanged(),
            map(timeframe => {
                return {
                    start: dayjs().startOf(timeframe).toDate(),
                    end: dayjs().endOf(timeframe).toDate(),
                };
            }),
            shareReplay(1),
        );
        const orderSummary$ = this.dateRange$.pipe(
            switchMap(({ start, end }) => {
                return this.dataService.order
                    .getOrderSummary(start, end)
                    .refetchOnChannelChange()
                    .mapStream(data => data.orders);
            }),
            shareReplay(1),
        );
        this.totalOrderCount$ = orderSummary$.pipe(map(res => res.totalItems));
        this.totalOrderValue$ = orderSummary$.pipe(
            map(res => res.items.reduce((total, order) => total + order.total, 0) / 100),
        );
        this.currencyCode$ = this.dataService.settings
            .getActiveChannel()
            .refetchOnChannelChange()
            .mapStream(data => data.activeChannel.currencyCode || undefined);
    }
}

@NgModule({
    imports: [CoreModule],
    declarations: [OrderSummaryWidgetComponent],
})
export class OrderSummaryWidgetModule {}
