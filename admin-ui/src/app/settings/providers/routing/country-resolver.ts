import { Injectable } from '@angular/core';
import { Country } from 'shared/generated-types';

import { BaseEntityResolver } from '../../../common/base-entity-resolver';
import { DataService } from '../../../data/providers/data.service';

/**
 * Resolves the id from the path into a Customer entity.
 */
@Injectable()
export class CountryResolver extends BaseEntityResolver<Country.Fragment> {
    constructor(private dataService: DataService) {
        super(
            {
                __typename: 'Country',
                id: '',
                code: '',
                name: '',
                enabled: false,
            },
            id => this.dataService.settings.getCountry(id).mapStream(data => data.country),
        );
    }
}
