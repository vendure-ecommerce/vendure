import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseEntityResolver } from '@vendure/admin-ui/core';
import { ShippingMethod } from '@vendure/admin-ui/core';
import { DataService } from '@vendure/admin-ui/core';

/**
 * Resolves the id from the path into a Customer entity.
 */
@Injectable({
    providedIn: 'root',
})
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
