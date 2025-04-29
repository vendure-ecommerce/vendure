'use client';

import { DataTablePagination } from '@/components/data-table/data-table-pagination.js';
import { DataTableViewOptions } from '@/components/data-table/data-table-view-options.js';
import { Input } from '@/components/ui/input.js';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.js';
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
import { TableOptions } from '@tanstack/table-core';
import React, { Suspense, useEffect } from 'react';
import { AddFilterMenu } from './add-filter-menu.js';
import { DataTableFacetedFilter, DataTableFacetedFilterOption } from './data-table-faceted-filter.js';
import { DataTableFilterBadge } from './data-table-filter-badge.js';
import { useChannel } from '@/hooks/use-channel.js';

export interface FacetedFilter {
    title: string;
    icon?: React.ComponentType<{ className?: string }>;
    optionsFn?: () => Promise<DataTableFacetedFilterOption[]>;
    options?: DataTableFacetedFilterOption[];
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    totalItems: number;
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
    /**
     * This property allows full control over _all_ features of TanStack Table
     * when needed.
     */
    setTableOptions?: (table: TableOptions<TData>) => TableOptions<TData>;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    totalItems,
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
    setTableOptions,
}: DataTableProps<TData, TValue>) {
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

    let tableOptions: TableOptions<TData> = {
        data,
        columns,
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
        state: {
            pagination,
            sorting,
            columnVisibility,
            columnFilters,
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
                        <AddFilterMenu columns={table.getAllColumns()} />
                    </div>
                    <div className="flex gap-1">
                        {columnFilters
                            .filter(f => !facetedFilters?.[f.id])
                            .map(f => {
                                const column = table.getColumn(f.id);
                                const currency = activeChannel?.defaultCurrencyCode ?? 'USD';
                                return <DataTableFilterBadge
                                            key={f.id}
                                            filter={f}
                                            currencyCode={currency}
                                            dataType={(column?.columnDef.meta as any)?.fieldInfo?.type ?? 'String'}
                                            onRemove={() => setColumnFilters(old => old.filter(x => x.id !== f.id))} />;
                            })}
                    </div>
                </div>
                {!disableViewOptions && <DataTableViewOptions table={table} />}
            </div>
            <div className="rounded-md border my-2">
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
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </>
    );
}
