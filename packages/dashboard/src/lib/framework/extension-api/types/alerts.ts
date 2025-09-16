/**
 * @description
 * Allows you to define custom alerts that can be displayed in the dashboard.
 *
 * @docsCategory extensions-api
 * @docsPage Alerts
 * @since 3.3.0
 */
export interface DashboardAlertDefinition<TResponse = any> {
    /**
     * @description
     * A unique identifier for the alert.
     */
    id: string;
    /**
     * @description
     * The title of the alert. Can be a string or a function that returns a string based on the response data.
     */
    title: string | ((data: TResponse) => string);
    /**
     * @description
     * The description of the alert. Can be a string or a function that returns a string based on the response data.
     */
    description?: string | ((data: TResponse) => string);
    /**
     * @description
     * The severity level of the alert.
     */
    severity: 'info' | 'warning' | 'error';
    /**
     * @description
     * A function that checks the condition and returns the response data.
     */
    check: () => Promise<TResponse> | TResponse;
    /**
     * @description
     * The interval in milliseconds to recheck the condition.
     */
    recheckInterval?: number;
    /**
     * @description
     * A function that determines whether the alert should be shown based on the response data.
     */
    shouldShow?: (data: TResponse) => boolean;
    /**
     * @description
     * Optional actions that can be performed when the alert is shown.
     */
    actions?: Array<{
        label: string;
        onClick: (data: TResponse) => void;
    }>;
}
