import { pick } from '@vendure/common/lib/pick';

import * as Codegen from '../../common/generated-types';
import {
    CREATE_PROMOTION,
    DELETE_PROMOTION,
    DELETE_PROMOTIONS,
    GET_ADJUSTMENT_OPERATIONS,
    GET_PROMOTION,
    GET_PROMOTION_LIST,
    UPDATE_PROMOTION,
} from '../definitions/promotion-definitions';

import { BaseDataService } from './base-data.service';

export class PromotionDataService {
    constructor(private baseDataService: BaseDataService) {}

    getPromotions(take: number = 10, skip: number = 0, filter?: Codegen.PromotionFilterParameter) {
        return this.baseDataService.query<
            Codegen.GetPromotionListQuery,
            Codegen.GetPromotionListQueryVariables
        >(GET_PROMOTION_LIST, {
            options: {
                take,
                skip,
                filter,
            },
        });
    }

    getPromotion(id: string) {
        return this.baseDataService.query<Codegen.GetPromotionQuery, Codegen.GetPromotionQueryVariables>(
            GET_PROMOTION,
            {
                id,
            },
        );
    }

    getPromotionActionsAndConditions() {
        return this.baseDataService.query<Codegen.GetAdjustmentOperationsQuery>(GET_ADJUSTMENT_OPERATIONS);
    }

    createPromotion(input: Codegen.CreatePromotionInput) {
        return this.baseDataService.mutate<
            Codegen.CreatePromotionMutation,
            Codegen.CreatePromotionMutationVariables
        >(CREATE_PROMOTION, {
            input: pick(input, [
                'conditions',
                'actions',
                'couponCode',
                'startsAt',
                'endsAt',
                'perCustomerUsageLimit',
                'enabled',
                'translations',
                'customFields',
            ]),
        });
    }

    updatePromotion(input: Codegen.UpdatePromotionInput) {
        return this.baseDataService.mutate<
            Codegen.UpdatePromotionMutation,
            Codegen.UpdatePromotionMutationVariables
        >(UPDATE_PROMOTION, {
            input: pick(input, [
                'id',
                'conditions',
                'actions',
                'couponCode',
                'startsAt',
                'endsAt',
                'perCustomerUsageLimit',
                'enabled',
                'translations',
                'customFields',
            ]),
        });
    }

    deletePromotion(id: string) {
        return this.baseDataService.mutate<
            Codegen.DeletePromotionMutation,
            Codegen.DeletePromotionMutationVariables
        >(DELETE_PROMOTION, { id });
    }

    deletePromotions(ids: string[]) {
        return this.baseDataService.mutate<
            Codegen.DeletePromotionsMutation,
            Codegen.DeletePromotionsMutationVariables
        >(DELETE_PROMOTIONS, { ids });
    }
}
