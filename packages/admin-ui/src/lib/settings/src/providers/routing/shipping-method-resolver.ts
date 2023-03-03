import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseEntityResolver, DataService, ShippingMethodFragment } from '@vendure/admin-ui/core';

/**
 * Resolves the id from the path into a Customer entity.
 */
@Injectable({
    providedIn: 'root',
})
export class ShippingMethodResolver extends BaseEntityResolver<ShippingMethodFragment> {
    constructor(router: Router, dataService: DataService) {
        super(
            router,
            {
                __typename: 'ShippingMethod',
                createdAt: '',
                updatedAt: '',
                id: '',
                code: '',
                name: '',
                description: '',
                fulfillmentHandlerCode: undefined as any,
                checker: undefined as any,
                calculator: undefined as any,
                translations: [],
            },
            id => dataService.shippingMethod.getShippingMethod(id).mapStream(data => data.shippingMethod),
        );
    }
}
