import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetAdjustmentSourceList } from 'shared/generated-types';

import { BaseListComponent } from '../../../common/base-list.component';
import { DataService } from '../../../data/providers/data.service';

@Component({
    selector: 'vdr-tax-list',
    templateUrl: './tax-category-list.component.html',
    styleUrls: ['./tax-category-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaxCategoryListComponent extends BaseListComponent<
    GetAdjustmentSourceList.Query,
    GetAdjustmentSourceList.Items
> {
    constructor(private dataService: DataService, router: Router, route: ActivatedRoute) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) => this.dataService.adjustmentSource.getTaxCategories(...args),
            data => data.adjustmentSources,
        );
    }
}
