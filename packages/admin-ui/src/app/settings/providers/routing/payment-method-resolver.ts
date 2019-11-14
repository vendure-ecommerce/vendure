import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BaseEntityResolver } from '../../../common/base-entity-resolver';
import { PaymentMethod } from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';

/**
 * Resolves the id from the path into a Customer entity.
 */
@Injectable()
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
