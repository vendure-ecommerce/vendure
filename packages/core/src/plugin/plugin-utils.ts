import { notNullOrUndefined } from '@vendure/common/lib/shared-utils';
import proxy from 'http-proxy-middleware';

import { APIExtensionDefinition, Logger, VendureConfig, VendurePlugin } from '../config';

/**
 * @description
 * Options to configure the proxy middleware.
 *
 * @docsCategory Plugin
 */
export interface ProxyOptions {
    /**
     * @description
     * A human-readable label for the service which is being proxied. Used to
     * generate more informative logs.
     */
    label: string;
    /**
     * @description
     * The route of the Vendure server which will act as the proxy url.
     */
    route: string;
    /**
     * @description
     * The port on which the service being proxied is running.
     */
    port: number;
    /**
     * @description
     * The hostname of the server on which the service being proxied is running.
     *
     * @default 'localhost'
     */
    hostname?: string;
}

/**
 * @description
 * Creates a proxy middleware which proxies the given route to the given port.
 * Useful for plugins which start their own servers but should be accessible
 * via the main Vendure url.
 *
 * @docsCategory Plugin
 */
export function createProxyHandler(options: ProxyOptions) {
    const route = options.route.charAt(0) === '/' ? options.route : '/' + options.route;
    const proxyHostname = options.hostname || 'localhost';
    const middleware = proxy({
        // TODO: how do we detect https?
        target: `http://${proxyHostname}:${options.port}`,
        pathRewrite: {
            [`^${route}`]: `/`,
        },
        logProvider(provider: proxy.LogProvider): proxy.LogProvider {
            return {
                log(message: string) {
                    Logger.debug(message, options.label);
                },
                debug(message: string) {
                    Logger.debug(message, options.label);
                },
                info(message: string) {
                    Logger.debug(message, options.label);
                },
                warn(message: string) {
                    Logger.warn(message, options.label);
                },
                error(message: string) {
                    Logger.error(message, options.label);
                },
            };
        },
    });
    // Attach the options to the middleware function to allow
    // the info to be logged after bootstrap.
    (middleware as any).proxyMiddleware = options;
    return middleware;
}

/**
 * If any proxy middleware has been set up using the createProxyHandler function, log this information.
 */
export function logProxyMiddlewares(config: VendureConfig) {
    for (const middleware of config.middleware || []) {
        if ((middleware.handler as any).proxyMiddleware) {
            const { port, hostname, label, route } = (middleware.handler as any).proxyMiddleware as ProxyOptions;
            Logger.info(`${label}: http://${config.hostname || 'localhost'}:${config.port}/${route}/ -> http://${hostname || 'localhost'}:${port}`);
        }
    }
}

/**
 * Given an array of VendurePlugins, returns a flattened array of all APIExtensionDefinitions.
 */
export function getPluginAPIExtensions(
    plugins: VendurePlugin[],
    apiType: 'shop' | 'admin',
): APIExtensionDefinition[] {
    const extensions =
        apiType === 'shop'
            ? plugins.map(p => (p.extendShopAPI ? p.extendShopAPI() : undefined))
            : plugins.map(p => (p.extendAdminAPI ? p.extendAdminAPI() : undefined));

    return extensions.filter(notNullOrUndefined);
}
