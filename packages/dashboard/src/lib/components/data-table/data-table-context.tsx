'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { ColumnFiltersState, SortingState, Table } from '@tanstack/react-table';

interface DataTableContextValue {
    // Filter and search state
    columnFilters: ColumnFiltersState;
    setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;

    // Sorting state
    sorting: SortingState;
    setSorting: React.Dispatch<React.SetStateAction<SortingState>>;

    // Page context
    pageId?: string;

    // Callbacks
    onFilterChange?: (table: Table<any>, filters: ColumnFiltersState) => void;
    onSearchTermChange?: (searchTerm: string) => void;
    onRefresh?: () => void;

    // Loading state
    isLoading?: boolean;

    // Table instance (optional, will be set after table is initialized)
    table?: Table<any>;

    // Apply view handler
    handleApplyView: (filters: ColumnFiltersState, searchTerm?: string) => void;
}

const DataTableContext = createContext<DataTableContextValue | undefined>(undefined);

export interface DataTableProviderProps {
    children: ReactNode;
    columnFilters: ColumnFiltersState;
    setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    sorting: SortingState;
    setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
    pageId?: string;
    onFilterChange?: (table: Table<any>, filters: ColumnFiltersState) => void;
    onSearchTermChange?: (searchTerm: string) => void;
    onRefresh?: () => void;
    isLoading?: boolean;
    table?: Table<any>;
}

export function DataTableProvider({
    children,
    columnFilters,
    setColumnFilters,
    searchTerm,
    setSearchTerm,
    sorting,
    setSorting,
    pageId,
    onFilterChange,
    onSearchTermChange,
    onRefresh,
    isLoading,
    table,
}: DataTableProviderProps) {
    const handleApplyView = (filters: ColumnFiltersState, viewSearchTerm?: string) => {
        setColumnFilters(filters);
        if (viewSearchTerm !== undefined && onSearchTermChange) {
            setSearchTerm(viewSearchTerm);
            onSearchTermChange(viewSearchTerm);
        }
        if (onFilterChange && table) {
            onFilterChange(table, filters);
        }
    };

    const value: DataTableContextValue = {
        columnFilters,
        setColumnFilters,
        searchTerm,
        setSearchTerm,
        sorting,
        setSorting,
        pageId,
        onFilterChange,
        onSearchTermChange,
        onRefresh,
        isLoading,
        table,
        handleApplyView,
    };

    return <DataTableContext.Provider value={value}>{children}</DataTableContext.Provider>;
}

export function useDataTableContext() {
    const context = useContext(DataTableContext);
    if (context === undefined) {
        throw new Error('useDataTableContext must be used within a DataTableProvider');
    }
    return context;
}