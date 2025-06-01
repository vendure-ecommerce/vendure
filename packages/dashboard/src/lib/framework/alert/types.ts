export interface DashboardAlertDefinition<TResponse = any> {
    id: string;
    title: string | ((data: TResponse) => string);
    description?: string | ((data: TResponse) => string);
    severity: 'info' | 'warning' | 'error';
    check: () => Promise<TResponse> | TResponse;
    recheckInterval?: number;
    shouldShow?: (data: TResponse) => boolean;
    actions?: Array<{
        label: string;
        onClick: (data: TResponse) => void;
    }>;
}
