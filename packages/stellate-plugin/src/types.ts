import { PurgeRule } from './purge-rule';

/**
 * @description
 * Configuration options for the StellatePlugin.
 *
 * @docsCategory core plugins/StellatePlugin
 */
export interface StellatePluginOptions {
    /**
     * @description
     * The Stellate service name, i.e. `<service-name>.stellate.sh`
     */
    serviceName: string;
    /**
     * @description
     * The Stellate Purging API token. For instructions on how to generate the token,
     * see the [Stellate docs](https://docs.stellate.co/docs/purging-api#authentication)
     */
    apiToken: string;
    /**
     * @description
     * An array of {@link PurgeRule} instances which are used to define how the plugin will
     * respond to Vendure events in order to trigger calls to the Stellate Purging API.
     */
    purgeRules: PurgeRule[];
    /**
     * @description
     * When events are published, the PurgeRules will buffer those events in order to efficiently
     * batch requests to the Stellate Purging API. You may wish to change the default, e.g. if you are
     * running in a serverless environment and cannot introduce pauses after the main request has completed.
     *
     * @default 2000
     */
    defaultBufferTimeMs?: number;
    /**
     * @description
     * When set to `true`, calls will not be made to the Stellate Purge API.
     *
     * @default false
     */
    devMode?: boolean;
    /**
     * @description
     * If set to true, the plugin will log the calls that would be made
     * to the Stellate Purge API. Note, this generates a
     * lot of debug-level logging.
     *
     * @default false
     */
    debugLogging?: boolean;
}
