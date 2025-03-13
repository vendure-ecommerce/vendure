'use client';

import { Badge } from '@/components/ui/badge.js';
import { Input } from '@/components/ui/input.js';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.js';
import { DataTablePagination } from '@/components/data-table/data-table-pagination.js';
import { DataTableViewOptions } from '@/components/data-table/data-table-view-options.js';

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    PaginationState,
    VisibilityState,
    SortingState,
    Table as TableType,
    useReactTable,
    ColumnFilter,
    ColumnFiltersState,
} from '@tanstack/react-table';
import { CircleX, Filter } from 'lucide-react';
import React, { useEffect } from 'react';

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
    onSearchTermChange?: (searchTerm: string) => void;
    defaultColumnVisibility?: VisibilityState;
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
    defaultColumnVisibility,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>(sortingInitialState || []);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(filtersInitialState || []);
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: (page ?? 1) - 1,
        pageSize: itemsPerPage ?? 10,
    });
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(
        defaultColumnVisibility ?? {},
    );

    const table = useReactTable({
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
    });

    useEffect(() => {
        onPageChange?.(table, pagination.pageIndex + 1, pagination.pageSize);
    }, [pagination]);

    useEffect(() => {
        onSortChange?.(table, sorting);
    }, [sorting]);

    useEffect(() => {
        onFilterChange?.(table, columnFilters);
    }, [columnFilters]);

    return (
        <>
            <div className="flex justify-between items-start mt-2">
                <div className="flex flex-col">
                    <div>
                        {onSearchTermChange && (
                            <div className="flex items-center">
                                <Input
                                    placeholder="Filter..."
                                    onChange={event => onSearchTermChange(event.target.value)}
                                    className="max-w-sm w-md"
                                />
                            </div>
                        )}
                    </div>
                    <div className="flex gap-1 mt-2">
                        {columnFilters.map(f => {
                            const [operator, value] = Object.entries(f.value as Record<string, string>)[0];
                            return (
                                <Badge key={f.id} className="flex gap-1 items-center" variant="secondary">
                                    <Filter size="12" className="opacity-50" />
                                    <div>{f.id}</div>
                                    <div>{operator}</div>
                                    <div>{value}</div>
                                    <button
                                        className="cursor-pointer"
                                        onClick={() =>
                                            setColumnFilters(old => old.filter(x => x.id !== f.id))
                                        }
                                    >
                                        <CircleX size="14" />
                                    </button>
                                </Badge>
                            );
                        })}
                    </div>
                </div>
                <DataTableViewOptions table={table} />
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
