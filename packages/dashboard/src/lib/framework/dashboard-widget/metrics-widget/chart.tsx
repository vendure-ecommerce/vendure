import { Area, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

import { AreaChart } from 'recharts';
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
            <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border)" />
            <XAxis className="text-xs" color="var(--color-foreground)" dataKey="name" interval={2} />
            <YAxis className="text-xs" color="var(--color-foreground)" tickFormatter={formatValue} />
            <Tooltip formatter={formatValue} />
            <Area type="monotone" dataKey="sales" stroke="var(--color-brand)" strokeWidth={2} />
        </AreaChart>
    );
}
