import {
    ActivatedRouteSnapshot,
    ActivationStart,
    Resolve,
    ResolveData,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { Type } from '@vendure/common/lib/shared-types';
import { notNullOrUndefined } from '@vendure/common/lib/shared-utils';
import { Observable, of } from 'rxjs';
import { filter, map, shareReplay, take, takeUntil } from 'rxjs/operators';

export interface EntityResolveData<R> extends ResolveData {
    entity: Type<BaseEntityResolver<R>>;
}

export function createResolveData<T extends BaseEntityResolver<R>, R>(
    resolver: Type<T>,
): EntityResolveData<R> {
    return {
        entity: resolver,
    };
}

/**
 * A base resolver for an entity detail route. Resolves to an observable of the given entity, or a "blank"
 * version if the route id equals "create".
 */
export class BaseEntityResolver<T> implements Resolve<Observable<T>> {
    constructor(
        protected router: Router,
        private readonly emptyEntity: T,
        private entityStream: (id: string) => Observable<T | null | undefined>,
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Observable<T>> {
        const id = route.paramMap.get('id');

        // Complete the entity stream upon navigating away
        const navigateAway$ = this.router.events.pipe(filter(event => event instanceof ActivationStart));

        if (id === 'create') {
            return of(of(this.emptyEntity));
        } else {
            const stream = this.entityStream(id || '').pipe(
                takeUntil(navigateAway$),
                filter(notNullOrUndefined),
                shareReplay(1),
            );

            return stream.pipe(
                take(1),
                map(() => stream),
            );
        }
    }
}
