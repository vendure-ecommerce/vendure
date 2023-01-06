import { ChangeDetectionStrategy, Component } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { DataService, ModalService, NotificationService, SellerFragment } from '@vendure/admin-ui/core';
import { EMPTY, Observable, Subject } from 'rxjs';
import { mergeMap, startWith, switchMap } from 'rxjs/operators';

@Component({
    selector: 'vdr-seller-list',
    templateUrl: './seller-list.component.html',
    styleUrls: ['./seller-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SellerListComponent {
    sellers$: Observable<SellerFragment[]>;
    private refresh$ = new Subject();

    constructor(
        private dataService: DataService,
        private modalService: ModalService,
        private notificationService: NotificationService,
    ) {
        this.sellers$ = this.refresh$.pipe(
            startWith(1),
            switchMap(() => this.dataService.settings.getSellers().mapStream(data => data.sellers.items)),
        );
    }

    deleteSeller(id: string) {
        this.modalService
            .dialog({
                title: _('catalog.confirm-delete-seller'),
                buttons: [
                    { type: 'secondary', label: _('common.cancel') },
                    { type: 'danger', label: _('common.delete'), returnValue: true },
                ],
            })
            .pipe(switchMap(response => (response ? this.dataService.settings.deleteSeller(id) : EMPTY)))
            .subscribe(
                () => {
                    this.notificationService.success(_('common.notify-delete-success'), {
                        entity: 'Seller',
                    });
                    this.refresh$.next(1);
                },
                err => {
                    this.notificationService.error(_('common.notify-delete-error'), {
                        entity: 'Seller',
                    });
                },
            );
    }
}
