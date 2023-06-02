import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
    ChartEntry,
    ChartFormatOptions,
    DataService,
    GetOrderChartDataDocument,
    MetricType,
} from '@vendure/admin-ui/core';
import { gql } from 'apollo-angular';
import { BehaviorSubject, combineLatest, Observable, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

export const GET_ORDER_CHART_DATA = gql`
    query GetOrderChartData($refresh: Boolean, $types: [MetricType!]!) {
        metricSummary(input: { interval: Daily, types: $types, refresh: $refresh }) {
            interval
            type
            entries {
                label
                value
            }
        }
    }
`;

@Component({
    selector: 'vdr-order-chart-widget',
    templateUrl: './order-chart-widget.component.html',
    styleUrls: ['./order-chart-widget.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderChartWidgetComponent implements OnInit {
    constructor(private dataService: DataService) {}
    metrics$: Observable<ChartEntry[]>;
    refresh$ = new BehaviorSubject(false);
    metricType$ = new BehaviorSubject(MetricType.OrderTotal);
    MetricType = MetricType;

    ngOnInit() {
        const currencyCode$ = this.dataService.settings
            .getActiveChannel()
            .refetchOnChannelChange()
            .mapStream(data => data.activeChannel.defaultCurrencyCode || undefined);
        const uiState$ = this.dataService.client.uiState().mapStream(data => data.uiState);

        this.metrics$ = combineLatest(this.refresh$, this.metricType$, currencyCode$, uiState$).pipe(
            switchMap(([refresh, metricType, currencyCode, uiState]) =>
                this.dataService
                    .query(GetOrderChartDataDocument, {
                        types: [metricType],
                        refresh,
                    })
                    .mapSingle(data => data.metricSummary)
                    .pipe(
                        map(metrics => {
                            const formatValueAs: 'currency' | 'number' =
                                metricType === MetricType.OrderCount ? 'number' : 'currency';
                            const locale = `${uiState.language}-${uiState.locale}`;

                            const formatOptions: ChartFormatOptions = {
                                formatValueAs,
                                currencyCode,
                                locale,
                            };
                            return (
                                metrics
                                    .find(m => m.type === metricType)
                                    ?.entries.map(entry => ({ ...entry, formatOptions })) ?? []
                            );
                        }),
                    ),
            ),
        );
    }
}
