import { useQuery } from '@tanstack/react-query';
import { latestOrdersQuery } from './latest-orders-widget.graphql.js';
import { DashboardBaseWidget } from '../base-widget.js';
import { PaginatedListDataTable, addCustomFields } from '@/index.js';
import { ColumnFiltersState } from '@tanstack/react-table';
import { useState } from 'react';
import { SortingState } from '@tanstack/react-table';

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

    return (
        <DashboardBaseWidget id={WIDGET_ID} title="Latest Orders" description="Your latest orders">
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
                        },
                    },
                })}
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
