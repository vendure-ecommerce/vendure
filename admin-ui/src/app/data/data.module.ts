import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';

import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { withClientState } from 'apollo-link-state';
import gql from 'graphql-tag';
import { API_PATH } from '../../../../shared/shared-constants';
import { API_URL } from '../app.config';
import { BaseDataService } from './providers/base-data.service';
import { DataService } from './providers/data.service';
import { DefaultInterceptor } from './providers/interceptor';

// This is the same cache you pass into new ApolloClient
const apolloCache = new InMemoryCache();

(window as any)['apolloCache'] = apolloCache;

const stateLink = withClientState({
    cache: apolloCache,
    resolvers: {
        Mutation: {
            requestStarted: (_, __, { cache }) => {
                const query = gql`
                    query GetInFlightRequests {
                        network @client {
                            inFlightRequests
                        }
                    }
                `;
                const previous = cache.readQuery({ query });
                const data = {
                    network: {
                        __typename: 'Network',
                        inFlightRequests: previous.network.inFlightRequests + 1,
                    },
                };
                cache.writeData({ data });
                return null;
            },
            requestCompleted: (_, __, { cache }) => {
                const query = gql`
                    query GetInFlightRequests {
                        network @client {
                            inFlightRequests
                        }
                    }
                `;
                const previous = cache.readQuery({ query });
                const data = {
                    network: {
                        __typename: 'Network',
                        inFlightRequests: previous.network.inFlightRequests - 1,
                    },
                };
                cache.writeData({ data });
                return null;
            },
        },
    },
    defaults: {
        network: {
            inFlightRequests: 0,
            __typename: 'Network',
        },
    },
});

export function createApollo(httpLink: HttpLink) {
    return {
        link:  ApolloLink.from([stateLink, httpLink.create({ uri: `${API_URL}/${API_PATH}` })]),
        cache: apolloCache,
    };
}

@NgModule({
    imports: [
        ApolloModule,
        HttpLinkModule,
        HttpClientModule,
    ],
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
export class DataModule {
}
