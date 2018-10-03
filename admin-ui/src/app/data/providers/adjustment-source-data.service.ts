import {
    AdjustmentType,
    CreateAdjustmentSource,
    CreateAdjustmentSourceInput,
    GetAdjustmentOperations,
    GetAdjustmentSource,
    GetAdjustmentSourceList,
    UpdateAdjustmentSource,
    UpdateAdjustmentSourceInput,
} from 'shared/generated-types';

import {
    CREATE_ADJUSTMENT_SOURCE,
    GET_ADJUSTMENT_OPERATIONS,
    GET_ADJUSTMENT_SOURCE,
    GET_ADJUSTMENT_SOURCE_LIST,
    UPDATE_ADJUSTMENT_SOURCE,
} from '../definitions/adjustment-source-definitions';

import { BaseDataService } from './base-data.service';

export class AdjustmentSourceDataService {
    constructor(private baseDataService: BaseDataService) {}

    getPromotions(take: number = 10, skip: number = 0) {
        return this.baseDataService.query<GetAdjustmentSourceList.Query, GetAdjustmentSourceList.Variables>(
            GET_ADJUSTMENT_SOURCE_LIST,
            {
                type: AdjustmentType.PROMOTION,
                options: {
                    take,
                    skip,
                },
            },
        );
    }

    getPromotion(id: string) {
        return this.baseDataService.query<GetAdjustmentSource.Query, GetAdjustmentSource.Variables>(
            GET_ADJUSTMENT_SOURCE,
            {
                id,
            },
        );
    }

    getAdjustmentOperations(type: AdjustmentType) {
        return this.baseDataService.query<GetAdjustmentOperations.Query, GetAdjustmentOperations.Variables>(
            GET_ADJUSTMENT_OPERATIONS,
            {
                type,
            },
        );
    }

    createPromotion(input: CreateAdjustmentSourceInput) {
        return this.baseDataService.mutate<CreateAdjustmentSource.Mutation, CreateAdjustmentSource.Variables>(
            CREATE_ADJUSTMENT_SOURCE,
            {
                input,
            },
        );
    }

    updatePromotion(input: UpdateAdjustmentSourceInput) {
        return this.baseDataService.mutate<UpdateAdjustmentSource.Mutation, UpdateAdjustmentSource.Variables>(
            UPDATE_ADJUSTMENT_SOURCE,
            {
                input,
            },
        );
    }
}
