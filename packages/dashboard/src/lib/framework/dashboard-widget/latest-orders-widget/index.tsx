import { PaginatedListDataTable } from '@/vdb/components/shared/paginated-list-data-table.js';
import { Button } from '@/vdb/components/ui/button.js';
import { useLocalFormat } from '@/vdb/hooks/use-local-format.js';
import { Link } from '@tanstack/react-router';
import { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { formatRelative } from 'date-fns';
import { useState } from 'react';
import { DashboardBaseWidget } from '../base-widget.js';
import { latestOrdersQuery } from './latest-orders-widget.graphql.js';

export const WIDGET_ID = 'latest-orders-widget';

export function LatestOrdersWidget() {
    const [sorting, setSorting] = useState<SortingState>([
        {
            id: 'orderPlacedAt',
            desc: true,
        },
    ]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<ColumnFiltersState>([]);
    const { formatCurrency } = useLocalFormat();

    return (
        <DashboardBaseWidget id={WIDGET_ID} title="Latest Orders" description="Your latest orders">
            <PaginatedListDataTable
                disableViewOptions
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
                        },
                    },
                })}
                customizeColumns={{
                    code: {
                        header: 'Code',
                        cell: ({ row }) => {
                            return (
                                <Button variant="ghost" asChild>
                                    <Link to={`/orders/${row.original.id}`}>{row.original.code}</Link>
                                </Button>
                            );
                        },
                    },
                    orderPlacedAt: {
                        header: 'Placed At',
                        cell: ({ row }) => {
                            return (
                                <span>
                                    {formatRelative(row.original.orderPlacedAt ?? new Date(), new Date())}
                                </span>
                            );
                        },
                    },
                    total: {
                        header: 'Total',
                        cell: ({ row }) => {
                            return (
                                <span>{formatCurrency(row.original.total, row.original.currencyCode)}</span>
                            );
                        },
                    },
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
