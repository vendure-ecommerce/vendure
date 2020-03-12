import {
    CreateAddressInput,
    CreateCustomer,
    CreateCustomerAddress,
    CreateCustomerInput,
    GetCustomer,
    GetCustomerList,
    OrderListOptions,
    UpdateAddressInput,
    UpdateCustomer,
    UpdateCustomerAddress,
    UpdateCustomerInput,
} from '../../common/generated-types';
import {
    CREATE_CUSTOMER,
    CREATE_CUSTOMER_ADDRESS,
    GET_CUSTOMER,
    GET_CUSTOMER_LIST,
    UPDATE_CUSTOMER,
    UPDATE_CUSTOMER_ADDRESS,
} from '../definitions/customer-definitions';

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

    getCustomer(id: string, orderListOptions?: OrderListOptions) {
        return this.baseDataService.query<GetCustomer.Query, GetCustomer.Variables>(GET_CUSTOMER, {
            id,
            orderListOptions,
        });
    }

    createCustomer(input: CreateCustomerInput, password?: string) {
        return this.baseDataService.mutate<CreateCustomer.Mutation, CreateCustomer.Variables>(
            CREATE_CUSTOMER,
            {
                input,
                password,
            },
        );
    }

    updateCustomer(input: UpdateCustomerInput) {
        return this.baseDataService.mutate<UpdateCustomer.Mutation, UpdateCustomer.Variables>(
            UPDATE_CUSTOMER,
            {
                input,
            },
        );
    }

    createCustomerAddress(customerId: string, input: CreateAddressInput) {
        return this.baseDataService.mutate<CreateCustomerAddress.Mutation, CreateCustomerAddress.Variables>(
            CREATE_CUSTOMER_ADDRESS,
            {
                customerId,
                input,
            },
        );
    }

    updateCustomerAddress(input: UpdateAddressInput) {
        return this.baseDataService.mutate<UpdateCustomerAddress.Mutation, UpdateCustomerAddress.Variables>(
            UPDATE_CUSTOMER_ADDRESS,
            {
                input,
            },
        );
    }
}
