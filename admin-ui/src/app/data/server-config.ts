import { Injectable, Injector } from '@angular/core';
import { GetServerConfig } from 'shared/generated-types';

import { GET_SERVER_CONFIG } from './definitions/config-definitions';
import { BaseDataService } from './providers/base-data.service';

export type ServerConfig = GetServerConfig.Config;

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
        const baseDataService = this.injector.get<BaseDataService>(BaseDataService);
        return () =>
            baseDataService
                .query<GetServerConfig.Query>(GET_SERVER_CONFIG)
                .single$.toPromise()
                .then(
                    result => {
                        this._serverConfig = result.config;
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
