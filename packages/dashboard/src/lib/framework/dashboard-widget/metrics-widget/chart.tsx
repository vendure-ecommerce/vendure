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
            <CartesianGrid strokeDasharray="4 4" />
            <XAxis className="text-xs text-muted-foreground" dataKey="name" interval={2} />
            <YAxis className="text-xs text-muted-foreground" tickFormatter={formatValue} />
            <Tooltip formatter={formatValue} />
            <Area
                type="monotone"
                dataKey="sales"
                stroke="var(--color-brand)"
                fill="var(--color-brand-lighter)"
            />
        </AreaChart>
    );
}
