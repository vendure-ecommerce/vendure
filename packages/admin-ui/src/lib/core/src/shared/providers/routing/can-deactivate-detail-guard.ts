import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, Router, RouterStateSnapshot } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DeactivateAware } from '../../../common/deactivate-aware';
import { ModalService } from '../../../providers/modal/modal.service';

@Injectable()
export class CanDeactivateDetailGuard implements CanDeactivate<DeactivateAware> {
    constructor(private modalService: ModalService, private router: Router) {}

    canDeactivate(
        component: DeactivateAware,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState?: RouterStateSnapshot,
    ): boolean | Observable<boolean> {
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
