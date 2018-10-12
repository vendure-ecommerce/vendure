import { DeepPartial } from 'shared/shared-types';
import { Column, Entity, ManyToMany } from 'typeorm';

import { VendureEntity } from '../base/base.entity';
import { Customer } from '../customer/customer.entity';

@Entity()
export class CustomerGroup extends VendureEntity {
    constructor(input?: DeepPartial<CustomerGroup>) {
        super(input);
    }

    @Column() name: string;

    @ManyToMany(type => Customer)
    customers: Customer[];
}
