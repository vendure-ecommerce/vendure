import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { Apollo, APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClientOptions } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { withClientState } from 'apollo-link-state';

import { API_PATH } from '../../../../shared/shared-constants';
import { environment } from '../../environments/environment';
import { API_URL } from '../app.config';
import { LocalStorageService } from '../core/providers/local-storage/local-storage.service';

import { clientDefaults } from './client-state/client-defaults';
import { clientResolvers } from './client-state/client-resolvers';
import { OmitTypenameLink } from './omit-typename-link';
import { BaseDataService } from './providers/base-data.service';
import { DataService } from './providers/data.service';
import { DefaultInterceptor } from './providers/interceptor';
import { loadServerConfigFactory } from './server-config';

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
    httpLink: HttpLink,
    localStorageService: LocalStorageService,
): ApolloClientOptions<any> {
    return {
        link: ApolloLink.from([
            stateLink,
            new OmitTypenameLink(),
            setContext(() => {
                // Add JWT auth token & channel token to all requests.
                const channelToken = localStorageService.get('activeChannelToken');
                const authToken = localStorageService.get('authToken') || '';
                if (!authToken) {
                    return {};
                } else {
                    return {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                            'vendure-token': channelToken,
                        },
                    };
                }
            }),
            httpLink.create({ uri: `${API_URL}/${API_PATH}` }),
        ]),
        cache: apolloCache,
    };
}

/**
 * The DataModule is responsible for all API calls *and* serves as the source of truth for global app
 * state via the apollo-link-state package.
 */
@NgModule({
    imports: [ApolloModule, HttpLinkModule, HttpClientModule],
    exports: [],
    declarations: [],
    providers: [
        BaseDataService,
        DataService,
        {
            provide: APOLLO_OPTIONS,
            useFactory: createApollo,
            deps: [HttpLink, LocalStorageService],
        },
        { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
        {
            provide: APP_INITIALIZER,
            multi: true,
            useFactory: loadServerConfigFactory,
            deps: [Apollo],
        },
    ],
})
export class DataModule {}
