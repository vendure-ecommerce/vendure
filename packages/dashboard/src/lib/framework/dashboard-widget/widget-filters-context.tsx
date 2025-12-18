'use client';

import { useLingui } from '@lingui/react/macro';
import { createContext, PropsWithChildren, useContext } from 'react';

export interface DefinedDateRange {
    from: Date;
    to: Date;
}

export interface WidgetFilters {
    dateRange: DefinedDateRange;
}

const WidgetFiltersContext = createContext<WidgetFilters | undefined>(undefined);

export function WidgetFiltersProvider({ children, filters }: PropsWithChildren<{ filters: WidgetFilters }>) {
    return <WidgetFiltersContext.Provider value={filters}>{children}</WidgetFiltersContext.Provider>;
}

/**
 * @description
 * Exposes a context object for use in building Insights page widgets.
 *
 * @docsCategory hooks
 * @docsPage useWidgetFilters
 * @since 3.5.0
 */
export function useWidgetFilters() {
    const { t } = useLingui();
    const context = useContext(WidgetFiltersContext);
    if (context === undefined) {
        throw new Error(t`useWidgetFilters must be used within a WidgetFiltersProvider`);
    }
    return context;
}
