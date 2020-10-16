import { OrderService } from './../../../service/services/order.service';
import { Query, Resolver } from '@nestjs/graphql';
import {
    Permission,
} from '@vendure/common/lib/generated-types';

import { Allow } from '../../decorators/allow.decorator';
import { OrderState } from '../../../service/helpers/order-state-machine/order-state';


@Resolver('OrderState')
export class OrderStateResolver {
    constructor(private orderService: OrderService) {}

    @Query()
    @Allow(Permission.ReadSettings)
    orderStates(): ReadonlyArray<OrderState> {
        return this.orderService.getOrderStates();
    }

}
