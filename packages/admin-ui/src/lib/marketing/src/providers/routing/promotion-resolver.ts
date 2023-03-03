import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseEntityResolver, DataService, PromotionFragment } from '@vendure/admin-ui/core';

/**
 * Resolves the id from the path into a Customer entity.
 */
@Injectable({
    providedIn: 'root',
})
export class PromotionResolver extends BaseEntityResolver<PromotionFragment> {
    constructor(router: Router, dataService: DataService) {
        super(
            router,
            {
                __typename: 'Promotion',
                id: '',
                createdAt: '',
                updatedAt: '',
                name: '',
                description: '',
                couponCode: '',
                enabled: false,
                conditions: [],
                actions: [],
                translations: [],
            },
            id => dataService.promotion.getPromotion(id).mapStream(data => data.promotion),
        );
    }
}
