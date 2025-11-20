export type AlertSeverity = 'info' | 'warning' | 'error';

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
    severity: AlertSeverity | ((data: TResponse) => AlertSeverity);
    /**
     * @description
     * A function that checks the condition and returns the response data.
     */
    check: () => Promise<TResponse> | TResponse;
    /**
     * @description
     * A function that determines whether the alert should be rendered based on the response data.
     */
    shouldShow: (data: TResponse) => boolean;
    /**
     * @description
     * The interval in milliseconds to recheck the condition.
     */
    recheckInterval?: number;
    /**
     * @description
     * Optional actions that can be performed when the alert is shown.
     *
     * The `onClick()` handler will receive the data returned by the `check` function,
     * as well as a `dismiss()` function that can be used to immediately dismiss the
     * current alert.
     */
    actions?: Array<{
        label: string;
        onClick: (args: { data: TResponse; dismiss: () => void }) => void | Promise<any>;
    }>;
}
