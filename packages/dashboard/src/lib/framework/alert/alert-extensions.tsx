import { useEffect, useState } from 'react';
import { DashboardAlertDefinition } from '../extension-api/types/alerts.js';
import { globalRegistry } from '../registry/global-registry.js';

globalRegistry.register('dashboardAlertRegistry', new Map<string, DashboardAlertDefinition>());

export function registerAlert<TResponse>(alert: DashboardAlertDefinition<TResponse>) {
    globalRegistry.set('dashboardAlertRegistry', map => {
        map.set(alert.id, alert);
        return map;
    });
}

export function getAlertRegistry() {
    return globalRegistry.get('dashboardAlertRegistry');
}

export function getAlert(id: string) {
    return getAlertRegistry().get(id);
}

export function useAlerts() {
    const [alerts, setAlerts] = useState<DashboardAlertDefinition[]>([]);

    useEffect(() => {
        setAlerts(Array.from(getAlertRegistry().values()));
    }, []);

    return { alerts };
}
