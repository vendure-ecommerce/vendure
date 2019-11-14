import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BaseEntityResolver } from '../../../common/base-entity-resolver';
import { Country } from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';

/**
 * Resolves the id from the path into a Customer entity.
 */
@Injectable()
export class CountryResolver extends BaseEntityResolver<Country.Fragment> {
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
