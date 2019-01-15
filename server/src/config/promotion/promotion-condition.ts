import { ConfigArg } from '../../../../shared/generated-types';

import { ID } from '../../../../shared/shared-types';
import { OrderLine } from '../../entity';
import { Order } from '../../entity/order/order.entity';
import { argsArrayToHash, ConfigArgs, ConfigArgValues } from '../common/config-args';

export type PromotionConditionArgType = 'int' | 'money' | 'string' | 'datetime' | 'boolean' | 'facetValueIds';
export type PromotionConditionArgs = ConfigArgs<PromotionConditionArgType>;

/**
 * An object containing utility methods which may be used in promotion `check` functions
 * in order to determine whether a promotion should be applied.
 */
export interface PromotionUtils {
    hasFacetValues: (orderLine: OrderLine, facetValueIds: ID[]) => Promise<boolean>;
}

export type CheckPromotionConditionFn<T extends PromotionConditionArgs> = (
    order: Order,
    args: ConfigArgValues<T>,
    utils: PromotionUtils,
) => boolean | Promise<boolean>;

export class PromotionCondition<T extends PromotionConditionArgs = {}> {
    readonly code: string;
    readonly description: string;
    readonly args: PromotionConditionArgs;
    readonly priorityValue: number;
    private readonly checkFn: CheckPromotionConditionFn<T>;

    constructor(config: {
        args: T;
        check: CheckPromotionConditionFn<T>;
        code: string;
        description: string;
        priorityValue?: number;
    }) {
        this.code = config.code;
        this.description = config.description;
        this.args = config.args;
        this.checkFn = config.check;
        this.priorityValue = config.priorityValue || 0;
    }

    async check(order: Order, args: ConfigArg[], utils: PromotionUtils): Promise<boolean> {
        return await this.checkFn(order, argsArrayToHash<T>(args), utils);
    }
}
