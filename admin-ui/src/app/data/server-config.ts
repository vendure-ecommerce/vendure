import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

import { CustomFields } from 'shared/shared-types';

export interface ServerConfig {
    customFields: CustomFields;
}

export interface GetConfigResponse {
    config: ServerConfig;
}

let serverConfig: ServerConfig;

/**
 * Fetches the ServerConfig. Should be run as part of the app bootstrap process by attaching
 * to the Angular APP_INITIALIZER token.
 */
export function loadServerConfigFactory(apollo: Apollo): () => Promise<ServerConfig> {
    return () => {
        // TODO: usethe gql tag function once graphql-js 14.0.0 is released
        // issue: https://github.com/graphql/graphql-js/issues/1344
        // note: the rc of 14.0.0 does not work with the apollo-cli used for codegen.
        // Test this when upgrading.
        const query = gql`
            query GetConfig {
                config {
                    customFields
                }
            }
        `;
        return apollo
            .query<GetConfigResponse>({ query })
            .toPromise()
            .then(result => {
                serverConfig = result.data.config;
                return serverConfig;
            });
    };
}

export function getServerConfig(): ServerConfig {
    return serverConfig;
}
