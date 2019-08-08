import {
    CreateShippingMethod,
    CreateShippingMethodInput,
    GetShippingMethod,
    GetShippingMethodList,
    GetShippingMethodOperations,
    TestShippingMethod,
    TestShippingMethodInput,
    UpdateShippingMethod,
    UpdateShippingMethodInput,
} from '../../common/generated-types';
import {
    CREATE_SHIPPING_METHOD,
    GET_SHIPPING_METHOD,
    GET_SHIPPING_METHOD_LIST,
    GET_SHIPPING_METHOD_OPERATIONS,
    TEST_SHIPPING_METHOD,
    UPDATE_SHIPPING_METHOD,
} from '../definitions/shipping-definitions';

import { BaseDataService } from './base-data.service';

export class ShippingMethodDataService {
    constructor(private baseDataService: BaseDataService) {}

    getShippingMethods(take: number = 10, skip: number = 0) {
        return this.baseDataService.query<GetShippingMethodList.Query, GetShippingMethodList.Variables>(
            GET_SHIPPING_METHOD_LIST,
            {
                options: {
                    take,
                    skip,
                },
            },
        );
    }

    getShippingMethod(id: string) {
        return this.baseDataService.query<GetShippingMethod.Query, GetShippingMethod.Variables>(
            GET_SHIPPING_METHOD,
            {
                id,
            },
        );
    }

    getShippingMethodOperations() {
        return this.baseDataService.query<GetShippingMethodOperations.Query>(GET_SHIPPING_METHOD_OPERATIONS);
    }

    createShippingMethod(input: CreateShippingMethodInput) {
        return this.baseDataService.mutate<CreateShippingMethod.Mutation, CreateShippingMethod.Variables>(
            CREATE_SHIPPING_METHOD,
            {
                input,
            },
        );
    }

    updateShippingMethod(input: UpdateShippingMethodInput) {
        return this.baseDataService.mutate<UpdateShippingMethod.Mutation, UpdateShippingMethod.Variables>(
            UPDATE_SHIPPING_METHOD,
            {
                input,
            },
        );
    }

    testShippingMethod(input: TestShippingMethodInput) {
        return this.baseDataService.query<TestShippingMethod.Query, TestShippingMethod.Variables>(
            TEST_SHIPPING_METHOD,
            {
                input,
            },
        );
    }
}
