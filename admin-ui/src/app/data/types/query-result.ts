import { QueryRef } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

/**
 * This class wraps the Apollo Angular QueryRef object and exposes some getters
 * for convenience.
 */
export class QueryResult<T, V = Record<string, any>> {
    constructor(private queryRef: QueryRef<T, V>) {}

    /**
     * Returns an Observable which emits a single result and then completes.
     */
    get single$(): Observable<T> {
        return this.queryRef.valueChanges.pipe(
            take(1),
            map(result => result.data),
        );
    }

    /**
     * Returns an Observable which emits until unsubscribed.
     */
    get stream$(): Observable<T> {
        return this.queryRef.valueChanges.pipe(
            map(result => result.data),
        );
    }

    get ref(): QueryRef<T, V> {
        return this.queryRef;
    }

    /**
     * Returns a single-result Observable after applying the map function.
     */
    mapSingle<R>(mapFn: (item: T) => R): Observable<R> {
        return this.single$.pipe(
            map(mapFn),
        );
    }

    /**
     * Returns a multiple-result Observable after applying the map function.
     */
    mapStream<R>(mapFn: (item: T) => R): Observable<R> {
        return this.stream$.pipe(
            map(mapFn),
        );
    }

}
