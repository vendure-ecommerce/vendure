import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseListComponent } from '../../../common/base-list.component';
import { GetTaxRateList } from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';

@Component({
    selector: 'vdr-tax-rate-list',
    templateUrl: './tax-rate-list.component.html',
    styleUrls: ['./tax-rate-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaxRateListComponent extends BaseListComponent<GetTaxRateList.Query, GetTaxRateList.Items> {
    constructor(private dataService: DataService, router: Router, route: ActivatedRoute) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) => this.dataService.settings.getTaxRates(...args),
            data => data.taxRates,
        );
    }
}
