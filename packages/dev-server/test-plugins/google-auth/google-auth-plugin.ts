import { INestApplication } from '@nestjs/common';
import { OnVendureBootstrap, OnVendureClose, PluginCommonModule, VendurePlugin } from '@vendure/core';
import express from 'express';
import { Server } from 'http';
import path from 'path';

import { GoogleAuthenticationStrategy } from './google-authentication-strategy';

export type GoogleAuthPluginOptions = {
    clientId: string;
};

@VendurePlugin({
    imports: [PluginCommonModule],
    configuration: config => {
        config.authOptions.shopAuthenticationStrategy = [
            ...config.authOptions.shopAuthenticationStrategy,
            new GoogleAuthenticationStrategy(GoogleAuthPlugin.options.clientId),
        ];
        return config;
    },
})
export class GoogleAuthPlugin implements OnVendureBootstrap, OnVendureClose {
    static options: GoogleAuthPluginOptions;
    private staticServer: Server;

    static init(options: GoogleAuthPluginOptions) {
        this.options = options;
        return GoogleAuthPlugin;
    }

    onVendureBootstrap() {
        // Set up a static express server to serve the demo login page
        // from public/index.html.
        const app = express();
        app.use(express.static(path.join(__dirname, 'public')));
        this.staticServer = app.listen(80);
    }

    onVendureClose(): void | Promise<void> {
        return new Promise((resolve, reject) => {
            this.staticServer.close(err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}
