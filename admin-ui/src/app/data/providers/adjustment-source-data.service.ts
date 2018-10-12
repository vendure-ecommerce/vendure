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
        return this.getAdjustmentSourceList(AdjustmentType.PROMOTION, take, skip);
    }

    getPromotion(id: string) {
        return this.getAdjustmentSource(AdjustmentType.PROMOTION, id);
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
        return this.createAdjustmentSource(input);
    }

    updatePromotion(input: UpdateAdjustmentSourceInput) {
        return this.updateAdjustmentSource(input);
    }

    private getAdjustmentSourceList(type: AdjustmentType, take: number, skip: number) {
        return this.baseDataService.query<GetAdjustmentSourceList.Query, GetAdjustmentSourceList.Variables>(
            GET_ADJUSTMENT_SOURCE_LIST,
            {
                type,
                options: {
                    take,
                    skip,
                },
            },
        );
    }

    private getAdjustmentSource(type: AdjustmentType, id: string) {
        return this.baseDataService.query<GetAdjustmentSource.Query, GetAdjustmentSource.Variables>(
            GET_ADJUSTMENT_SOURCE,
            {
                id,
            },
        );
    }

    private createAdjustmentSource(input: CreateAdjustmentSourceInput) {
        return this.baseDataService.mutate<CreateAdjustmentSource.Mutation, CreateAdjustmentSource.Variables>(
            CREATE_ADJUSTMENT_SOURCE,
            {
                input,
            },
        );
    }

    private updateAdjustmentSource(input: UpdateAdjustmentSourceInput) {
        return this.baseDataService.mutate<UpdateAdjustmentSource.Mutation, UpdateAdjustmentSource.Variables>(
            UPDATE_ADJUSTMENT_SOURCE,
            {
                input,
            },
        );
    }
}
