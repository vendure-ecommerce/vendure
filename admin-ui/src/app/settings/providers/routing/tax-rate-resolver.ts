import { Injectable } from '@angular/core';

import { BaseEntityResolver } from '../../../common/base-entity-resolver';
import { TaxRate } from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';

/**
 * Resolves the id from the path into a Customer entity.
 */
@Injectable()
export class TaxRateResolver extends BaseEntityResolver<TaxRate.Fragment> {
    constructor(private dataService: DataService) {
        super(
            {
                __typename: 'TaxRate',
                id: '',
                name: '',
                value: 0,
                enabled: true,
                category: {} as any,
                zone: {} as any,
                customerGroup: null,
            },
            id => this.dataService.settings.getTaxRate(id).mapStream(data => data.taxRate),
        );
    }
}
