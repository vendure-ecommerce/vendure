import { useQueries } from '@tanstack/react-query';
import { useAlerts } from './alert-extensions.js';

export function AlertsIndicator() {
    const { alerts } = useAlerts();

    const alertsCount = useQueries({
        queries: alerts.map(alert => ({
            queryKey: ['alert', alert.id],
            queryFn: () => alert.check(),
        })),
        combine: results => {
            return results.filter((result, idx) => result.data && alerts[idx].shouldShow?.(result.data))
                .length;
        },
    });

    return (
        <div className="absolute -right-1 -top-1 rounded-full bg-red-500 text-xs w-4 h-4 flex items-center justify-center">
            {alertsCount}
        </div>
    );
}
