import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetCollectionList } from 'shared/generated-types';

import { BaseListComponent } from '../../../common/base-list.component';
import { _ } from '../../../core/providers/i18n/mark-for-extraction';
import { NotificationService } from '../../../core/providers/notification/notification.service';
import { DataService } from '../../../data/providers/data.service';
import { RearrangeEvent } from '../collection-tree/collection-tree.component';

@Component({
    selector: 'vdr-collection-list',
    templateUrl: './collection-list.component.html',
    styleUrls: ['./collection-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionListComponent extends BaseListComponent<
    GetCollectionList.Query,
    GetCollectionList.Items
> {
    constructor(
        private dataService: DataService,
        private notificationService: NotificationService,
        router: Router,
        route: ActivatedRoute,
    ) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) => this.dataService.product.getCollections(99999, 0),
            data => data.collections,
        );
    }

    onRearrange(event: RearrangeEvent) {
        this.dataService.product.moveCollection([event]).subscribe({
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
