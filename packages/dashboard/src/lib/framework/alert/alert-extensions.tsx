import { useEffect } from 'react';
import { useState } from 'react';
import { globalRegistry } from '../registry/global-registry.js';
import { DashboardAlertDefinition } from './types.js';

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
