import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseEntityResolver, DataService, TaxRate } from '@vendure/admin-ui/core';

/**
 * Resolves the id from the path into a Customer entity.
 */
@Injectable({
    providedIn: 'root',
})
export class TaxRateResolver extends BaseEntityResolver<TaxRate.Fragment> {
    constructor(router: Router, dataService: DataService) {
        super(
            router,
            {
                __typename: 'TaxRate',
                id: '',
                createdAt: '',
                updatedAt: '',
                name: '',
                value: 0,
                enabled: true,
                category: {} as any,
                zone: {} as any,
                customerGroup: null,
            },
            id => dataService.settings.getTaxRate(id).mapStream(data => data.taxRate),
        );
    }
}
