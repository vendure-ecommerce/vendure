import { AlertTriangle, Info, LucideIcon } from 'lucide-react';
import type React from 'react';
import { Alert, AlertDescription, AlertTitle, AlertVariants } from '../ui/alert.js';

type StatusSeverity = 'info' | 'warning' | 'error';

type StatusAlertProps = {
    title: React.ReactNode;
    description?: React.ReactNode;
    /**
     * High-level severity used to derive the Alert variant and default icon.
     *
     * - `info`: neutral informational message
     * - `warning`: noteworthy but non-destructive issue
     * - `error`: destructive or blocking issue
     */
    severity?: StatusSeverity;
    /**
     * Optional override for the icon component. If not provided, an icon is
     * chosen based on the `severity`.
     */
    icon?: LucideIcon;
    /**
     * Optional className forwarded to the underlying Alert component.
     */
    className?: string;
};

function getStatusConfig(
    severity: StatusSeverity,
    IconOverride?: LucideIcon,
): { variant: AlertVariants; Icon: LucideIcon } {
    let variant: AlertVariants = 'default';
    let Icon: LucideIcon = Info;

    switch (severity) {
        case 'warning': {
            variant = 'default';
            Icon = AlertTriangle;
            break;
        }
        case 'error': {
            variant = 'destructive';
            Icon = AlertTriangle;
            break;
        }
        case 'info':
        default: {
            variant = 'default';
            Icon = Info;
            break;
        }
    }

    if (IconOverride) {
        Icon = IconOverride;
    }

    return { variant, Icon };
}

export function StatusAlert({
    title,
    description,
    severity = 'info',
    icon,
    className,
}: Readonly<StatusAlertProps>) {
    const { variant, Icon } = getStatusConfig(severity, icon);

    return (
        <Alert variant={variant} className={className}>
            <Icon />
            <AlertTitle>{title}</AlertTitle>
            {description ? <AlertDescription>{description}</AlertDescription> : null}
        </Alert>
    );
}
