import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { _ } from 'src/app/core/providers/i18n/mark-for-extraction';

import { BaseDetailComponent } from '../../../common/base-detail.component';
import { ModalService } from '../modal/modal.service';

@Injectable()
export class CanDeactivateDetailGuard implements CanDeactivate<BaseDetailComponent<any>> {
    constructor(private modalService: ModalService) {}

    canDeactivate(
        component: BaseDetailComponent<any>,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState?: RouterStateSnapshot,
    ): boolean | Observable<boolean> {
        if (component.detailForm && component.detailForm.dirty) {
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
