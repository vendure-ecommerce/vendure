import { ApolloQueryResult, NetworkStatus } from '@apollo/client/core';
import { notNullOrUndefined } from '@vendure/common/lib/shared-utils';
import { Apollo, QueryRef } from 'apollo-angular';
import { merge, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, finalize, map, skip, take, takeUntil, tap } from 'rxjs/operators';

import { GetUserStatusQuery } from '../common/generated-types';

import { GET_USER_STATUS } from './definitions/client-definitions';

/**
 * @description
 * This class wraps the Apollo Angular QueryRef object and exposes some getters
 * for convenience.
 *
 * @docsCategory services
 * @docsPage DataService
 */
export class QueryResult<T, V extends Record<string, any> = Record<string, any>> {
    constructor(private queryRef: QueryRef<T, V>, private apollo: Apollo) {
        this.valueChanges = queryRef.valueChanges;
    }

    completed$ = new Subject<void>();
    private valueChanges: Observable<ApolloQueryResult<T>>;

    /**
     * @description
     * Re-fetch this query whenever the active Channel changes.
     */
    refetchOnChannelChange(): QueryResult<T, V> {
        const userStatus$ = this.apollo.watchQuery<GetUserStatusQuery>({
            query: GET_USER_STATUS,
        }).valueChanges;
        const activeChannelId$ = userStatus$.pipe(
            map(data => data.data.userStatus.activeChannelId),
            filter(notNullOrUndefined),
            distinctUntilChanged(),
            skip(1),
            takeUntil(this.completed$),
        );
        const loggedOut$ = userStatus$.pipe(
            map(data => data.data.userStatus.isLoggedIn),
            distinctUntilChanged(),
            skip(1),
            filter(isLoggedIn => !isLoggedIn),
            takeUntil(this.completed$),
        );

        this.valueChanges = merge(activeChannelId$, this.queryRef.valueChanges).pipe(
            tap(val => {
                if (typeof val === 'string') {
                    new Promise(resolve => setTimeout(resolve, 50)).then(() => this.queryRef.refetch());
                }
            }),
            filter<any>(val => typeof val !== 'string'),
            takeUntil(loggedOut$),
            takeUntil(this.completed$),
        );
        this.queryRef.valueChanges = this.valueChanges;
        return this;
    }

    /**
     * @description
     * Returns an Observable which emits a single result and then completes.
     */
    get single$(): Observable<T> {
        return this.valueChanges.pipe(
            filter(result => result.networkStatus === NetworkStatus.ready),
            take(1),
            map(result => result.data),
            finalize(() => {
                this.completed$.next();
                this.completed$.complete();
            }),
        );
    }

    /**
     * @description
     * Returns an Observable which emits until unsubscribed.
     */
    get stream$(): Observable<T> {
        return this.valueChanges.pipe(
            filter(result => result.networkStatus === NetworkStatus.ready),
            map(result => result.data),
            finalize(() => {
                this.completed$.next();
                this.completed$.complete();
            }),
        );
    }

    get ref(): QueryRef<T, V> {
        return this.queryRef;
    }

    /**
     * @description
     * Returns a single-result Observable after applying the map function.
     */
    mapSingle<R>(mapFn: (item: T) => R): Observable<R> {
        return this.single$.pipe(map(mapFn));
    }

    /**
     * @description
     * Returns a multiple-result Observable after applying the map function.
     */
    mapStream<R>(mapFn: (item: T) => R): Observable<R> {
        return this.stream$.pipe(map(mapFn));
    }
}
