import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseEntityResolver, DataService, TaxCategory } from '@vendure/admin-ui/core';

/**
 * Resolves the id from the path into a Customer entity.
 */
@Injectable({
    providedIn: 'root',
})
export class TaxCategoryResolver extends BaseEntityResolver<TaxCategory.Fragment> {
    constructor(router: Router, dataService: DataService) {
        super(
            router,
            {
                __typename: 'TaxCategory',
                id: '',
                createdAt: '',
                updatedAt: '',
                name: '',
            },
            id => dataService.settings.getTaxCategory(id).mapStream(data => data.taxCategory),
        );
    }
}
