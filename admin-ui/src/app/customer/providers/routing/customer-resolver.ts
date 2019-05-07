import { Injectable } from '@angular/core';

import { BaseEntityResolver } from '../../../common/base-entity-resolver';
import { Customer } from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';

@Injectable()
export class CustomerResolver extends BaseEntityResolver<Customer.Fragment> {
    constructor(private dataService: DataService) {
        super(
            {
                __typename: 'Customer',
                id: '',
                title: '',
                firstName: '',
                lastName: '',
                emailAddress: '',
                phoneNumber: null,
                addresses: null,
                user: null,
            },
            id => this.dataService.customer.getCustomer(id).mapStream(data => data.customer),
        );
    }
}
