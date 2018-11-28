import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, scan, startWith, switchMap, tap } from 'rxjs/operators';
import { GetProductCategoryList, MoveProductCategoryInput } from 'shared/generated-types';

import { BaseListComponent } from '../../../common/base-list.component';
import { _ } from '../../../core/providers/i18n/mark-for-extraction';
import { NotificationService } from '../../../core/providers/notification/notification.service';
import { DataService } from '../../../data/providers/data.service';
import { RearrangeEvent } from '../product-category-tree/product-category-tree.component';

@Component({
    selector: 'vdr-product-category-list',
    templateUrl: './product-category-list.component.html',
    styleUrls: ['./product-category-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCategoryListComponent extends BaseListComponent<
    GetProductCategoryList.Query,
    GetProductCategoryList.Items
> {
    constructor(
        private dataService: DataService,
        private notificationService: NotificationService,
        router: Router,
        route: ActivatedRoute,
    ) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) => this.dataService.product.getProductCategories(99999, 0),
            data => data.productCategories,
        );
    }

    onRearrange(event: RearrangeEvent) {
        this.dataService.product.moveProductCategory([event]).subscribe({
            next: () => {
                this.notificationService.success(_('common.notify-saved-changes'));
                this.refresh();
            },
            error: err => {
                this.notificationService.error(_('common.notify-save-changes-error'));
            },
        });
    }
}
