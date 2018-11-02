import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetPaymentMethodList } from 'shared/generated-types';

import { BaseListComponent } from '../../../common/base-list.component';
import { DataService } from '../../../data/providers/data.service';

@Component({
    selector: 'vdr-payment-method-list',
    templateUrl: './payment-method-list.component.html',
    styleUrls: ['./payment-method-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentMethodListComponent extends BaseListComponent<
    GetPaymentMethodList.Query,
    GetPaymentMethodList.Items
> {
    constructor(private dataService: DataService, router: Router, route: ActivatedRoute) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) => this.dataService.settings.getPaymentMethods(...args),
            data => data.paymentMethods,
        );
    }
}
