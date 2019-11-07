import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BaseEntityResolver } from '../../../common/base-entity-resolver';
import { Customer } from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';

@Injectable()
export class CustomerResolver extends BaseEntityResolver<Customer.Fragment> {
    constructor(router: Router, dataService: DataService) {
        super(
            router,
            {
                __typename: 'Customer',
                id: '',
                createdAt: '',
                updatedAt: '',
                title: '',
                firstName: '',
                lastName: '',
                emailAddress: '',
                phoneNumber: null,
                addresses: null,
                user: null,
            },
            id => dataService.customer.getCustomer(id).mapStream(data => data.customer),
        );
    }
}
