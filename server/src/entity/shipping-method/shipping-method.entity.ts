import { Adjustment, AdjustmentOperation, AdjustmentType } from 'shared/generated-types';
import { DeepPartial } from 'shared/shared-types';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { AdjustmentSource } from '../../common/types/adjustment-source';
import { ChannelAware } from '../../common/types/common-types';
import { ShippingCalculator } from '../../config/shipping-method/shipping-calculator';
import { ShippingEligibilityChecker } from '../../config/shipping-method/shipping-eligibility-checker';
import { getConfig } from '../../config/vendure-config';
import { Channel } from '../channel/channel.entity';
import { Order } from '../order/order.entity';

@Entity()
export class ShippingMethod extends AdjustmentSource implements ChannelAware {
    type = AdjustmentType.SHIPPING;
    private readonly allCheckers: { [code: string]: ShippingEligibilityChecker } = {};
    private readonly allCalculators: { [code: string]: ShippingCalculator } = {};

    constructor(input?: DeepPartial<ShippingMethod>) {
        super(input);
        const checkers = getConfig().shippingOptions.shippingEligibilityCheckers || [];
        const calculators = getConfig().shippingOptions.shippingCalculators || [];
        this.allCheckers = checkers.reduce((hash, o) => ({ ...hash, [o.code]: o }), {});
        this.allCalculators = calculators.reduce((hash, o) => ({ ...hash, [o.code]: o }), {});
    }

    @Column() code: string;

    @Column() description: string;

    @Column('simple-json') checker: AdjustmentOperation;

    @Column('simple-json') calculator: AdjustmentOperation;

    @ManyToMany(type => Channel)
    @JoinTable()
    channels: Channel[];

    async apply(order: Order): Promise<Adjustment | undefined> {
        const calculator = this.allCalculators[this.calculator.code];
        if (calculator) {
            const amount = await calculator.calculate(order, this.calculator.args);
            return {
                amount,
                type: this.type,
                description: this.description,
                adjustmentSource: this.getSourceId(),
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
