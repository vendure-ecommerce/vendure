import { Injectable } from '@angular/core';
import { Promotion } from 'shared/generated-types';

import { BaseEntityResolver } from '../../../common/base-entity-resolver';
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
