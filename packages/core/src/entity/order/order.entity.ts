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
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

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
@Entity()
export class Order extends VendureEntity implements ChannelAware, HasCustomFields {
    constructor(input?: DeepPartial<Order>) {
        super(input);
    }

    /**
     * @description
     * A unique code for the Order, generated according to the
     * {@link OrderCodeStrategy}. This should be used as an order reference
     * for Customers, rather than the Order's id.
     */
    @Column() code: string;

    @Column('varchar') state: OrderState;

    /**
     * @description
     * Whether the Order is considered "active", meaning that the
     * Customer can still make changes to it and has not yet completed
     * the checkout process.
     * This is governed by the {@link OrderPlacedStrategy}.
     */
    @Column({ default: true })
    active: boolean;

    /**
     * @description
     * The date & time that the Order was placed, i.e. the Customer
     * completed the checkout and the Order is no longer "active".
     * This is governed by the {@link OrderPlacedStrategy}.
     */
    @Column({ nullable: true })
    orderPlacedAt?: Date;

    @ManyToOne(type => Customer)
    customer?: Customer;

    @OneToMany(type => OrderLine, line => line.order)
    lines: OrderLine[];

    /**
     * @description
     * Surcharges are arbitrary modifications to the Order total which are neither
     * ProductVariants nor discounts resulting from applied Promotions. For example,
     * one-off discounts based on customer interaction, or surcharges based on payment
     * methods.
     */
    @OneToMany(type => Surcharge, surcharge => surcharge.order)
    surcharges: Surcharge[];

    /**
     * @description
     * An array of all coupon codes applied to the Order.
     */
    @Column('simple-array')
    couponCodes: string[];

    /**
     * @description
     * Promotions applied to the order. Only gets populated after the payment process has completed,
     * i.e. the Order is no longer active.
     */
    @ManyToMany(type => Promotion)
    @JoinTable()
    promotions: Promotion[];

    @Column('simple-json') shippingAddress: OrderAddress;

    @Column('simple-json') billingAddress: OrderAddress;

    @OneToMany(type => Payment, payment => payment.order)
    payments: Payment[];

    @Column('varchar')
    currencyCode: CurrencyCode;

    @Column(type => CustomOrderFields)
    customFields: CustomOrderFields;

    @EntityId({ nullable: true })
    taxZoneId?: ID;

    @ManyToMany(type => Channel)
    @JoinTable()
    channels: Channel[];

    @OneToMany(type => OrderModification, modification => modification.order)
    modifications: OrderModification[];

    /**
     * @description
     * The subTotal is the total of all OrderLines in the Order. This figure also includes any Order-level
     * discounts which have been prorated (proportionally distributed) amongst the OrderItems.
     * To get a total of all OrderLines which does not account for prorated discounts, use the
     * sum of {@link OrderLine}'s `discountedLinePrice` values.
     */
    @Column()
    subTotal: number;

    /**
     * @description
     * Same as subTotal, but inclusive of tax.
     */
    @Column()
    subTotalWithTax: number;

    /**
     * @description
     * The shipping charges applied to this order.
     */
    @OneToMany(type => ShippingLine, shippingLine => shippingLine.order)
    shippingLines: ShippingLine[];

    /**
     * @description
     * The total of all the `shippingLines`.
     */
    @Column({ default: 0 })
    shipping: number;

    @Column({ default: 0 })
    shippingWithTax: number;

    @Calculated({ relations: ['lines', 'lines.items', 'shippingLines'] })
    get discounts(): Discount[] {
        this.throwIfLinesNotJoined('discounts');
        const groupedAdjustments = new Map<string, Discount>();
        for (const line of this.lines) {
            for (const discount of line.discounts) {
                const adjustment = groupedAdjustments.get(discount.adjustmentSource);
                if (adjustment) {
                    adjustment.amount += discount.amount;
                    adjustment.amountWithTax += discount.amountWithTax;
                } else {
                    groupedAdjustments.set(discount.adjustmentSource, { ...discount });
                }
            }
        }
        for (const shippingLine of this.shippingLines) {
            for (const discount of shippingLine.discounts) {
                const adjustment = groupedAdjustments.get(discount.adjustmentSource);
                if (adjustment) {
                    adjustment.amount += discount.amount;
                    adjustment.amountWithTax += discount.amountWithTax;
                } else {
                    groupedAdjustments.set(discount.adjustmentSource, { ...discount });
                }
            }
        }
        return [...groupedAdjustments.values()];
    }

    /**
     * @description
     * Equal to `subTotal` plus `shipping`
     */
    @Calculated({
        query: qb =>
            qb
                .leftJoin(
                    qb1 => {
                        return qb1
                            .from(Order, 'order')
                            .select('order.shipping + order.subTotal', 'total')
                            .addSelect('order.id', 'oid');
                    },
                    't1',
                    't1.oid = order.id',
                )
                .addSelect('t1.total', 'total'),
        expression: 'total',
    })
    get total(): number {
        return this.subTotal + (this.shipping || 0);
    }

    /**
     * @description
     * The final payable amount. Equal to `subTotalWithTax` plus `shippingWithTax`.
     */
    @Calculated({
        query: qb =>
            qb
                .leftJoin(
                    qb1 => {
                        return qb1
                            .from(Order, 'order')
                            .select('order.shippingWithTax + order.subTotalWithTax', 'twt')
                            .addSelect('order.id', 'oid');
                    },
                    't1',
                    't1.oid = order.id',
                )
                .addSelect('t1.twt', 'twt'),
        expression: 'twt',
    })
    get totalWithTax(): number {
        return this.subTotalWithTax + (this.shippingWithTax || 0);
    }

    @Calculated({
        relations: ['lines', 'lines.items'],
        query: qb => {
            qb.leftJoin(
                qb1 => {
                    return qb1
                        .from(Order, 'order')
                        .select('COUNT(DISTINCT items.id)', 'qty')
                        .addSelect('order.id', 'oid')
                        .leftJoin('order.lines', 'lines')
                        .leftJoin('lines.items', 'items')
                        .groupBy('order.id');
                },
                't1',
                't1.oid = order.id',
            ).addSelect('t1.qty', 'qty');
        },
        expression: 'qty',
    })
    get totalQuantity(): number {
        this.throwIfLinesNotJoined('totalQuantity');
        return summate(this.lines, 'quantity');
    }

    /**
     * @description
     * A summary of the taxes being applied to this Order.
     */
    @Calculated({ relations: ['lines', 'lines.items'] })
    get taxSummary(): OrderTaxSummary[] {
        this.throwIfLinesNotJoined('taxSummary');
        const taxRateMap = new Map<
            string,
            { rate: number; base: number; tax: number; description: string }
        >();
        const taxId = (taxLine: TaxLine): string => `${taxLine.description}:${taxLine.taxRate}`;
        const taxableLines = [...this.lines, ...this.shippingLines];
        for (const line of taxableLines) {
            const taxRateTotal = summate(line.taxLines, 'taxRate');
            for (const taxLine of line.taxLines) {
                const id = taxId(taxLine);
                const row = taxRateMap.get(id);
                const proportionOfTotalRate = 0 < taxLine.taxRate ? taxLine.taxRate / taxRateTotal : 0;

                const lineBase = line instanceof OrderLine ? line.proratedLinePrice : line.discountedPrice;
                const lineWithTax =
                    line instanceof OrderLine ? line.proratedLinePriceWithTax : line.discountedPriceWithTax;
                const amount = Math.round((lineWithTax - lineBase) * proportionOfTotalRate);
                if (row) {
                    row.tax += amount;
                    row.base += lineBase;
                } else {
                    taxRateMap.set(id, {
                        tax: amount,
                        base: lineBase,
                        description: taxLine.description,
                        rate: taxLine.taxRate,
                    });
                }
            }
        }
        return Array.from(taxRateMap.entries()).map(([taxRate, row]) => ({
            taxRate: row.rate,
            description: row.description,
            taxBase: row.base,
            taxTotal: row.tax,
        }));
    }

    getOrderItems(): OrderItem[] {
        this.throwIfLinesNotJoined('getOrderItems');
        return this.lines.reduce((items, line) => {
            return [...items, ...line.items];
        }, [] as OrderItem[]);
    }

    private throwIfLinesNotJoined(propertyName: keyof Order) {
        if (this.lines == null) {
            const errorMessage = [
                `The property "${propertyName}" on the Order entity requires the Order.lines relation to be joined.`,
                `This can be done with the EntityHydratorService: \`await entityHydratorService.hydrate(ctx, order, { relations: ['lines'] })\``,
            ];

            throw new InternalServerError(errorMessage.join('\n'));
        }
    }
}
