/**
 * @description
 * Configuration options for the {@link SentryPlugin}.
 *
 * @docsCategory core plugins/SentryPlugin
 */
export interface SentryPluginOptions {
    /**
     * @description
     * Whether to include the error test mutation in the admin API.
     * @default false
     */
    includeErrorTestMutation?: boolean;
}
