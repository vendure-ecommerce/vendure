import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClientOptions } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { withClientState } from 'apollo-link-state';
import { createUploadLink } from 'apollo-upload-client';

import { environment } from '../../environments/environment';
import { getAppConfig } from '../app.config';
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
    const { apiHost, apiPort, adminApiPath } = getAppConfig();
    return {
        link: ApolloLink.from([
            stateLink,
            new OmitTypenameLink(),
            setContext(() => {
                const channelToken = localStorageService.get('activeChannelToken');
                if (channelToken) {
                    return {
                        headers: {
                            'vendure-token': channelToken,
                        },
                    };
                }
            }),
            createUploadLink({
                uri: `${apiHost}:${apiPort}/${adminApiPath}`,
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
