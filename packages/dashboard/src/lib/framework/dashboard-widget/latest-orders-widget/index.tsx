import { PaginatedListDataTable } from '@/vdb/components/shared/paginated-list-data-table.js';
import {
    CustomerCell,
    OrderMoneyCell,
    OrderStateCell,
} from '@/vdb/components/shared/table-cell/order-table-cell-components.js';
import { Button } from '@/vdb/components/ui/button.js';
import { useLocalFormat } from '@/vdb/hooks/use-local-format.js';
import { useLingui } from '@lingui/react/macro';
import { Link } from '@tanstack/react-router';
import { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { formatRelative } from 'date-fns';
import { useEffect, useState } from 'react';
import { DashboardBaseWidget } from '../base-widget.js';
import { useWidgetFilters } from '../widget-filters-context.js';
import { latestOrdersQuery } from './latest-orders-widget.graphql.js';

export const WIDGET_ID = 'latest-orders-widget';

export function LatestOrdersWidget() {
    const { t } = useLingui();
    const { dateRange } = useWidgetFilters();
    const [sorting, setSorting] = useState<SortingState>([
        {
            id: 'orderPlacedAt',
            desc: true,
        },
    ]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<ColumnFiltersState>([
        {
            id: 'orderPlacedAt',
            value: {
                between: {
                    start: dateRange.from.toISOString(),
                    end: dateRange.to.toISOString(),
                },
            },
        },
    ]);
    const { formatCurrency } = useLocalFormat();

    // Update filters when date range changes
    useEffect(() => {
        setFilters([
            {
                id: 'orderPlacedAt',
                value: {
                    between: {
                        start: dateRange.from.toISOString(),
                        end: dateRange.to.toISOString(),
                    },
                },
            },
        ]);
    }, [dateRange]);

    return (
        <DashboardBaseWidget id={WIDGET_ID} title={t`Latest Orders`} description={t`Your latest orders`}>
            <PaginatedListDataTable
                page={page}
                transformVariables={variables => ({
                    ...variables,
                    options: {
                        ...variables.options,
                        filter: {
                            active: {
                                eq: false,
                            },
                            state: {
                                notIn: ['Cancelled', 'Draft'],
                            },
                            ...(variables.options?.filter ?? {}),
                        },
                    },
                })}
                customizeColumns={{
                    code: {
                        header: t`Code`,
                        cell: ({ row }) => {
                            return (
                                <Button variant="ghost" asChild>
                                    <Link to={`/orders/${row.original.id}`}>{row.original.code}</Link>
                                </Button>
                            );
                        },
                    },
                    orderPlacedAt: {
                        header: t`Placed At`,
                        cell: ({ row }) => {
                            return (
                                <span className="capitalize">
                                    {formatRelative(row.original.orderPlacedAt ?? new Date(), new Date())}
                                </span>
                            );
                        },
                    },
                    total: {
                        header: t`Total`,
                        cell: OrderMoneyCell,
                    },
                    totalWithTax: { cell: OrderMoneyCell },
                    state: { cell: OrderStateCell },
                    customer: { cell: CustomerCell },
                }}
                itemsPerPage={pageSize}
                sorting={sorting}
                columnFilters={filters}
                listQuery={latestOrdersQuery}
                onPageChange={(_, page, pageSize) => {
                    setPage(page);
                    setPageSize(pageSize);
                }}
                onSortChange={(_, sorting) => {
                    setSorting(sorting);
                }}
                onFilterChange={(_, filters) => {
                    setFilters(filters);
                }}
                defaultVisibility={{
                    code: true,
                    total: true,
                    orderPlacedAt: true,
                }}
            />
        </DashboardBaseWidget>
    );
}
