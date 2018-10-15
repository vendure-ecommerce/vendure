import { Injectable } from '@angular/core';
import { TaxCategory } from 'shared/generated-types';

import { BaseEntityResolver } from '../../../common/base-entity-resolver';
import { DataService } from '../../../data/providers/data.service';

/**
 * Resolves the id from the path into a Customer entity.
 */
@Injectable()
export class TaxCategoryResolver extends BaseEntityResolver<TaxCategory.Fragment> {
    constructor(private dataService: DataService) {
        super(
            {
                __typename: 'TaxCategory',
                id: '',
                name: '',
            },
            id => this.dataService.settings.getTaxCategory(id).mapStream(data => data.taxCategory),
        );
    }
}
