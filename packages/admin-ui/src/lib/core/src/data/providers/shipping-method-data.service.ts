import { pick } from '@vendure/common/lib/pick';

import * as Codegen from '../../common/generated-types';
import {
    CREATE_SHIPPING_METHOD,
    DELETE_SHIPPING_METHOD,
    GET_SHIPPING_METHOD,
    GET_SHIPPING_METHOD_LIST,
    GET_SHIPPING_METHOD_OPERATIONS,
    TEST_ELIGIBLE_SHIPPING_METHODS,
    TEST_SHIPPING_METHOD,
    UPDATE_SHIPPING_METHOD,
} from '../definitions/shipping-definitions';

import { BaseDataService } from './base-data.service';

export class ShippingMethodDataService {
    constructor(private baseDataService: BaseDataService) {}

    getShippingMethods(take: number = 10, skip: number = 0) {
        return this.baseDataService.query<
            Codegen.GetShippingMethodListQuery,
            Codegen.GetShippingMethodListQueryVariables
        >(GET_SHIPPING_METHOD_LIST, {
            options: {
                take,
                skip,
            },
        });
    }

    getShippingMethod(id: string) {
        return this.baseDataService.query<
            Codegen.GetShippingMethodQuery,
            Codegen.GetShippingMethodQueryVariables
        >(GET_SHIPPING_METHOD, {
            id,
        });
    }

    getShippingMethodOperations() {
        return this.baseDataService.query<Codegen.GetShippingMethodOperationsQuery>(
            GET_SHIPPING_METHOD_OPERATIONS,
        );
    }

    createShippingMethod(input: Codegen.CreateShippingMethodInput) {
        const variables: Codegen.CreateShippingMethodMutationVariables = {
            input: pick(input, [
                'code',
                'checker',
                'calculator',
                'fulfillmentHandler',
                'customFields',
                'translations',
            ]),
        };
        return this.baseDataService.mutate<
            Codegen.CreateShippingMethodMutation,
            Codegen.CreateShippingMethodMutationVariables
        >(CREATE_SHIPPING_METHOD, variables);
    }

    updateShippingMethod(input: Codegen.UpdateShippingMethodInput) {
        const variables: Codegen.UpdateShippingMethodMutationVariables = {
            input: pick(input, [
                'id',
                'code',
                'checker',
                'calculator',
                'fulfillmentHandler',
                'customFields',
                'translations',
            ]),
        };
        return this.baseDataService.mutate<
            Codegen.UpdateShippingMethodMutation,
            Codegen.UpdateShippingMethodMutationVariables
        >(UPDATE_SHIPPING_METHOD, variables);
    }

    deleteShippingMethod(id: string) {
        return this.baseDataService.mutate<
            Codegen.DeleteShippingMethodMutation,
            Codegen.DeleteShippingMethodMutationVariables
        >(DELETE_SHIPPING_METHOD, {
            id,
        });
    }

    testShippingMethod(input: Codegen.TestShippingMethodInput) {
        return this.baseDataService.query<
            Codegen.TestShippingMethodQuery,
            Codegen.TestShippingMethodQueryVariables
        >(TEST_SHIPPING_METHOD, {
            input,
        });
    }

    testEligibleShippingMethods(input: Codegen.TestEligibleShippingMethodsInput) {
        return this.baseDataService.query<
            Codegen.TestEligibleShippingMethodsQuery,
            Codegen.TestEligibleShippingMethodsQueryVariables
        >(TEST_ELIGIBLE_SHIPPING_METHODS, {
            input,
        });
    }
}
