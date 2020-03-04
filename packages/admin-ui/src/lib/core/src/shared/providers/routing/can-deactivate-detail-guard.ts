import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, Router, RouterStateSnapshot } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DeactivateAware } from '../../../common/deactivate-aware';
import { ModalService } from '../../../providers/modal/modal.service';

/**
 * When added to the [state object](https://angular.io/api/router/NavigationExtras#state), this will
 * skip the CanDeactivateDetailGuard.
 */
export const IGNORE_CAN_DEACTIVATE_GUARD = 'IGNORE_CAN_DEACTIVATE_GUARD';

@Injectable()
export class CanDeactivateDetailGuard implements CanDeactivate<DeactivateAware> {
    constructor(private modalService: ModalService, private router: Router) {}

    canDeactivate(
        component: DeactivateAware,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState?: RouterStateSnapshot,
    ): boolean | Observable<boolean> {
        const nav = this.router.getCurrentNavigation();
        if (nav) {
            if (nav.extras.state && nav.extras.state[IGNORE_CAN_DEACTIVATE_GUARD] != null) {
                return true;
            }
        }
        if (!component.canDeactivate()) {
            return this.modalService
                .dialog({
                    title: _('common.confirm-navigation'),
                    body: _('common.there-are-unsaved-changes'),
                    buttons: [
                        { type: 'danger', label: _('common.discard-changes'), returnValue: true },
                        { type: 'primary', label: _('common.cancel-navigation'), returnValue: false },
                    ],
                })
                .pipe(map(result => !!result));
        } else {
            return true;
        }
    }
}
