import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseDetailComponent } from '../../../common/base-detail.component';
import { ConfirmNavigationDialogComponent } from '../../components/confirm-navigation-dialog/confirm-navigation-dialog.component';
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
                .fromComponent(ConfirmNavigationDialogComponent)
                .pipe(map(result => !!result));
        } else {
            return true;
        }
    }
}
