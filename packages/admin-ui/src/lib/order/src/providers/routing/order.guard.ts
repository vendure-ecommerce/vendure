import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { DataService } from '@vendure/admin-ui/core';
import { EMPTY, Observable } from 'rxjs';
import { map, mergeMapTo, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class OrderGuard  {
    constructor(private dataService: DataService, private router: Router) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const isDraft = state.url.includes('orders/draft');
        const id = route.paramMap.get('id');
        if (isDraft) {
            if (id === 'create') {
                return this.dataService.order
                    .createDraftOrder()
                    .pipe(
                        map(({ createDraftOrder }) =>
                            this.router.parseUrl(`/orders/draft/${createDraftOrder.id}`),
                        ),
                    );
            } else {
                return true;
            }
        } else {
            return true;
        }
    }
}
