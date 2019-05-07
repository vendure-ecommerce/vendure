import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseListComponent } from '../../../common/base-list.component';
import { GetPromotionList } from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';

@Component({
    selector: 'vdr-promotion-list',
    templateUrl: './promotion-list.component.html',
    styleUrls: ['./promotion-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromotionListComponent extends BaseListComponent<
    GetPromotionList.Query,
    GetPromotionList.Items
> {
    constructor(private dataService: DataService, router: Router, route: ActivatedRoute) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) => this.dataService.promotion.getPromotions(...args),
            data => data.promotions,
        );
    }
}
