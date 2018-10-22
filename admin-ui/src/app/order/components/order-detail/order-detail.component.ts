import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order, OrderWithLines } from 'shared/generated-types';

import { BaseDetailComponent } from '../../../common/base-detail.component';
import { ServerConfigService } from '../../../data/server-config';

@Component({
    selector: 'vdr-order-detail',
    templateUrl: './order-detail.component.html',
    styleUrls: ['./order-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetailComponent extends BaseDetailComponent<OrderWithLines.Fragment>
    implements OnInit, OnDestroy {
    constructor(router: Router, route: ActivatedRoute, serverConfigService: ServerConfigService) {
        super(route, router, serverConfigService);
    }

    ngOnInit() {
        this.init();
    }

    ngOnDestroy() {
        this.destroy();
    }

    protected setFormValues(entity: Order.Fragment): void {
        // empty
    }
}
