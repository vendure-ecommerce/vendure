import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BaseEntityResolver } from '@vendure/admin-ui/core';
import { Promotion } from '@vendure/admin-ui/core';
import { DataService } from '@vendure/admin-ui/core';

/**
 * Resolves the id from the path into a Customer entity.
 */
@Injectable()
export class PromotionResolver extends BaseEntityResolver<Promotion.Fragment> {
    constructor(router: Router, dataService: DataService) {
        super(
            router,
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
            id => dataService.promotion.getPromotion(id).mapStream(data => data.promotion),
        );
    }
}
