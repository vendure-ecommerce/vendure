import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseEntityResolver } from '@vendure/admin-ui/core';
import { PaymentMethod } from '@vendure/admin-ui/core';
import { DataService } from '@vendure/admin-ui/core';

/**
 * Resolves the id from the path into a Customer entity.
 */
@Injectable({
    providedIn: 'root',
})
export class PaymentMethodResolver extends BaseEntityResolver<PaymentMethod.Fragment> {
    constructor(router: Router, dataService: DataService) {
        super(
            router,
            {
                __typename: 'PaymentMethod',
                id: '',
                createdAt: '',
                updatedAt: '',
                code: '',
                enabled: true,
                configArgs: [],
            },
            id => dataService.settings.getPaymentMethod(id).mapStream(data => data.paymentMethod),
        );
    }
}
