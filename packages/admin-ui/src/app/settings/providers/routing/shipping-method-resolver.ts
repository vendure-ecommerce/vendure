import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BaseEntityResolver } from '../../../common/base-entity-resolver';
import { ShippingMethod } from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';

/**
 * Resolves the id from the path into a Customer entity.
 */
@Injectable()
export class ShippingMethodResolver extends BaseEntityResolver<ShippingMethod.Fragment> {
    constructor(router: Router, dataService: DataService) {
        super(
            router,
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
            id => dataService.shippingMethod.getShippingMethod(id).mapStream(data => data.shippingMethod),
        );
    }
}
