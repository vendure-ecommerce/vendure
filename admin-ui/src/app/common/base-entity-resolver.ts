import { ActivatedRouteSnapshot, Resolve, ResolveData, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, map, shareReplay, take } from 'rxjs/operators';
import { Type } from 'shared/shared-types';
import { notNullOrUndefined } from 'shared/shared-utils';

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
        private readonly emptyEntity: T,
        private entityStream: (id: string) => Observable<T | null | undefined>,
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Observable<T>> {
        const id = route.paramMap.get('id');

        if (id === 'create') {
            return of(of(this.emptyEntity));
        } else {
            const stream = this.entityStream(id || '').pipe(
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
