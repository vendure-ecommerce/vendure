import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseEntityResolver, CustomerFragment, DataService } from '@vendure/admin-ui/core';

@Injectable({
    providedIn: 'root',
})
export class CustomerResolver extends BaseEntityResolver<CustomerFragment> {
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
