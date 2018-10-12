import { AdjustmentArg, AdjustmentType } from 'shared/generated-types';

import { Adjustment } from '../../common/types/adjustment-source';
import { idsAreEqual } from '../../common/utils';
import {
    AdjustmentActionDefinition,
    AdjustmentActionResult,
    AdjustmentConditionDefinition,
} from '../../config/adjustment/adjustment-types';
import { AdjustmentSource } from '../../entity/adjustment-source/adjustment-source.entity';
import { Order } from '../../entity/order/order.entity';

/**
 * Evaluates the provided AdjustmentSources against the order and applies those whose conditions are all
 * passing. In doing so, the Order and OrderItems entities are mutated, with their adjustments arrays
 * being populated, and their totalPrice values being set.
 */
export function applyAdjustments(
    order: Order,
    adjustmentSources: AdjustmentSource[],
    conditions: AdjustmentConditionDefinition[],
    actions: AdjustmentActionDefinition[],
) {
    initializeOrder(order);
    const orderedSources = orderAdjustmentSources(adjustmentSources);
    for (const source of orderedSources) {
        if (!checkSourceConditions(order, source, conditions)) {
            continue;
        }
        const results = applyActionCalculations(order, source, actions);

        for (const result of results) {
            if (result.orderItemId) {
                const item = order.items.find(i => idsAreEqual(i.id, result.orderItemId));
                if (item) {
                    item.adjustments.push({
                        adjustmentSourceId: source.id,
                        description: source.name,
                        amount: result.amount,
                    });
                    item.totalPrice += result.amount;
                }
            } else {
                order.adjustments.push({
                    adjustmentSourceId: source.id,
                    description: source.name,
                    amount: result.amount,
                });
            }
        }
        order.totalPrice = getTotalPriceOfItems(order) + getTotalAdjustmentAmount(order.adjustments);
    }
}

/**
 * Adjustment sources should be applied in the following order: taxes, promotions, shipping.
 * This function arranges the sources to conform to this order.
 */
export function orderAdjustmentSources(sources: AdjustmentSource[]): AdjustmentSource[] {
    let output: AdjustmentSource[] = [];
    [AdjustmentType.TAX, AdjustmentType.PROMOTION, AdjustmentType.SHIPPING].forEach(type => {
        output = [...output, ...sources.filter(s => s.type === type)];
    });
    return output;
}

/**
 * Initialize the total prices or the Order and its OrderItems to equal
 * the price before any adjustments are applied, and set the adjustments
 * to be an empty array.
 */
function initializeOrder(order: Order) {
    for (const item of order.items) {
        item.totalPrice = item.totalPriceBeforeAdjustment;
        item.adjustments = [];
    }
    order.totalPrice = getTotalPriceOfItems(order);
    order.adjustments = [];
}

function getTotalPriceOfItems(order: Order): number {
    return order.items.reduce((total, item) => total + item.totalPrice, 0);
}

function getTotalAdjustmentAmount(adjustments: Adjustment[]): number {
    return adjustments.reduce((total, adjustment) => total + adjustment.amount, 0);
}

function checkSourceConditions(
    order: Order,
    source: AdjustmentSource,
    conditions: AdjustmentConditionDefinition[],
): boolean {
    for (const condition of source.conditions) {
        const conditionConfig = conditions.find(c => c.code === condition.code);
        if (!conditionConfig) {
            return false;
        }
        if (!conditionConfig.predicate(order, argsArrayToHash(condition.args))) {
            return false;
        }
    }
    return true;
}

function applyActionCalculations(
    order: Order,
    source: AdjustmentSource,
    actions: AdjustmentActionDefinition[],
): AdjustmentActionResult[] {
    let results: AdjustmentActionResult[] = [];
    for (const action of source.actions) {
        const actionConfig = actions.find(a => a.code === action.code);
        if (!actionConfig) {
            continue;
        }
        const context = source.type === AdjustmentType.TAX ? { taxCategoryId: source.id } : {};
        const actionResults = actionConfig
            .calculate(order, argsArrayToHash(action.args), context)
            .map(result => {
                // Do not allow fractions of pennies.
                result.amount = Math.round(result.amount);
                return result;
            });
        results = [...results, ...actionResults];
    }
    return results;
}

function argsArrayToHash(args: AdjustmentArg[]): { [name: string]: string | number } {
    return args.reduce(
        (hash, arg) => ({
            ...hash,
            [arg.name]: ['int', 'percentage', 'money'].includes(arg.type)
                ? Number.parseInt(arg.value || '', 10)
                : arg.value,
        }),
        {},
    );
}
