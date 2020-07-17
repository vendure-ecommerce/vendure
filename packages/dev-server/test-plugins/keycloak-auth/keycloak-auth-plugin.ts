import {
    createProxyHandler,
    OnVendureBootstrap,
    OnVendureClose,
    PluginCommonModule,
    VendurePlugin,
} from '@vendure/core';
import express from 'express';
import { Server } from 'http';
import path from 'path';

import { KeycloakAuthenticationStrategy } from './keycloak-authentication-strategy';

/**
 * A demo plugin which configures an AuthenticationStrategy for a KeyCloak ID server.
 *
 * Assumes that KeyCloak is running on port 9000, with a realm configured named "myrealm"
 * and a client named "vendure".
 *
 * Add the plugin to the VendureConfig and set the Admin UI `loginUrl` option to
 * "http://localhost:3000/keycloak-login".
 *
 * Video demo of this: https://youtu.be/Tj4kwjNd2nM
 */
@VendurePlugin({
    imports: [PluginCommonModule],
    configuration: (config) => {
        config.authOptions.adminAuthenticationStrategy = [
            ...config.authOptions.adminAuthenticationStrategy,
            new KeycloakAuthenticationStrategy(),
        ];
        config.apiOptions.middleware.push({
            handler: createProxyHandler({
                port: 3042,
                route: 'keycloak-login',
                label: 'Keycloak Login',
                basePath: '',
            }),
            route: 'keycloak-login',
        });
        return config;
    },
})
export class KeycloakAuthPlugin implements OnVendureBootstrap, OnVendureClose {
    private staticServer: Server;

    onVendureBootstrap() {
        // Set up a static express server to serve the demo login page
        // from public/index.html.
        const app = express();
        app.use(express.static(path.join(__dirname, 'public')));
        this.staticServer = app.listen(3042);
    }

    onVendureClose(): void | Promise<void> {
        return new Promise((resolve, reject) => {
            this.staticServer.close((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}
