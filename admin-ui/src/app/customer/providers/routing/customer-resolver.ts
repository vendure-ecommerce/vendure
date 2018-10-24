import { Injectable } from '@angular/core';
import { Customer } from 'shared/generated-types';

import { BaseEntityResolver } from '../../../common/base-entity-resolver';
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
            },
            id => this.dataService.customer.getCustomer(id).mapStream(data => data.customer),
        );
    }
}
