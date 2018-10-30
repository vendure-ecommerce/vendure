import { Injectable } from '@angular/core';
import { ShippingMethod } from 'shared/generated-types';

import { BaseEntityResolver } from '../../../common/base-entity-resolver';
import { DataService } from '../../../data/providers/data.service';

/**
 * Resolves the id from the path into a Customer entity.
 */
@Injectable()
export class ShippingMethodResolver extends BaseEntityResolver<ShippingMethod.Fragment> {
    constructor(private dataService: DataService) {
        super(
            {
                __typename: 'ShippingMethod',
                createdAt: '',
                updatedAt: '',
                id: '',
                code: '',
                description: '',
                checker: undefined as any,
                calculator: undefined as any,
            },
            id =>
                this.dataService.shippingMethod.getShippingMethod(id).mapStream(data => data.shippingMethod),
        );
    }
}
