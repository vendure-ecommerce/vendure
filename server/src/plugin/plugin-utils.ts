import proxy from 'http-proxy-middleware';

export interface ProxyOptions {
    route: string;
    port: number;
    hostname?: string;
}

/**
 * Configures the proxy middleware which will be passed to the main Vendure server. This
 * will proxy all asset requests to the dedicated asset server.
 */
export function createProxyHandler(options: ProxyOptions, logging: boolean) {
    const route = options.route.charAt(0) === '/' ? options.route : '/' + options.route;
    const proxyHostname = options.hostname || 'localhost';
    return proxy({
        // TODO: how do we detect https?
        target: `http://${proxyHostname}:${options.port}`,
        pathRewrite: {
            [`^${route}`]: `/`,
        },
        logLevel: logging ? 'info' : 'silent',
    });
}
