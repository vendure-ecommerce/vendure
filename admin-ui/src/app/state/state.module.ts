import { InjectionToken, NgModule } from '@angular/core';
import { Store, StoreModule } from '@ngrx/store';
import { apolloReducer, NgrxCache, NgrxCacheModule } from 'apollo-angular-cache-ngrx';
import { InMemoryCache } from 'apollo-cache-inmemory';

export const APOLLO_NGRX_CACHE = new InjectionToken<InMemoryCache>('APOLLO_NGRX_CACHE');

export function createApolloNgrxCache(ngrxCache: NgrxCache, store: Store<any>): InMemoryCache {
    const cache = ngrxCache.create();
    (window as any).getState = () => {
        // tslint:disable-next-line
        store.select(state => state).subscribe(state => console.log(state));
    };
    return cache;
}

@NgModule({
    imports: [
        NgrxCacheModule,
        StoreModule.forRoot({
            entities: apolloReducer,
        }),
        NgrxCacheModule.forRoot('entities'),
    ],
    providers: [
        {
            provide: APOLLO_NGRX_CACHE,
            useFactory: createApolloNgrxCache,
            deps: [NgrxCache, Store],
        },
    ],
})
export class StateModule {}
