import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BaseEntityResolver } from '../../../common/base-entity-resolver';
import { OrderDetail } from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';

/**
 * Resolves the id from the path into a Customer entity.
 */
@Injectable()
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
