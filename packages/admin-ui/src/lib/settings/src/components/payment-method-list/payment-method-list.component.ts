import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseListComponent } from '@vendure/admin-ui/core';
import { GetPaymentMethodList } from '@vendure/admin-ui/core';
import { DataService } from '@vendure/admin-ui/core';

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
