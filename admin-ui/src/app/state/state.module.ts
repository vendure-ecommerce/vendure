import { InjectionToken, NgModule } from '@angular/core';
import { Store, StoreModule } from '@ngrx/store';
import { apolloReducer, NgrxCache, NgrxCacheModule } from 'apollo-angular-cache-ngrx';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { StateStore } from './state-store.service';
import { UserActions } from './user/user-actions';
import { environment } from '../../environments/environment';
import { actionLogger } from './action-logger';
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
    ],
})
export class StateModule {}
