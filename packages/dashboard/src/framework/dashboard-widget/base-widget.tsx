import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.js';
import { cn } from '@/lib/utils.js';
import { Trans } from '@lingui/react/macro';
import { PropsWithChildren } from 'react';

export type DashboardBaseWidgetProps = PropsWithChildren<{
    id: string;
    title?: string;
    description?: string;
    config?: Record<string, unknown>;
}>;

export function DashboardBaseWidget({ id, config, children, title, description }: DashboardBaseWidgetProps) {
    return (
        <Card className={cn('h-full w-full', !title && 'pt-6')}>
            {title && (
                <CardHeader>
                    <CardTitle>
                        <Trans>{title}</Trans>
                    </CardTitle>
                    {description && <CardDescription>{description}</CardDescription>}
                </CardHeader>
            )}
            <CardContent>{children}</CardContent>
        </Card>
    );
}
