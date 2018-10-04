import { Injectable } from '@angular/core';
import { AdjustmentSource, AdjustmentType } from 'shared/generated-types';

import { BaseEntityResolver } from '../../../common/base-entity-resolver';
import { DataService } from '../../../data/providers/data.service';

/**
 * Resolves the id from the path into a Customer entity.
 */
@Injectable()
export class PromotionResolver extends BaseEntityResolver<AdjustmentSource.Fragment> {
    constructor(private dataService: DataService) {
        super(
            {
                __typename: 'AdjustmentSource',
                id: '',
                createdAt: '',
                updatedAt: '',
                type: AdjustmentType.PROMOTION,
                name: '',
                enabled: false,
                conditions: [],
                actions: [],
            },
            id => this.dataService.adjustmentSource.getPromotion(id).mapStream(data => data.adjustmentSource),
        );
    }
}
