import { DeepPartial } from 'shared/shared-types';

import { taxAction } from './adjustment/required-adjustment-actions';
import { taxCondition } from './adjustment/required-adjustment-conditions';
import { VendureConfig } from './vendure-config';

/**
 * Simple object check.
 * From https://stackoverflow.com/a/34749873/772859
 */
function isObject(item: any): item is object {
    return item && typeof item === 'object' && !Array.isArray(item);
}

function isClassInstance(item: any): boolean {
    return isObject(item) && item.constructor.name !== 'Object';
}

/**
 * Deep merge config objects. Based on the solution from https://stackoverflow.com/a/34749873/772859
 * but modified so that it does not overwrite fields of class instances, rather it overwrites
 * the entire instance.
 */
export function mergeConfig<T extends VendureConfig>(target: T, source: DeepPartial<VendureConfig>): T {
    if (!source) {
        return target;
    }

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) {
                    Object.assign(target, { [key]: {} });
                }
                if (!isClassInstance(source[key])) {
                    mergeConfig(target[key], source[key]);
                } else {
                    target[key] = source[key];
                }
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    // Always include the required adjustment operations
    const requiredAdjustmentActions = [taxAction];
    const requiredAdjustmentConditions = [taxCondition];
    for (const requiredAction of requiredAdjustmentActions) {
        if (target.adjustmentActions && !target.adjustmentActions.find(a => a.code === requiredAction.code)) {
            target.adjustmentActions.push(requiredAction);
        }
    }
    for (const requiredCondition of requiredAdjustmentConditions) {
        if (
            target.adjustmentConditions &&
            !target.adjustmentConditions.find(c => c.code === requiredCondition.code)
        ) {
            target.adjustmentConditions.push(requiredCondition);
        }
    }

    return target;
}
