import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseEntityResolver } from '@vendure/admin-ui/core';
import { OrderDetail } from '@vendure/admin-ui/core';
import { DataService } from '@vendure/admin-ui/core';

/**
 * Resolves the id from the path into a Customer entity.
 */
@Injectable({
    providedIn: 'root',
})
export class OrderResolver extends BaseEntityResolver<OrderDetail.Fragment> {
    constructor(router: Router, dataService: DataService) {
        super(
            router,
            {
                __typename: 'Order',
                id: '',
                code: '',
                createdAt: '',
                updatedAt: '',
                total: 0,
            } as any,
            id => dataService.order.getOrder(id).mapStream(data => data.order),
        );
    }
}
