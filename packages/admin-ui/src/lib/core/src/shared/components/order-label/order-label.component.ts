import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { Order } from '../../../common/generated-types';

@Component({
    selector: 'vdr-order-label',
    templateUrl: './order-label.component.html',
    styleUrls: ['./order-label.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderLabelComponent {
    @Input() order: Order.Fragment;
}
