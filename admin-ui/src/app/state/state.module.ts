import { InjectionToken, NgModule } from '@angular/core';
import { Store, StoreModule } from '@ngrx/store';
import { apolloReducer, NgrxCache, NgrxCacheModule } from 'apollo-angular-cache-ngrx';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { environment } from '../../environments/environment';

import { actionLogger } from './action-logger';
import { ApiActions } from './api/api-actions';
import { api } from './api/api-reducer';
import { StateStore } from './state-store.service';
import { UserActions } from './user/user-actions';
import { user } from './user/user-reducer';

export const APOLLO_NGRX_CACHE = new InjectionToken<InMemoryCache>('APOLLO_NGRX_CACHE');

export function createApolloNgrxCache(ngrxCache: NgrxCache, store: Store<any>): InMemoryCache {
    return ngrxCache.create();
}

export const metaReducers = environment.production ? [] : [actionLogger];

@NgModule({
    imports: [
        NgrxCacheModule,
        StoreModule.forRoot({
            entities: apolloReducer,
            api,
            user,
        }, { metaReducers }),
        NgrxCacheModule.forRoot('entities'),
    ],
    providers: [
        {
            provide: APOLLO_NGRX_CACHE,
            useFactory: createApolloNgrxCache,
            deps: [NgrxCache, Store],
        },
        UserActions,
        StateStore,
        ApiActions,
    ],
})
export class StateModule {}
