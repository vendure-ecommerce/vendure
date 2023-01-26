import { ID } from '@vendure/common/lib/shared-types';
import { Column, Entity, Index, ManyToOne, TableInheritance } from 'typeorm';

import { VendureEntity } from '../base/base.entity';
import { EntityId } from '../entity-id.decorator';
import { OrderLine } from '../order-line/order-line.entity';

/**
 * @description
 * This entity represents a fulfillment of an Order or part of it, i.e. the {@link OrderItem}s have been
 * delivered to the Customer after successful payment.
 *
 * @docsCategory entities
 */
@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'discriminator' } })
export abstract class OrderLineReference extends VendureEntity {
    @Column()
    quantity: number;

    @Index()
    @ManyToOne(type => OrderLine, { onDelete: 'CASCADE' })
    orderLine: OrderLine;

    @EntityId()
    orderLineId: ID;
}
