import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { Apollo, APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { SharedModule } from '../shared/shared.module';
import { APOLLO_NGRX_CACHE, StateModule } from '../state/state.module';

export function createApollo(httpLink: HttpLink, ngrxCache: InMemoryCache) {
  return {
    link: httpLink.create({uri: 'http://localhost:3000/graphql'}),
    cache: ngrxCache,
  };
}

@NgModule({
    imports: [
        SharedModule,
        HttpClientModule,
        ApolloModule,
        HttpLinkModule,
        StateModule,
    ],
    exports: [
        SharedModule,
    ],
    providers: [
        {
            provide: APOLLO_OPTIONS,
            useFactory: createApollo,
            deps: [HttpLink, APOLLO_NGRX_CACHE],
        },
    ],
})
export class CoreModule {}
