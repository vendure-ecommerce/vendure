'use client';

import { createContext, useContext, PropsWithChildren } from 'react';

export interface DefinedDateRange {
    from: Date;
    to: Date;
}

export interface WidgetFilters {
    dateRange: DefinedDateRange;
}

const WidgetFiltersContext = createContext<WidgetFilters | undefined>(undefined);

export function WidgetFiltersProvider({
    children,
    filters
}: PropsWithChildren<{ filters: WidgetFilters }>) {
    return (
        <WidgetFiltersContext.Provider value={filters}>
            {children}
        </WidgetFiltersContext.Provider>
    );
}

export function useWidgetFilters() {
    const context = useContext(WidgetFiltersContext);
    if (context === undefined) {
        throw new Error('useWidgetFilters must be used within a WidgetFiltersProvider');
    }
    return context;
}