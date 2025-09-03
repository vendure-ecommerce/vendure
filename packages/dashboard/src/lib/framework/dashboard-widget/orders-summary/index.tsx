import { AnimatedCurrency, AnimatedNumber } from '@/vdb/components/shared/animated-number.js';
import { Tabs, TabsList, TabsTrigger } from '@/vdb/components/ui/tabs.js';
import { api } from '@/vdb/graphql/api.js';
import { useQuery } from '@tanstack/react-query';
import { endOfDay, endOfMonth, startOfDay, startOfMonth, subDays, subMonths } from 'date-fns';
import { useMemo, useState } from 'react';
import { DashboardBaseWidget } from '../base-widget.js';
import { orderSummaryQuery } from './order-summary-widget.graphql.js';

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
            <div className="@container h-full">
                <div className="flex flex-col h-full @md:flex-row gap-8 items-center justify-center @md:justify-evenly text-center tabular-nums">
                    <div className="flex flex-col lg:gap-2">
                        <p className="lg:text-lg text-muted-foreground">Total Orders</p>
                        <p className="text-xl @md:text-3xl font-semibold">
                            <AnimatedNumber
                                animationConfig={{ mass: 0.01, stiffness: 90, damping: 3 }}
                                value={currentTotalOrders}
                            />
                        </p>
                        <PercentageChange value={orderChange} />
                    </div>
                    <div className="flex flex-col lg:gap-2">
                        <p className="lg:text-lg text-muted-foreground">Total Revenue</p>
                        <p className="text-xl @md:text-3xl font-semibold">
                            <AnimatedCurrency
                                animationConfig={{ mass: 0.01, stiffness: 90, damping: 3 }}
                                value={currentRevenue}
                            />
                        </p>
                        <PercentageChange value={revenueChange} />
                    </div>
                </div>
            </div>
        </DashboardBaseWidget>
    );
}
