import { getAlertRegistry } from '@/vdb/framework/alert/alert-extensions.js';
import { DashboardAlertDefinition } from '@/vdb/framework/extension-api/types/alerts.js';
import { useQueries, UseQueryOptions } from '@tanstack/react-query';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AlertsContextValue {
    alertDefs: DashboardAlertDefinition[];
    rawResults: any[];
    dismissedAlerts: Map<string, number>;
    setDismissedAlerts: React.Dispatch<React.SetStateAction<Map<string, number>>>;
    enabledQueries: boolean;
}

const AlertsContext = createContext<AlertsContextValue | undefined>(undefined);

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

export function useAlertsContext() {
    const context = useContext(AlertsContext);
    if (!context) {
        throw new Error('useAlertsContext must be used within AlertsProvider');
    }
    return context;
}
