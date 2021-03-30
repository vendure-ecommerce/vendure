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

    @Column() code: string;

    @Column('varchar') state: OrderState;

    @Column({ default: true })
    active: boolean;

    @Column({ nullable: true })
    orderPlacedAt?: Date;

    @ManyToOne(type => Customer)
    customer?: Customer;

    @OneToMany(type => OrderLine, line => line.order)
    lines: OrderLine[];

    @OneToMany(type => Surcharge, surcharge => surcharge.order)
    surcharges: Surcharge[];

    @Column('simple-array')
    couponCodes: string[];

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

    @Column()
    subTotal: number;

    @Column()
    subTotalWithTax: number;

    @OneToMany(type => ShippingLine, shippingLine => shippingLine.order)
    shippingLines: ShippingLine[];

    @Column({ default: 0 })
    shipping: number;

    @Column({ default: 0 })
    shippingWithTax: number;

    @Calculated()
    get discounts(): Discount[] {
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

    @Calculated({
        query: qb => qb.addSelect('shipping', 'shipping'),
        expression: 'subTotal + shipping',
    })
    get total(): number {
        return this.subTotal + (this.shipping || 0);
    }

    @Calculated({ expression: 'subTotalWithTax + shippingWithTax' })
    get totalWithTax(): number {
        return this.subTotalWithTax + (this.shippingWithTax || 0);
    }

    @Calculated({
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
        return summate(this.lines, 'quantity');
    }

    @Calculated()
    get taxSummary(): OrderTaxSummary[] {
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
        return this.lines.reduce((items, line) => {
            return [...items, ...line.items];
        }, [] as OrderItem[]);
    }
}
