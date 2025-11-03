import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import { useWidgetDimensions } from '../base-widget.js';

export function MetricsChart({
    chartData,
    formatValue,
}: {
    chartData: any[];
    formatValue: (value: any) => string;
}) {
    const { width, height } = useWidgetDimensions();

    return (
        <AreaChart width={width} height={height} data={chartData}>
            <defs>
                <linearGradient id="gradientFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-brand)" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="var(--color-brand)" stopOpacity={0.05} />
                </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border)" />
            <XAxis className="text-xs" color="var(--color-foreground)" dataKey="name" interval={2} />
            <YAxis className="text-xs" color="var(--color-foreground)" tickFormatter={formatValue} />
            <Tooltip
                formatter={formatValue}
                contentStyle={{ borderRadius: 4, padding: 4, paddingLeft: 8, paddingRight: 8 }}
                labelStyle={{ fontSize: 12 }}
                itemStyle={{ fontSize: 14 }}
            />
            <Area
                type="monotone"
                dataKey="sales"
                stroke="var(--color-brand)"
                strokeWidth={2}
                strokeOpacity={0.8}
                fill={'url(#gradientFill)'}
            />
        </AreaChart>
    );
}
