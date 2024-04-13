import { pick } from '@vendure/common/lib/pick';
import * as Codegen from '../../common/generated-types';
import {
    GET_PAYMENT_METHOD,
    GET_PAYMENT_METHOD_LIST,
    CREATE_PAYMENT_METHOD,
    DELETE_PAYMENT_METHOD,
    DELETE_PAYMENT_METHODS,
    GET_PAYMENT_METHOD_OPERATIONS,
    UPDATE_PAYMENT_METHOD,
} from '../definitions/payment-method-definitions';
import { BaseDataService } from './base-data.service';

export class PaymentMethodDataService {
    constructor(private baseDataService: BaseDataService) {}

    getPaymentMethods(options: Codegen.PaymentMethodListOptions) {
        return this.baseDataService.query<
            Codegen.GetPaymentMethodListQuery,
            Codegen.GetPaymentMethodListQueryVariables
        >(GET_PAYMENT_METHOD_LIST, {
            options,
        });
    }

    getPaymentMethod(id: string) {
        return this.baseDataService.query<
            Codegen.GetPaymentMethodQuery,
            Codegen.GetPaymentMethodQueryVariables
        >(GET_PAYMENT_METHOD, { id });
    }

    createPaymentMethod(input: Codegen.CreatePaymentMethodInput) {
        return this.baseDataService.mutate<
            Codegen.CreatePaymentMethodMutation,
            Codegen.CreatePaymentMethodMutationVariables
        >(CREATE_PAYMENT_METHOD, {
            input: pick(input, ['code', 'checker', 'handler', 'enabled', 'translations', 'customFields']),
        });
    }

    updatePaymentMethod(input: Codegen.UpdatePaymentMethodInput) {
        return this.baseDataService.mutate<
            Codegen.UpdatePaymentMethodMutation,
            Codegen.UpdatePaymentMethodMutationVariables
        >(UPDATE_PAYMENT_METHOD, {
            input: pick(input, [
                'id',
                'code',
                'checker',
                'handler',
                'enabled',
                'translations',
                'customFields',
            ]),
        });
    }

    deletePaymentMethod(id: string, force: boolean) {
        return this.baseDataService.mutate<
            Codegen.DeletePaymentMethodMutation,
            Codegen.DeletePaymentMethodMutationVariables
        >(DELETE_PAYMENT_METHOD, {
            id,
            force,
        });
    }

    deletePaymentMethods(ids: string[], force: boolean) {
        return this.baseDataService.mutate<
            Codegen.DeletePaymentMethodsMutation,
            Codegen.DeletePaymentMethodsMutationVariables
        >(DELETE_PAYMENT_METHODS, {
            ids,
            force,
        });
    }

    getPaymentMethodOperations() {
        return this.baseDataService.query<Codegen.GetPaymentMethodOperationsQuery>(
            GET_PAYMENT_METHOD_OPERATIONS,
        );
    }
}
