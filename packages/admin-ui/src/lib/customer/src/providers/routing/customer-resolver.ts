import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseEntityResolver, SortOrder } from '@vendure/admin-ui/core';
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
            id =>
                dataService.customer
                    .getCustomer(id, { take: 10, sort: { orderPlacedAt: SortOrder.DESC } })
                    .mapStream(data => data.customer),
        );
    }
}
