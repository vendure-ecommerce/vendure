import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BaseEntityResolver } from '../../../common/base-entity-resolver';
import { TaxRate } from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';

/**
 * Resolves the id from the path into a Customer entity.
 */
@Injectable()
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
