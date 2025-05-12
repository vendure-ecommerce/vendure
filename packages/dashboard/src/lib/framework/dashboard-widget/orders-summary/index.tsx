import { useQuery } from '@tanstack/react-query';
import { DashboardBaseWidget } from '../base-widget.js';
import { orderSummaryQuery } from './order-summary-widget.graphql.js';
import { api } from '@/graphql/api.js';
import { useMemo, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs.js';
import { useChannel, useLocalFormat } from '@/index.js';
import { startOfDay, endOfDay, subDays, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { AnimatedCurrency, AnimatedNumber } from '@/components/shared/animated-number.js';

const WIDGET_ID = 'orders-summary-widget';

enum Range {
    Today = 'today',
    Yesterday = 'yesterday',
    ThisWeek = 'thisWeek',
    ThisMonth = 'thisMonth',
}

interface PercentageChangeProps {
    value: number;
}

function PercentageChange({ value }: PercentageChangeProps) {
    const isZero = value === 0;
    const isPositive = value > 0;
    const colorClass = isZero ? 'text-muted-foreground' : isPositive ? 'text-success' : 'text-destructive';
    const arrow = isZero ? null : isPositive ? '↑' : '↓';

    return (
        <p className={`text-sm ${colorClass}`}>
            {arrow} <AnimatedNumber value={Math.abs(value)} />%
        </p>
    );
}

export function OrdersSummaryWidget() {
    const [range, setRange] = useState<Range>(Range.Today);
    const { formatCurrency } = useLocalFormat();
    const { activeChannel } = useChannel();

    const variables = useMemo(() => {
        const now = new Date();

        switch (range) {
            case Range.Today: {
                const today = now;
                const yesterday = subDays(now, 1);

                return {
                    start: startOfDay(today).toISOString(),
                    end: endOfDay(today).toISOString(),
                    previousStart: startOfDay(yesterday).toISOString(),
                    previousEnd: endOfDay(yesterday).toISOString(),
                };
            }
            case Range.Yesterday: {
                const yesterday = subDays(now, 1);
                const dayBeforeYesterday = subDays(now, 2);

                return {
                    start: startOfDay(yesterday).toISOString(),
                    end: endOfDay(yesterday).toISOString(),
                    previousStart: startOfDay(dayBeforeYesterday).toISOString(),
                    previousEnd: endOfDay(dayBeforeYesterday).toISOString(),
                };
            }
            case Range.ThisWeek: {
                const today = now;
                const sixDaysAgo = subDays(now, 6);
                const sevenDaysAgo = subDays(now, 7);
                const thirteenDaysAgo = subDays(now, 13);

                return {
                    start: startOfDay(sixDaysAgo).toISOString(),
                    end: endOfDay(today).toISOString(),
                    previousStart: startOfDay(thirteenDaysAgo).toISOString(),
                    previousEnd: endOfDay(sevenDaysAgo).toISOString(),
                };
            }
            case Range.ThisMonth: {
                const lastMonth = subMonths(now, 1);
                const twoMonthsAgo = subMonths(now, 2);

                return {
                    start: startOfMonth(lastMonth).toISOString(),
                    end: endOfMonth(lastMonth).toISOString(),
                    previousStart: startOfMonth(twoMonthsAgo).toISOString(),
                    previousEnd: endOfMonth(twoMonthsAgo).toISOString(),
                };
            }
        }
    }, [range]);

    const { data } = useQuery({
        queryKey: ['orders-summary', range],
        queryFn: () =>
            api.query(orderSummaryQuery, {
                start: variables.start,
                end: variables.end,
            }),
    });

    const { data: previousData } = useQuery({
        queryKey: ['orders-summary', 'previous', range],
        queryFn: () =>
            api.query(orderSummaryQuery, {
                start: variables.previousStart,
                end: variables.previousEnd,
            }),
    });

    const calculatePercentChange = (current: number, previous: number) => {
        if (previous === 0) return 0;
        return ((current - previous) / previous) * 100;
    };

    const currentTotalOrders = data?.orders.totalItems ?? 0;
    const previousTotalOrders = previousData?.orders.totalItems ?? 0;
    const currentRevenue = data?.orders.items.reduce((acc, order) => acc + order.totalWithTax, 0) ?? 0;
    const previousRevenue =
        previousData?.orders.items.reduce((acc, order) => acc + order.totalWithTax, 0) ?? 0;

    const orderChange = calculatePercentChange(currentTotalOrders, previousTotalOrders);
    const revenueChange = calculatePercentChange(currentRevenue, previousRevenue);

    return (
        <DashboardBaseWidget
            id={WIDGET_ID}
            title="Orders Summary"
            description="Your orders summary"
            actions={
                <Tabs defaultValue={range} onValueChange={value => setRange(value as Range)}>
                    <TabsList>
                        <TabsTrigger value={Range.Today}>Today</TabsTrigger>
                        <TabsTrigger value={Range.Yesterday}>Yesterday</TabsTrigger>
                        <TabsTrigger value={Range.ThisWeek}>This Week</TabsTrigger>
                        <TabsTrigger value={Range.ThisMonth}>This Month</TabsTrigger>
                    </TabsList>
                </Tabs>
            }
        >
            <div className="flex flex-col gap-4 items-center justify-center text-center">
                <div className="flex flex-col gap-2">
                    <p className="text-lg text-muted-foreground">Total Orders</p>
                    <p className="text-3xl font-semibold">
                        <AnimatedNumber
                            animationConfig={{ mass: 0.5, stiffness: 90, damping: 10 }}
                            value={currentTotalOrders}
                        />
                    </p>
                    <PercentageChange value={orderChange} />
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-lg text-muted-foreground">Total Revenue</p>
                    <p className="text-3xl font-semibold">
                        <AnimatedCurrency
                            animationConfig={{ mass: 0.2, stiffness: 90, damping: 10 }}
                            value={currentRevenue}
                        />
                    </p>
                    <PercentageChange value={revenueChange} />
                </div>
            </div>
        </DashboardBaseWidget>
    );
}
