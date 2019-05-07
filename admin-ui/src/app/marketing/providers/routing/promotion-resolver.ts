import { Injectable } from '@angular/core';

import { BaseEntityResolver } from '../../../common/base-entity-resolver';
import { Promotion } from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';

/**
 * Resolves the id from the path into a Customer entity.
 */
@Injectable()
export class PromotionResolver extends BaseEntityResolver<Promotion.Fragment> {
    constructor(private dataService: DataService) {
        super(
            {
                __typename: 'Promotion',
                id: '',
                createdAt: '',
                updatedAt: '',
                name: '',
                enabled: false,
                conditions: [],
                actions: [],
            },
            id => this.dataService.promotion.getPromotion(id).mapStream(data => data.promotion),
        );
    }
}
