import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseListComponent } from '../../../common/base-list.component';
import { GetShippingMethodList } from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';

@Component({
    selector: 'vdr-shipping-method-list',
    templateUrl: './shipping-method-list.component.html',
    styleUrls: ['./shipping-method-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShippingMethodListComponent extends BaseListComponent<
    GetShippingMethodList.Query,
    GetShippingMethodList.Items
> {
    constructor(private dataService: DataService, router: Router, route: ActivatedRoute) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) => this.dataService.shippingMethod.getShippingMethods(...args),
            data => data.shippingMethods,
        );
    }
}
