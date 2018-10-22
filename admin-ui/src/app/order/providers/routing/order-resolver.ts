import { Injectable } from '@angular/core';
import { OrderWithLines } from 'shared/generated-types';

import { BaseEntityResolver } from '../../../common/base-entity-resolver';
import { DataService } from '../../../data/providers/data.service';

/**
 * Resolves the id from the path into a Customer entity.
 */
@Injectable()
export class OrderResolver extends BaseEntityResolver<OrderWithLines.Fragment> {
    constructor(private dataService: DataService) {
        super(
            {
                __typename: 'Order',
                id: '',
                code: '',
                createdAt: '',
                updatedAt: '',
                total: 0,
            } as any,
            id => this.dataService.order.getOrder(id).mapStream(data => data.order),
        );
    }
}
