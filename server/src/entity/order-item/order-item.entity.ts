import { Adjustment } from 'shared/generated-types';
import { DeepPartial } from 'shared/shared-types';
import { Column, Entity, ManyToOne } from 'typeorm';

import { VendureEntity } from '../base/base.entity';
import { OrderLine } from '../order-line/order-line.entity';

@Entity()
export class OrderItem extends VendureEntity {
    constructor(input?: DeepPartial<OrderItem>) {
        super(input);
    }

    @ManyToOne(type => OrderLine, line => line.items, { onDelete: 'CASCADE' })
    line: OrderLine;

    @Column('simple-json') pendingAdjustments: Adjustment[];
}
