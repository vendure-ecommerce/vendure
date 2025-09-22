'use client';

import { DataTablePagination } from '@/vdb/components/data-table/data-table-pagination.js';
import { DataTableViewOptions } from '@/vdb/components/data-table/data-table-view-options.js';
import { RefreshButton } from '@/vdb/components/data-table/refresh-button.js';
import { Input } from '@/vdb/components/ui/input.js';
import { Skeleton } from '@/vdb/components/ui/skeleton.js';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/vdb/components/ui/table.js';
import { BulkAction } from '@/vdb/framework/extension-api/types/index.js';
import { useChannel } from '@/vdb/hooks/use-channel.js';
import {
    ColumnDef,
    ColumnFilter,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    PaginationState,
    SortingState,
    Table as TableType,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import { RowSelectionState, TableOptions } from '@tanstack/table-core';
import React, { Suspense, useEffect } from 'react';
import { AddFilterMenu } from './add-filter-menu.js';
import { DataTableBulkActions } from './data-table-bulk-actions.js';
import { DataTableFacetedFilter, DataTableFacetedFilterOption } from './data-table-faceted-filter.js';
import { DataTableFilterBadge } from './data-table-filter-badge.js';

export interface FacetedFilter {
    title: string;
    icon?: React.ComponentType<{ className?: string }>;
    optionsFn?: () => Promise<DataTableFacetedFilterOption[]>;
    options?: DataTableFacetedFilterOption[];
}

/**
 * @description
 * Props for configuring the {@link DataTable}.
 *
 * @docsCategory list-views
 * @docsPage DataTable
 * @since 3.4.0
 */
interface DataTableProps<TData> {
    children?: React.ReactNode;
    columns: ColumnDef<TData, any>[];
    data: TData[];
    totalItems: number;
    isLoading?: boolean;
    page?: number;
    itemsPerPage?: number;
    sorting?: SortingState;
    columnFilters?: ColumnFiltersState;
    onPageChange?: (table: TableType<TData>, page: number, itemsPerPage: number) => void;
    onSortChange?: (table: TableType<TData>, sorting: SortingState) => void;
    onFilterChange?: (table: TableType<TData>, columnFilters: ColumnFilter[]) => void;
    onColumnVisibilityChange?: (table: TableType<TData>, columnVisibility: VisibilityState) => void;
    onSearchTermChange?: (searchTerm: string) => void;
    defaultColumnVisibility?: VisibilityState;
    facetedFilters?: { [key: string]: FacetedFilter | undefined };
    disableViewOptions?: boolean;
    bulkActions?: BulkAction[];
    /**
     * @description
     * This property allows full control over _all_ features of TanStack Table
     * when needed.
     */
    setTableOptions?: (table: TableOptions<TData>) => TableOptions<TData>;
    onRefresh?: () => void;
}

/**
 * @description
 * A data table which includes sorting, filtering, pagination, bulk actions, column controls etc.
 *
 * This is the building block of all data tables in the Dashboard.
 *
 * @docsCategory list-views
 * @docsPage DataTable
 * @since 3.4.0
 * @docsWeight 0
 */
export function DataTable<TData>({
    children,
    columns,
    data,
    totalItems,
    isLoading,
    page,
    itemsPerPage,
    sorting: sortingInitialState,
    columnFilters: filtersInitialState,
    onPageChange,
    onSortChange,
    onFilterChange,
    onSearchTermChange,
    onColumnVisibilityChange,
    defaultColumnVisibility,
    facetedFilters,
    disableViewOptions,
    bulkActions,
    setTableOptions,
    onRefresh,
}: Readonly<DataTableProps<TData>>) {
    const [sorting, setSorting] = React.useState<SortingState>(sortingInitialState || []);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(filtersInitialState || []);
    const { activeChannel } = useChannel();
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: (page ?? 1) - 1,
        pageSize: itemsPerPage ?? 10,
    });
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(
        defaultColumnVisibility ?? {},
    );
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

    useEffect(() => {
        // If the defaultColumnVisibility changes externally (e.g. the user reset the table settings),
        // we want to reset the column visibility to the default.
        if (
            defaultColumnVisibility &&
            JSON.stringify(defaultColumnVisibility) !== JSON.stringify(columnVisibility)
        ) {
            setColumnVisibility(defaultColumnVisibility);
        }
        // We intentionally do not include `columnVisibility` in the dependency array
    }, [defaultColumnVisibility]);

    let tableOptions: TableOptions<TData> = {
        data,
        columns,
        getRowId: row => (row as { id: string }).id,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        rowCount: totalItems,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        onColumnFiltersChange: setColumnFilters,
        onRowSelectionChange: setRowSelection,
        state: {
            pagination,
            sorting,
            columnVisibility,
            columnFilters,
            rowSelection,
        },
    };

    if (typeof setTableOptions === 'function') {
        tableOptions = setTableOptions(tableOptions);
    }

    const table = useReactTable(tableOptions);

    useEffect(() => {
        onPageChange?.(table, pagination.pageIndex + 1, pagination.pageSize);
    }, [pagination]);

    useEffect(() => {
        onSortChange?.(table, sorting);
    }, [sorting]);

    useEffect(() => {
        onFilterChange?.(table, columnFilters);
    }, [columnFilters]);

    useEffect(() => {
        onColumnVisibilityChange?.(table, columnVisibility);
    }, [columnVisibility]);

    const visibleColumnCount = Object.values(columnVisibility).filter(Boolean).length;
    return (
        <>
            <div className="flex justify-between items-start">
                <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-start gap-2">
                        {onSearchTermChange && (
                            <div className="flex items-center">
                                <Input
                                    placeholder="Filter..."
                                    onChange={event => onSearchTermChange(event.target.value)}
                                    className="max-w-sm w-md"
                                />
                            </div>
                        )}
                        <Suspense>
                            {Object.entries(facetedFilters ?? {}).map(([key, filter]) => (
                                <DataTableFacetedFilter
                                    key={key}
                                    column={table.getColumn(key)}
                                    title={filter?.title}
                                    options={filter?.options}
                                    optionsFn={filter?.optionsFn}
                                />
                            ))}
                        </Suspense>
                        {onFilterChange && <AddFilterMenu columns={table.getAllColumns()} />}
                    </div>
                    <div className="flex gap-1">
                        {columnFilters
                            .filter(f => !facetedFilters?.[f.id])
                            .map(f => {
                                const column = table.getColumn(f.id);
                                const currency = activeChannel?.defaultCurrencyCode ?? 'USD';
                                return (
                                    <DataTableFilterBadge
                                        key={f.id}
                                        filter={f}
                                        currencyCode={currency}
                                        dataType={
                                            (column?.columnDef.meta as any)?.fieldInfo?.type ?? 'String'
                                        }
                                        onRemove={() =>
                                            setColumnFilters(old => old.filter(x => x.id !== f.id))
                                        }
                                    />
                                );
                            })}
                    </div>
                </div>
                <div className="flex items-center justify-start gap-2">
                    {!disableViewOptions && <DataTableViewOptions table={table} />}
                    {onRefresh && <RefreshButton onRefresh={onRefresh} isLoading={isLoading ?? false} />}
                </div>
            </div>

            <div className="rounded-md border my-2 relative">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading && !data?.length ? (
                            Array.from({ length: pagination.pageSize }).map((_, index) => (
                                <TableRow
                                    key={`skeleton-${index}`}
                                    className="animate-in fade-in duration-100"
                                >
                                    {Array.from({ length: visibleColumnCount }).map((_, cellIndex) => (
                                        <TableCell
                                            key={`skeleton-cell-${index}-${cellIndex}`}
                                            className="h-12"
                                        >
                                            <Skeleton className="h-4 my-2 w-full" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                    className="animate-in fade-in duration-100"
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id} className="h-12">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow className="animate-in fade-in duration-100">
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                        {children}
                    </TableBody>
                </Table>
                <DataTableBulkActions bulkActions={bulkActions ?? []} table={table} />
            </div>
            {onPageChange && totalItems != null && <DataTablePagination table={table} />}
        </>
    );
}
