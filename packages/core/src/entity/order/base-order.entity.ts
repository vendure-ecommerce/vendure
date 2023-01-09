import {
    Adjustment,
    CurrencyCode,
    Discount,
    OrderAddress,
    OrderTaxSummary,
    TaxLine,
} from '@vendure/common/lib/generated-types';
import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { summate } from '@vendure/common/lib/shared-utils';
import { Column, Entity, Index, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

import { Calculated } from '../../common/calculated-decorator';
import { InternalServerError } from '../../common/error/errors';
import { ChannelAware } from '../../common/types/common-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { OrderState } from '../../service/helpers/order-state-machine/order-state';
import { VendureEntity } from '../base/base.entity';
import { Channel } from '../channel/channel.entity';
import { CustomOrderFields } from '../custom-entity-fields';
import { Customer } from '../customer/customer.entity';
import { EntityId } from '../entity-id.decorator';
import { OrderItem } from '../order-item/order-item.entity';
import { OrderLine } from '../order-line/order-line.entity';
import { OrderModification } from '../order-modification/order-modification.entity';
import { Payment } from '../payment/payment.entity';
import { Promotion } from '../promotion/promotion.entity';
import { ShippingLine } from '../shipping-line/shipping-line.entity';
import { Surcharge } from '../surcharge/surcharge.entity';
import { VendorOrder } from '../vendor-order/vendor-order.entity';

import { Order } from './order.entity';

/**
 * @description
 * An Order is created whenever a {@link Customer} adds an item to the cart. It contains all the
 * information required to fulfill an order: which {@link ProductVariant}s in what quantities;
 * the shipping address and price; any applicable promotions; payments etc.
 *
 * An Order exists in a well-defined state according to the {@link OrderState} type. A state machine
 * is used to govern the transition from one state to another.
 *
 * @docsCategory entities
 */
export interface OrderInterface extends VendureEntity {
    /**
     * @description
     * A unique code for the Order, generated according to the
     * {@link OrderCodeStrategy}. This should be used as an order reference
     * for Customers, rather than the Order's id.
     */
    code: string;

    state: OrderState;

    /**
     * @description
     * Whether the Order is considered "active", meaning that the
     * Customer can still make changes to it and has not yet completed
     * the checkout process.
     * This is governed by the {@link OrderPlacedStrategy}.
     */
    active: boolean;

    /**
     * @description
     * The date & time that the Order was placed, i.e. the Customer
     * completed the checkout and the Order is no longer "active".
     * This is governed by the {@link OrderPlacedStrategy}.
     */
    orderPlacedAt?: Date;

    customer?: Customer;

    lines: OrderLine[];

    /**
     * @description
     * Surcharges are arbitrary modifications to the Order total which are neither
     * ProductVariants nor discounts resulting from applied Promotions. For example,
     * one-off discounts based on customer interaction, or surcharges based on payment
     * methods.
     */
    surcharges: Surcharge[];

    /**
     * @description
     * An array of all coupon codes applied to the Order.
     */
    couponCodes: string[];

    /**
     * @description
     * Promotions applied to the order. Only gets populated after the payment process has completed,
     * i.e. the Order is no longer active.
     */
    promotions: Promotion[];

    shippingAddress: OrderAddress;

    billingAddress: OrderAddress;

    payments: Payment[];

    currencyCode: CurrencyCode;

    customFields: CustomOrderFields;

    taxZoneId?: ID;

    channels: Channel[];

    modifications: OrderModification[];

    /**
     * @description
     * The subTotal is the total of all OrderLines in the Order. This figure also includes any Order-level
     * discounts which have been prorated (proportionally distributed) amongst the OrderItems.
     * To get a total of all OrderLines which does not account for prorated discounts, use the
     * sum of {@link OrderLine}'s `discountedLinePrice` values.
     */
    subTotal: number;

    /**
     * @description
     * Same as subTotal, but inclusive of tax.
     */
    subTotalWithTax: number;

    /**
     * @description
     * The shipping charges applied to this order.
     */
    shippingLines: ShippingLine[];

    /**
     * @description
     * The total of all the `shippingLines`.
     */
    shipping: number;

    shippingWithTax: number;

    discounts: Discount[];

    total: number;

    totalWithTax: number;

    totalQuantity: number;

    taxSummary: OrderTaxSummary[];
}
