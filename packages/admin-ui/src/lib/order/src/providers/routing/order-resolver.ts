import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, ActivationStart, Router, RouterStateSnapshot } from '@angular/router';
import { DataService, OrderDetailFragment } from '@vendure/admin-ui/core';
import { notNullOrUndefined } from '@vendure/common/lib/shared-utils';
import { EMPTY, Observable } from 'rxjs';
import { filter, map, shareReplay, switchMap, take, takeUntil } from 'rxjs/operators';

import { DraftOrderDetailComponent } from '../../components/draft-order-detail/draft-order-detail.component';

/**
 * Resolves the id from the path into a Customer entity.
 */
@Injectable({
    providedIn: 'root',
})
export class OrderResolver  {
    constructor(private router: Router, private dataService: DataService) {}

    /** @internal */
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<Observable<OrderDetailFragment>> {
        const id = route.paramMap.get('id');

        // Complete the entity stream upon navigating away
        const navigateAway$ = this.router.events.pipe(filter(event => event instanceof ActivationStart));

        const stream = this.dataService.order
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            .getOrder(id!)
            .mapStream(data => data.order)
            .pipe(
                switchMap(order => {
                    if (order?.state === 'Draft' && route.component !== DraftOrderDetailComponent) {
                        // Make sure Draft orders only get displayed with the DraftOrderDetailComponent
                        this.router.navigate(['/orders/draft', id]);
                        return EMPTY;
                    } else {
                        return [order];
                    }
                }),
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
