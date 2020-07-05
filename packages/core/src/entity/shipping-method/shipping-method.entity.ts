import { ConfigurableOperation } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { ChannelAware, SoftDeletable } from '../../common/types/common-types';
import { getConfig } from '../../config/config-helpers';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import {
    ShippingCalculationResult,
    ShippingCalculator,
} from '../../config/shipping-method/shipping-calculator';
import { ShippingEligibilityChecker } from '../../config/shipping-method/shipping-eligibility-checker';
import { VendureEntity } from '../base/base.entity';
import { Channel } from '../channel/channel.entity';
import { CustomShippingMethodFields } from '../custom-entity-fields';
import { Order } from '../order/order.entity';

/**
 * @description
 * A ShippingMethod is used to apply a shipping price to an {@link Order}. It is composed of a
 * {@link ShippingEligibilityChecker} and a {@link ShippingCalculator}. For a given Order,
 * the `checker` is used to determine whether this ShippingMethod can be used. If yes, then
 * the ShippingMethod can be applied and the `calculator` is used to determine the price of
 * shipping.
 *
 * @docsCategory entities
 */
@Entity()
export class ShippingMethod extends VendureEntity implements ChannelAware, SoftDeletable, HasCustomFields {
    private readonly allCheckers: { [code: string]: ShippingEligibilityChecker } = {};
    private readonly allCalculators: { [code: string]: ShippingCalculator } = {};

    constructor(input?: DeepPartial<ShippingMethod>) {
        super(input);
        const checkers = getConfig().shippingOptions.shippingEligibilityCheckers || [];
        const calculators = getConfig().shippingOptions.shippingCalculators || [];
        this.allCheckers = checkers.reduce((hash, o) => ({ ...hash, [o.code]: o }), {});
        this.allCalculators = calculators.reduce((hash, o) => ({ ...hash, [o.code]: o }), {});
    }

    @Column({ type: Date, nullable: true })
    deletedAt: Date | null;

    @Column() code: string;

    @Column() description: string;

    @Column('simple-json') checker: ConfigurableOperation;

    @Column('simple-json') calculator: ConfigurableOperation;

    @ManyToMany((type) => Channel)
    @JoinTable()
    channels: Channel[];

    @Column((type) => CustomShippingMethodFields)
    customFields: CustomShippingMethodFields;

    async apply(order: Order): Promise<ShippingCalculationResult | undefined> {
        const calculator = this.allCalculators[this.calculator.code];
        if (calculator) {
            const { price, priceWithTax, metadata } = await calculator.calculate(order, this.calculator.args);
            return {
                price: Math.round(price),
                priceWithTax: Math.round(priceWithTax),
                metadata,
            };
        }
    }

    async test(order: Order): Promise<boolean> {
        const checker = this.allCheckers[this.checker.code];
        if (checker) {
            return checker.check(order, this.checker.args);
        } else {
            return false;
        }
    }
}
