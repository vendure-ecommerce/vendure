import { DeepPartial } from 'shared/shared-types';
import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { VendureEntity } from '../base/base.entity';
import { Order } from '../order/order.entity';
import { User } from '../user/user.entity';

@Entity()
export class Session extends VendureEntity {
    constructor(input: DeepPartial<Session>) {
        super(input);
    }

    @Index({ unique: true })
    @Column()
    token: string;

    @ManyToOne(type => User)
    user?: User;

    @ManyToOne(type => Order)
    activeOrder?: Order;

    @Column() expires: Date;

    @Column() invalidated: boolean;
}
