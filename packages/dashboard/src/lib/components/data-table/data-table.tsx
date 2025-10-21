'use client';

import { DataTablePagination } from '@/vdb/components/data-table/data-table-pagination.js';
import { DataTableViewOptions } from '@/vdb/components/data-table/data-table-view-options.js';
import { GlobalViewsBar } from '@/vdb/components/data-table/global-views-bar.js';
import { MyViewsButton } from '@/vdb/components/data-table/my-views-button.js';
import { RefreshButton } from '@/vdb/components/data-table/refresh-button.js';
import { SaveViewButton } from '@/vdb/components/data-table/save-view-button.js';
import { Button } from '@/vdb/components/ui/button.js';
import { Input } from '@/vdb/components/ui/input.js';
import { Skeleton } from '@/vdb/components/ui/skeleton.js';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/vdb/components/ui/table.js';
import { BulkAction } from '@/vdb/framework/extension-api/types/index.js';
import { useChannel } from '@/vdb/hooks/use-channel.js';
import { usePage } from '@/vdb/hooks/use-page.js';
import { useSavedViews } from '@/vdb/hooks/use-saved-views.js';
import { Trans, useLingui } from '@lingui/react/macro';
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
import React, { Suspense, useEffect, useRef } from 'react';
import { AddFilterMenu } from './add-filter-menu.js';
import { DataTableBulkActions } from './data-table-bulk-actions.js';
import { DataTableProvider } from './data-table-context.js';
import { DataTableFacetedFilter, DataTableFacetedFilterOption } from './data-table-faceted-filter.js';
import { DataTableFilterBadgeEditable } from './data-table-filter-badge-editable.js';
import { DEFAULT_PER_PAGE } from '@/vdb/constants.js';

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
    const [searchTerm, setSearchTerm] = React.useState<string>('');
    const { activeChannel } = useChannel();
    const { pageId } = usePage();
    const savedViewsResult = useSavedViews();
    const globalViews = pageId && onFilterChange ? savedViewsResult.globalViews : [];
    const { t } = useLingui();

    // Calculate safe page value with validation
    const pageSize = itemsPerPage ?? DEFAULT_PER_PAGE;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const requestedPage = page ?? 1;
    const safePage = Math.min(Math.max(requestedPage, 1), totalPages);

    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: safePage - 1,
        pageSize: pageSize,
    });
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(
        defaultColumnVisibility ?? {},
    );
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
    const prevSearchTermRef = useRef(searchTerm);
    const prevColumnFiltersRef = useRef(columnFilters);

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

    // Sync pagination state when props change
    useEffect(() => {
        const newPageIndex = safePage - 1;
        const newPageSize = pageSize;

        if (pagination.pageIndex !== newPageIndex || pagination.pageSize !== newPageSize) {
            setPagination({
                pageIndex: newPageIndex,
                pageSize: newPageSize,
            });
        }
    }, [safePage, pageSize]);

    useEffect(() => {
        onPageChange?.(table, pagination.pageIndex + 1, pagination.pageSize);
    }, [pagination]);

    useEffect(() => {
        onSortChange?.(table, sorting);
    }, [sorting]);

    useEffect(() => {
        onColumnVisibilityChange?.(table, columnVisibility);
    }, [columnVisibility]);

    useEffect(() => {
        if (page && page > 1 && itemsPerPage && prevSearchTermRef.current !== searchTerm) {
            // Set the page back to 1 when searchTerm changes
            setPagination({
                ...pagination,
                pageIndex: 0,
            });
        }
        prevSearchTermRef.current = searchTerm;
    }, [onPageChange, searchTerm]);

    useEffect(() => {
        onFilterChange?.(table, columnFilters);
        if (
            page &&
            page > 1 &&
            itemsPerPage &&
            JSON.stringify(prevColumnFiltersRef.current) !== JSON.stringify(columnFilters)
        ) {
            // Set the page back to 1 when filters change
            setPagination({
                ...pagination,
                pageIndex: 0,
            });
            pagination.pageIndex;
        }
        prevColumnFiltersRef.current = columnFilters;
    }, [columnFilters]);

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        onSearchTermChange?.(value);
    };

    const visibleColumnCount = Object.values(columnVisibility).filter(Boolean).length;

    return (
        <DataTableProvider
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sorting={sorting}
            setSorting={setSorting}
            pageId={pageId}
            onFilterChange={onFilterChange}
            onSearchTermChange={onSearchTermChange}
            onRefresh={onRefresh}
            isLoading={isLoading}
            table={table}
        >
            <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        {onSearchTermChange && (
                            <Input
                                placeholder={t`Filter...`}
                                value={searchTerm}
                                onChange={event => handleSearchChange(event.target.value)}
                                className="w-64"
                            />
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
                        {pageId && onFilterChange && <MyViewsButton />}
                    </div>
                    <div className="flex items-center gap-2">
                        {pageId && onFilterChange && <SaveViewButton />}
                        {!disableViewOptions && <DataTableViewOptions table={table} />}
                        {onRefresh && <RefreshButton onRefresh={onRefresh} isLoading={isLoading ?? false} />}
                    </div>
                </div>

                {(pageId && onFilterChange && globalViews.length > 0) ||
                columnFilters.filter(f => !facetedFilters?.[f.id]).length > 0 ? (
                    <div className="flex items-center justify-between bg-muted/40 rounded border border-border p-2 @container">
                        <div className="flex items-center">
                            {pageId && onFilterChange && <GlobalViewsBar />}
                        </div>
                        <div className="flex gap-1 flex-wrap items-center">
                            {columnFilters
                                .filter(f => !facetedFilters?.[f.id])
                                .map(f => {
                                    const column = table.getColumn(f.id);
                                    const currency = activeChannel?.defaultCurrencyCode ?? 'USD';
                                    return (
                                        <DataTableFilterBadgeEditable
                                            key={f.id}
                                            filter={f}
                                            column={column}
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
                            {columnFilters.filter(f => !facetedFilters?.[f.id]).length > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setColumnFilters([])}
                                    className="text-xs opacity-60 hover:opacity-100"
                                >
                                    <Trans>Clear all</Trans>
                                </Button>
                            )}
                        </div>
                    </div>
                ) : null}

                <div className="rounded-md border my-2 relative shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/50">
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
                                Array.from({ length: Math.min(pagination.pageSize, 100) }).map((_, index) => (
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
                                        <Trans>No results</Trans>
                                    </TableCell>
                                </TableRow>
                            )}
                            {children}
                        </TableBody>
                    </Table>
                    <DataTableBulkActions bulkActions={bulkActions ?? []} table={table} />
                </div>
                {onPageChange && totalItems != null && <DataTablePagination table={table} />}
            </div>
        </DataTableProvider>
    );
}
