import { GetCustomer, GetCustomerList } from 'shared/generated-types';

import { GET_CUSTOMER, GET_CUSTOMER_LIST } from '../definitions/customer-definitions';

import { BaseDataService } from './base-data.service';

export class CustomerDataService {
    constructor(private baseDataService: BaseDataService) {}

    getCustomerList(take: number = 10, skip: number = 0) {
        return this.baseDataService.query<GetCustomerList.Query, GetCustomerList.Variables>(
            GET_CUSTOMER_LIST,
            {
                options: {
                    take,
                    skip,
                },
            },
        );
    }

    getCustomer(id: string) {
        return this.baseDataService.query<GetCustomer.Query, GetCustomer.Variables>(GET_CUSTOMER, { id });
    }
}
