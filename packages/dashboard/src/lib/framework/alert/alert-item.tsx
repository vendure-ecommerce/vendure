import { Button } from '@/vdb/components/ui/button.js';
import { cn } from '@/vdb/lib/utils.js';
import { useQuery } from '@tanstack/react-query';
import { ComponentProps } from 'react';

import { DashboardAlertDefinition } from '../extension-api/types/alerts.js';

interface AlertItemProps extends ComponentProps<'div'> {
    alert: DashboardAlertDefinition;
}

export function AlertItem({ alert, className, ...props }: Readonly<AlertItemProps>) {
    const { data } = useQuery({
        queryKey: ['alert', alert.id],
        queryFn: () => alert.check(),
        refetchInterval: alert.recheckInterval,
    });

    const isAlertActive = alert.shouldShow?.(data);

    if (!isAlertActive) {
        return null;
    }

    return (
        <div className={cn('flex items-center justify-between gap-1', className)} {...props}>
            <div className="flex flex-col">
                <span className="font-semibold">
                    {typeof alert.title === 'string' ? alert.title : alert.title(data)}
                </span>
                <span className="text-sm text-muted-foreground">
                    {typeof alert.description === 'string' ? alert.description : alert.description?.(data)}
                </span>
            </div>
            <div className="flex items-center gap-1">
                {alert.actions?.map(action => (
                    <Button
                        key={action.label}
                        variant="secondary"
                        size="sm"
                        onClick={() => action.onClick(data)}
                    >
                        {action.label}
                    </Button>
                ))}
            </div>
        </div>
    );
}
