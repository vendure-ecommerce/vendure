import { Injectable } from '@angular/core';
import { PaymentMethod } from 'shared/generated-types';

import { BaseEntityResolver } from '../../../common/base-entity-resolver';
import { DataService } from '../../../data/providers/data.service';

/**
 * Resolves the id from the path into a Customer entity.
 */
@Injectable()
export class PaymentMethodResolver extends BaseEntityResolver<PaymentMethod.Fragment> {
    constructor(private dataService: DataService) {
        super(
            {
                __typename: 'PaymentMethod',
                id: '',
                code: '',
                enabled: true,
                configArgs: [],
            },
            id => this.dataService.settings.getPaymentMethod(id).mapStream(data => data.paymentMethod),
        );
    }
}
