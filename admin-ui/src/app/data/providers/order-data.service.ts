import {
    CreateFulfillment,
    CreateFulfillmentInput,
    GetOrder,
    GetOrderList,
    SettlePayment,
} from '../../common/generated-types';
import {
    CREATE_FULFILLMENT,
    GET_ORDER,
    GET_ORDERS_LIST,
    SETTLE_PAYMENT,
} from '../definitions/order-definitions';

import { BaseDataService } from './base-data.service';

export class OrderDataService {
    constructor(private baseDataService: BaseDataService) {}

    getOrders(take: number = 10, skip: number = 0) {
        return this.baseDataService.query<GetOrderList.Query, GetOrderList.Variables>(GET_ORDERS_LIST, {
            options: {
                take,
                skip,
            },
        });
    }

    getOrder(id: string) {
        return this.baseDataService.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, { id });
    }

    settlePayment(id: string) {
        return this.baseDataService.mutate<SettlePayment.Mutation, SettlePayment.Variables>(SETTLE_PAYMENT, {
            id,
        });
    }

    createFullfillment(input: CreateFulfillmentInput) {
        return this.baseDataService.mutate<CreateFulfillment.Mutation, CreateFulfillment.Variables>(
            CREATE_FULFILLMENT,
            {
                input,
            },
        );
    }
}
