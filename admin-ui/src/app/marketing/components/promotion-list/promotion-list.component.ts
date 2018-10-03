import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetAdjustmentSourceList } from 'shared/generated-types';

import { BaseListComponent } from '../../../common/base-list.component';
import { DataService } from '../../../data/providers/data.service';

@Component({
    selector: 'vdr-promotion-list',
    templateUrl: './promotion-list.component.html',
    styleUrls: ['./promotion-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromotionListComponent extends BaseListComponent<
    GetAdjustmentSourceList.Query,
    GetAdjustmentSourceList.Items
> {
    constructor(private dataService: DataService, router: Router, route: ActivatedRoute) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) => this.dataService.adjustmentSource.getPromotions(...args),
            data => data.adjustmentSources,
        );
    }
}
