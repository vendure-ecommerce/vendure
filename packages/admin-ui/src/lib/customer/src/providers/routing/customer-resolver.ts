import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseEntityResolver } from '@vendure/admin-ui/core';
import { Customer } from '@vendure/admin-ui/core';
import { DataService } from '@vendure/admin-ui/core';

@Injectable({
    providedIn: 'root',
})
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
