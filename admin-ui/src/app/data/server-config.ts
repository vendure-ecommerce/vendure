import { Injectable, Injector } from '@angular/core';
import gql from 'graphql-tag';
import { GetServerConfig, ServerConfig } from 'shared/generated-types';

import { GET_SERVER_CONFIG } from './definitions/settings-definitions';
import { BaseDataService } from './providers/base-data.service';

export function initializeServerConfigService(serverConfigService: ServerConfigService): () => Promise<any> {
    return serverConfigService.init();
}

/**
 * A service which fetches the config from the server upon initialization, and then provides that config
 * to the components which require it.
 */
@Injectable()
export class ServerConfigService {
    private _serverConfig: ServerConfig = {} as any;

    constructor(private injector: Injector) {}

    /**
     * Fetches the ServerConfig. Should be run as part of the app bootstrap process by attaching
     * to the Angular APP_INITIALIZER token.
     */
    init(): () => Promise<any> {
        return () => this.getServerConfig();
    }

    /**
     * Fetch the ServerConfig. Should be run on app init (in case user is already logged in) and on successful login.
     */
    getServerConfig() {
        const baseDataService = this.injector.get<BaseDataService>(BaseDataService);
        return baseDataService
            .query<GetServerConfig.Query>(GET_SERVER_CONFIG)
            .single$.toPromise()
            .then(
                result => {
                    this._serverConfig = result.globalSettings.serverConfig;
                },
                err => {
                    // Let the error fall through to be caught by the http interceptor.
                },
            );
    }

    get serverConfig(): ServerConfig {
        return this._serverConfig;
    }
}
