import { GetOrderList } from 'shared/generated-types';

import { getDefaultLanguage } from '../../common/utilities/get-default-language';
import { GET_ORDERS_LIST } from '../definitions/order-definitions';

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
}
