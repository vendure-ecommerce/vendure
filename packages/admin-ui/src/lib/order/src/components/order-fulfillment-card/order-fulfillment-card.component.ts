import { ChangeDetectionStrategy, Component, Input, Output } from '@angular/core';
import { OrderDetail } from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-order-fulfillment-detail',
    templateUrl: './order-fulfillment-card.component.html',
    styleUrls: ['./order-fulfillment-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderFulfillmentCardComponent {
    @Input() fulfillment: OrderDetail.Fulfillments;
}
