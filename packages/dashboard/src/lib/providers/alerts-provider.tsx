import { getAlertRegistry } from '@/vdb/framework/alert/alert-extensions.js';
import { DashboardAlertDefinition } from '@/vdb/framework/extension-api/types/alerts.js';
import { useQueries, UseQueryOptions } from '@tanstack/react-query';
import { createContext, ReactNode, useEffect, useState } from 'react';

export interface AlertsContextValue {
    alertDefs: DashboardAlertDefinition[];
    rawResults: any[];
    dismissedAlerts: Map<string, number>;
    setDismissedAlerts: React.Dispatch<React.SetStateAction<Map<string, number>>>;
    enabledQueries: boolean;
}

export const AlertsContext = createContext<AlertsContextValue | undefined>(undefined);

export function AlertsProvider({ children }: { children: ReactNode }) {
    const initialDelayMs = 5_000;
    const [alertDefs, setAlertDefs] = useState<DashboardAlertDefinition[]>([]);
    const [enabledQueries, setEnabledQueries] = useState(false);
    const [dismissedAlerts, setDismissedAlerts] = useState<Map<string, number>>(new Map());

    useEffect(() => {
        setAlertDefs(Array.from(getAlertRegistry().values()));
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setEnabledQueries(true);
        }, initialDelayMs);
        return () => clearTimeout(timer);
    }, []);

    const rawResults = useQueries({
        queries: alertDefs.map(
            alert =>
                ({
                    queryKey: ['alert', alert.id],
                    queryFn: () => alert.check(),
                    refetchInterval: alert.recheckInterval,
                    enabled: enabledQueries,
                }) as UseQueryOptions,
        ),
    });

    return (
        <AlertsContext.Provider
            value={{ alertDefs, rawResults, dismissedAlerts, setDismissedAlerts, enabledQueries }}
        >
            {children}
        </AlertsContext.Provider>
    );
}
