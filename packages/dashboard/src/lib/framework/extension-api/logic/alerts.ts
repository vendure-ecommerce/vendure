import { globalRegistry } from '../../registry/global-registry.js';
import { DashboardAlertDefinition } from '../types/alerts.js';

export function registerAlertExtensions(alerts?: DashboardAlertDefinition[]) {
    if (alerts) {
        for (const alert of alerts) {
            globalRegistry.get('dashboardAlertRegistry').set(alert.id, alert);
        }
    }
}
