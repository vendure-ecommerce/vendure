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
     * When enabled, a `createTestError` mutation becomes available in
     * the Admin API, which can be used to create different types of error
     * to check that the integration is working correctly.
     *
     * @default false
     */
    includeErrorTestMutation?: boolean;
}
