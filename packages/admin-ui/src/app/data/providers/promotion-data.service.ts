import {
    CreatePromotion,
    CreatePromotionInput,
    DeletePromotion,
    GetAdjustmentOperations,
    GetPromotion,
    GetPromotionList,
    UpdatePromotion,
    UpdatePromotionInput,
} from '../../common/generated-types';
import {
    CREATE_PROMOTION,
    DELETE_PROMOTION,
    GET_ADJUSTMENT_OPERATIONS,
    GET_PROMOTION,
    GET_PROMOTION_LIST,
    UPDATE_PROMOTION,
} from '../definitions/promotion-definitions';

import { BaseDataService } from './base-data.service';

export class PromotionDataService {
    constructor(private baseDataService: BaseDataService) {}

    getPromotions(take: number = 10, skip: number = 0) {
        return this.baseDataService.query<GetPromotionList.Query, GetPromotionList.Variables>(
            GET_PROMOTION_LIST,
            {
                options: {
                    take,
                    skip,
                },
            },
        );
    }

    getPromotion(id: string) {
        return this.baseDataService.query<GetPromotion.Query, GetPromotion.Variables>(GET_PROMOTION, {
            id,
        });
    }

    getPromotionActionsAndConditions() {
        return this.baseDataService.query<GetAdjustmentOperations.Query>(GET_ADJUSTMENT_OPERATIONS);
    }

    createPromotion(input: CreatePromotionInput) {
        return this.baseDataService.mutate<CreatePromotion.Mutation, CreatePromotion.Variables>(
            CREATE_PROMOTION,
            {
                input,
            },
        );
    }

    updatePromotion(input: UpdatePromotionInput) {
        return this.baseDataService.mutate<UpdatePromotion.Mutation, UpdatePromotion.Variables>(
            UPDATE_PROMOTION,
            {
                input,
            },
        );
    }

    deletePromotion(id: string) {
        return this.baseDataService.mutate<DeletePromotion.Mutation, DeletePromotion.Variables>(
            DELETE_PROMOTION,
            { id },
        );
    }
}
