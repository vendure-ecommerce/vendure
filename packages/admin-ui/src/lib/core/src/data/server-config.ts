import { Injectable, Injector } from '@angular/core';
import gql from 'graphql-tag';

import {
    CustomFieldConfig,
    CustomFields,
    GetGlobalSettings,
    GetServerConfig,
    ServerConfig,
} from '../common/generated-types';

import { GET_GLOBAL_SETTINGS, GET_SERVER_CONFIG } from './definitions/settings-definitions';
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

    private get baseDataService() {
        return this.injector.get<BaseDataService>(BaseDataService);
    }

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
        return this.baseDataService
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

    getAvailableLanguages() {
        return this.baseDataService
            .query<GetGlobalSettings.Query>(GET_GLOBAL_SETTINGS, {}, 'cache-first')
            .mapSingle(res => res.globalSettings.availableLanguages);
    }

    /**
     * When any of the GLobalSettings are modified, this method should be called to update the Apollo cache.
     */
    refreshGlobalSettings() {
        return this.baseDataService.query<GetGlobalSettings.Query>(GET_GLOBAL_SETTINGS, {}, 'network-only')
            .single$;
    }

    /**
     * Retrieves the custom field configs for the given entity type.
     */
    getCustomFieldsFor(type: Exclude<keyof CustomFields, '__typename'>): CustomFieldConfig[] {
        return this.serverConfig.customFieldConfig[type] || [];
    }

    get serverConfig(): ServerConfig {
        return this._serverConfig;
    }
}
