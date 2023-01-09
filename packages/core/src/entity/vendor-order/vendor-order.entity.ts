import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne } from 'typeorm';

import { VendureEntity } from '../base/base.entity';
import { Channel } from '../channel/channel.entity';
import { CustomOrderFields } from '../custom-entity-fields';
import { EntityId } from '../entity-id.decorator';
import { OrderLine } from '../order-line/order-line.entity';
import { OrderModification } from '../order-modification/order-modification.entity';
import { Order } from '../order/order.entity';
import { Payment } from '../payment/payment.entity';
import { ShippingLine } from '../shipping-line/shipping-line.entity';
import { Surcharge } from '../surcharge/surcharge.entity';
import { Vendor } from '../vendor/vendor.entity';

/**
 * @description
 *
 *
 * @docsCategory entities
 */
@Entity()
export class VendorOrder extends VendureEntity {
    constructor(input?: DeepPartial<VendorOrder>) {
        super(input);
    }

    @ManyToOne(type => Channel)
    channel: Channel;

    @EntityId()
    channelId: ID;

    @ManyToOne(type => Order)
    parent: Order;

    @EntityId()
    parentId: ID;

    /**
     * @description
     * A unique code for the Order, generated according to the
     * {@link OrderCodeStrategy}. This should be used as an order reference
     * for Customers, rather than the Order's id.
     */
    @Column()
    @Index({ unique: true })
    code: string;

    @ManyToMany(type => OrderLine, line => line.order)
    @JoinTable()
    lines: OrderLine[];

    /**
     * @description
     * Surcharges are arbitrary modifications to the Order total which are neither
     * ProductVariants nor discounts resulting from applied Promotions. For example,
     * one-off discounts based on customer interaction, or surcharges based on payment
     * methods.
     */
    @ManyToMany(type => Surcharge, surcharge => surcharge.order)
    @JoinTable()
    surcharges: Surcharge[];

    @ManyToMany(type => Payment, payment => payment.order)
    @JoinTable()
    payments: Payment[];

    @Column(type => CustomOrderFields)
    customFields: CustomOrderFields;

    @ManyToMany(type => OrderModification, modification => modification.order)
    @JoinTable()
    modifications: OrderModification[];

    /**
     * @description
     * The shipping charges applied to this order.
     */
    @ManyToMany(type => ShippingLine, shippingLine => shippingLine.order)
    @JoinTable()
    shippingLines: ShippingLine[];
}
