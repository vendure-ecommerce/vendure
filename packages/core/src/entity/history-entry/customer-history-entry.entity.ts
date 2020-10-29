import { DeepPartial } from '@vendure/common/lib/shared-types';
import { ChildEntity, ManyToOne } from 'typeorm';

import { Customer } from '../customer/customer.entity';

import { HistoryEntry } from './history-entry.entity';

@ChildEntity()
export class CustomerHistoryEntry extends HistoryEntry {
    constructor(input: DeepPartial<CustomerHistoryEntry>) {
        super(input);
    }

    @ManyToOne(type => Customer, { onDelete: 'CASCADE' })
    customer: Customer;
}
