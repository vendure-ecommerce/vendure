import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseEntityResolver, DataService, PaymentMethodFragment } from '@vendure/admin-ui/core';

/**
 * Resolves the id from the path into a Customer entity.
 */
@Injectable({
    providedIn: 'root',
})
export class PaymentMethodResolver extends BaseEntityResolver<PaymentMethodFragment> {
    constructor(router: Router, dataService: DataService) {
        super(
            router,
            {
                __typename: 'PaymentMethod',
                id: '',
                createdAt: '',
                updatedAt: '',
                name: '',
                code: '',
                description: '',
                enabled: true,
                checker: undefined as any,
                handler: undefined as any,
                translations: [],
            },
            id => dataService.settings.getPaymentMethod(id).mapStream(data => data.paymentMethod),
        );
    }
}
