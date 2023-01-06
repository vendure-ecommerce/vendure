import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseEntityResolver, DataService, SellerFragment } from '@vendure/admin-ui/core';

/**
 * Resolves the id from the path into a Customer entity.
 */
@Injectable({
    providedIn: 'root',
})
export class SellerResolver extends BaseEntityResolver<SellerFragment> {
    constructor(router: Router, dataService: DataService) {
        super(
            router,
            {
                __typename: 'Seller',
                id: '',
                createdAt: '',
                updatedAt: '',
                name: '',
            },
            id => dataService.settings.getSeller(id).mapStream(data => data.seller),
        );
    }
}
