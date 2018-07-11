import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';

import { API_PATH } from '../../../../shared/shared-constants';
import { environment } from '../../environments/environment';
import { API_URL } from '../app.config';

import { clientDefaults } from './client-state/client-defaults';
import { clientResolvers } from './client-state/client-resolvers';
import { OmitTypenameLink } from './omit-typename-link';
import { BaseDataService } from './providers/base-data.service';
import { DataService } from './providers/data.service';
import { DefaultInterceptor } from './providers/interceptor';

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

export function createApollo(httpLink: HttpLink) {
    return {
        link: ApolloLink.from([
            stateLink,
            new OmitTypenameLink(),
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
            deps: [HttpLink],
        },
        { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
    ],
})
export class DataModule {}
