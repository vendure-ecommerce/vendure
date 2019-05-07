import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseDetailComponent } from '../../../common/base-detail.component';
import { Order, OrderWithLines } from '../../../common/generated-types';
import { ServerConfigService } from '../../../data/server-config';

@Component({
    selector: 'vdr-order-detail',
    templateUrl: './order-detail.component.html',
    styleUrls: ['./order-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetailComponent extends BaseDetailComponent<OrderWithLines.Fragment>
    implements OnInit, OnDestroy {
    detailForm = new FormGroup({});
    constructor(router: Router, route: ActivatedRoute, serverConfigService: ServerConfigService) {
        super(route, router, serverConfigService);
    }

    ngOnInit() {
        this.init();
    }

    ngOnDestroy() {
        this.destroy();
    }

    getShippingAddressLines(shippingAddress?: { [key: string]: string }): string[] {
        if (!shippingAddress) {
            return [];
        }
        return Object.values(shippingAddress).filter(val => val !== 'ShippingAddress');
    }

    getPaymentMetadata(payment: OrderWithLines.Payments) {
        return Object.entries(payment.metadata);
    }

    protected setFormValues(entity: Order.Fragment): void {
        // empty
    }
}
