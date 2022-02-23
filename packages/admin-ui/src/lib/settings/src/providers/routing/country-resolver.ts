import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseEntityResolver, CountryFragment, DataService } from '@vendure/admin-ui/core';

/**
 * Resolves the id from the path into a Customer entity.
 */
@Injectable({
    providedIn: 'root',
})
export class CountryResolver extends BaseEntityResolver<CountryFragment> {
    constructor(router: Router, dataService: DataService) {
        super(
            router,
            {
                __typename: 'Country',
                id: '',
                createdAt: '',
                updatedAt: '',
                code: '',
                name: '',
                enabled: false,
                translations: [],
            },
            id => dataService.settings.getCountry(id).mapStream(data => data.country),
        );
    }
}
