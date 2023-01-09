import { CurrencyCode, Discount, OrderAddress, OrderTaxSummary } from '@vendure/common/lib/generated-types';
import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { Column, Entity, Index, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

import { OrderState } from '../../service';
import { VendureEntity } from '../base/base.entity';
import { Channel } from '../channel/channel.entity';
import { CustomOrderFields } from '../custom-entity-fields';
import { Customer } from '../customer/customer.entity';
import { EntityId } from '../entity-id.decorator';
import { OrderLine } from '../order-line/order-line.entity';
import { OrderModification } from '../order-modification/order-modification.entity';
import { OrderInterface } from '../order/base-order.entity';
import { Order } from '../order/order.entity';
import { Payment } from '../payment/payment.entity';
import { Promotion } from '../promotion/promotion.entity';
import { ShippingLine } from '../shipping-line/shipping-line.entity';
import { Surcharge } from '../surcharge/surcharge.entity';

type SharedOrderProperties = Omit<Order, 'vendorOrders' | 'getOrderItems'>;

/**
 * @description
 *
 *
 * @docsCategory entities
 */
@Entity()
export class VendorOrder extends VendureEntity implements SharedOrderProperties {
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

    get state(): OrderState {
        return this.parent.state;
    }
    get active(): boolean {
        return this.parent.active;
    }
    get orderPlacedAt(): Date | undefined {
        return this.parent.orderPlacedAt;
    }
    get customer(): Customer | undefined {
        return this.parent.customer;
    }
    get couponCodes(): string[] {
        return this.parent.couponCodes;
    }
    get promotions(): Promotion[] {
        return this.parent.promotions;
    }
    get shippingAddress(): OrderAddress {
        return this.parent.shippingAddress;
    }
    get billingAddress(): OrderAddress {
        return this.parent.billingAddress;
    }
    get currencyCode(): CurrencyCode {
        return this.parent.currencyCode;
    }
    get taxZoneId(): ID | undefined {
        return this.parent.taxZoneId;
    }
    get channels(): Channel[] {
        return [this.channel];
    }
    get subTotal(): number {
        return this.parent.subTotal;
    }
    get subTotalWithTax(): number {
        return this.parent.subTotalWithTax;
    }
    get shipping(): number {
        return this.parent.shipping;
    }
    get shippingWithTax(): number {
        return this.parent.shippingWithTax;
    }
    get discounts(): Discount[] {
        return this.parent.discounts;
    }
    get total(): number {
        return this.parent.total;
    }
    get totalWithTax(): number {
        return this.parent.totalWithTax;
    }
    get totalQuantity(): number {
        return this.parent.totalQuantity;
    }
    get taxSummary(): OrderTaxSummary[] {
        return this.parent.taxSummary;
    }
}
