import { RequestContext } from '../../api/common/request-context';
import { Customer } from '../../entity/customer/customer.entity';
import { Order } from '../../entity/order/order.entity';
import { OrderState } from '../../service/helpers/order-state-machine/order-state';
import { VendureEvent } from '../vendure-event';

export class OrderStateTransitionEvent extends VendureEvent {
    constructor(
        public fromState: OrderState,
        public toState: OrderState,
        public ctx: RequestContext,
        public order: Order,
    ) {
        super();
    }
}
