import { DeepPartial } from '@vendure/common/lib/shared-types';
import { ChildEntity, ManyToOne } from 'typeorm';

import { Order } from '../order/order.entity';

import { HistoryEntry } from './history-entry.entity';

@ChildEntity()
export class OrderHistoryEntry extends HistoryEntry {
    constructor(input: DeepPartial<OrderHistoryEntry>) {
        super(input);
    }

    @ManyToOne(type => Order, { onDelete: 'CASCADE' })
    order: Order;
}
