import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { DeletionResult, GetTaxCategories, TaxCategory } from '../../../common/generated-types';
import { _ } from '../../../core/providers/i18n/mark-for-extraction';
import { NotificationService } from '../../../core/providers/notification/notification.service';
import { DataService } from '../../../data/providers/data.service';
import { QueryResult } from '../../../data/query-result';
import { ModalService } from '../../../shared/providers/modal/modal.service';

@Component({
    selector: 'vdr-tax-list',
    templateUrl: './tax-category-list.component.html',
    styleUrls: ['./tax-category-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaxCategoryListComponent {
    taxCategories$: Observable<TaxCategory.Fragment[]>;
    private queryResult: QueryResult<GetTaxCategories.Query>;

    constructor(
        private dataService: DataService,
        private notificationService: NotificationService,
        private modalService: ModalService,
    ) {
        this.queryResult = this.dataService.settings.getTaxCategories();
        this.taxCategories$ = this.queryResult.mapStream(data => data.taxCategories);
    }

    deleteTaxCategory(taxCategory: TaxCategory.Fragment) {
        return this.modalService
            .dialog({
                title: _('settings.confirm-delete-tax-category'),
                body: taxCategory.name,
                buttons: [
                    { type: 'secondary', label: _('common.cancel') },
                    { type: 'danger', label: _('common.delete'), returnValue: true },
                ],
            })
            .pipe(
                switchMap(res => (res ? this.dataService.settings.deleteTaxCategory(taxCategory.id) : EMPTY)),
                map(res => res.deleteTaxCategory),
            )
            .subscribe(
                res => {
                    if (res.result === DeletionResult.DELETED) {
                        this.notificationService.success(_('common.notify-delete-success'), {
                            entity: 'TaxRate',
                        });
                        this.queryResult.ref.refetch();
                    } else {
                        this.notificationService.error(res.message || _('common.notify-delete-error'), {
                            entity: 'TaxRate',
                        });
                    }
                },
                err => {
                    this.notificationService.error(_('common.notify-delete-error'), {
                        entity: 'TaxRate',
                    });
                },
            );
    }
}
