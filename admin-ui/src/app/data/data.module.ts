import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClientOptions } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { withClientState } from 'apollo-link-state';
import { createUploadLink } from 'apollo-upload-client';
import { API_PATH, REFRESH_TOKEN_KEY } from 'shared/shared-constants';

import { environment } from '../../environments/environment';
import { API_URL } from '../app.config';
import { LocalStorageService } from '../core/providers/local-storage/local-storage.service';

import { clientDefaults } from './client-state/client-defaults';
import { clientResolvers } from './client-state/client-resolvers';
import { OmitTypenameLink } from './omit-typename-link';
import { BaseDataService } from './providers/base-data.service';
import { DataService } from './providers/data.service';
import { FetchAdapter } from './providers/fetch-adapter';
import { DefaultInterceptor } from './providers/interceptor';
import { initializeServerConfigService, ServerConfigService } from './server-config';

const apolloCache = new InMemoryCache();

if (!environment.production) {
    // make the Apollo Cache inspectable in the console for debug purposes
    (window as any)['apolloCache'] = apolloCache;
}

const stateLink = withClientState({
    cache: apolloCache,
    resolvers: clientResolvers,
    defaults: clientDefaults,
});

export function createApollo(
    localStorageService: LocalStorageService,
    fetchAdapter: FetchAdapter,
): ApolloClientOptions<any> {
    return {
        link: ApolloLink.from([
            stateLink,
            new OmitTypenameLink(),
            setContext(() => {
                // Add JWT auth token & channel token to all requests.
                const channelToken = localStorageService.get('activeChannelToken');
                const authToken = localStorageService.get('authToken') || '';
                const refreshToken = localStorageService.get('refreshToken') || '';
                if (!authToken) {
                    return {};
                } else {
                    return {
                        // prettier-ignore
                        headers: {
                            'Authorization': `Bearer ${authToken}`,
                            'vendure-token': channelToken,
                            [REFRESH_TOKEN_KEY]: refreshToken,
                        }
                    };
                }
            }),
            createUploadLink({
                uri: `${API_URL}/${API_PATH}`,
                fetch: fetchAdapter.fetch,
            }),
        ]),
        cache: apolloCache,
    };
}

/**
 * The DataModule is responsible for all API calls *and* serves as the source of truth for global app
 * state via the apollo-link-state package.
 */
@NgModule({
    imports: [ApolloModule, HttpClientModule],
    exports: [],
    declarations: [],
    providers: [
        BaseDataService,
        DataService,
        FetchAdapter,
        ServerConfigService,
        {
            provide: APOLLO_OPTIONS,
            useFactory: createApollo,
            deps: [LocalStorageService, FetchAdapter],
        },
        { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
        {
            provide: APP_INITIALIZER,
            multi: true,
            useFactory: initializeServerConfigService,
            deps: [ServerConfigService],
        },
    ],
})
export class DataModule {}
