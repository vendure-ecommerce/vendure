import { GetOrder, GetOrderList } from '../../common/generated-types';
import { GET_ORDER, GET_ORDERS_LIST } from '../definitions/order-definitions';

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
}
