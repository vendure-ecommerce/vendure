import { ChangeDetectionStrategy, Component } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { EMPTY, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { DeletionResult, GetTaxCategories, TaxCategory } from '@vendure/admin-ui/core';
import { NotificationService } from '@vendure/admin-ui/core';
import { DataService } from '@vendure/admin-ui/core';
import { QueryResult } from '@vendure/admin-ui/core';
import { ModalService } from '@vendure/admin-ui/core';

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
