import { api } from '@/graphql/api.js';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import { DashboardBaseWidget, useWidgetDimensions } from '../base-widget.js';
import { orderChartDataQuery } from './metrics-widget.graphql.js';
import { MetricsChart } from './chart.js';
import { useLocalFormat } from '@/hooks/use-local-format.js';
import { useChannel } from '@/hooks/use-channel.js';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs.js';

enum DATA_TYPES {
    OrderCount = 'OrderCount',
    OrderTotal = 'OrderTotal',
    AverageOrderValue = 'AverageOrderValue',
}

export function MetricsWidget() {
    const { formatDate, formatCurrency } = useLocalFormat();
    const { activeChannel } = useChannel();
    const [dataType, setDataType] = useState<DATA_TYPES>(DATA_TYPES.OrderTotal);

    const { data, error } = useQuery({
        queryKey: ['dashboard-order-metrics', dataType],
        queryFn: () => {
            return api.query(orderChartDataQuery, {
                types: [dataType],
                refresh: true,
            });
        },
    });

    const chartData = useMemo(() => {
        const entry = data?.metricSummary.at(0);
        if (!entry) {
            return undefined;
        }

        const { interval, type, entries } = entry;

        const values = entries.map(({ label, value }) => ({
            name: formatDate(label, { month: 'short', day: 'numeric' }),
            sales: value,
        }));

        return {
            values,
            interval,
            type,
        };
    }, [data]);

    return (
        <DashboardBaseWidget
            id="metrics-widget"
            title="Metrics"
            description="Metrics widget"
            actions={
                <Tabs defaultValue={dataType} onValueChange={value => setDataType(value as DATA_TYPES)}>
                    <TabsList>
                        <TabsTrigger value={DATA_TYPES.OrderCount}>Order Count</TabsTrigger>
                        <TabsTrigger value={DATA_TYPES.OrderTotal}>Order Total</TabsTrigger>
                        <TabsTrigger value={DATA_TYPES.AverageOrderValue}>Average Order Value</TabsTrigger>
                    </TabsList>
                </Tabs>
            }
        >
            {chartData && (
                <MetricsChart
                    formatValue={value => {
                        if (dataType === DATA_TYPES.OrderCount) {
                            return value;
                        }

                        return formatCurrency(value, activeChannel?.defaultCurrencyCode ?? 'USD', 0);
                    }}
                    chartData={chartData.values}
                />
            )}
        </DashboardBaseWidget>
    );
}
