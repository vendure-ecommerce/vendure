import { isClassInstance, isObject } from '@vendure/common/lib/shared-utils';
import { simpleDeepClone } from '@vendure/common/lib/simple-deep-clone';

import { PartialVendureConfig, VendureConfig } from './vendure-config';

/**
 * Deep merge config objects. Based on the solution from https://stackoverflow.com/a/34749873/772859
 * but modified so that it does not overwrite fields of class instances, rather it overwrites
 * the entire instance.
 */
export function mergeConfig<T extends VendureConfig>(target: T, source: PartialVendureConfig, depth = 0): T {
    if (!source) {
        return target;
    }

    if (depth === 0) {
        target = simpleDeepClone(target);
    }

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject((source as any)[key])) {
                if (!(target as any)[key]) {
                    Object.assign(target as any, { [key]: {} });
                }
                if (!isClassInstance((source as any)[key])) {
                    mergeConfig((target as any)[key], (source as any)[key], depth + 1);
                } else {
                    (target as any)[key] = (source as any)[key];
                }
            } else {
                Object.assign(target, { [key]: (source as any)[key] });
            }
        }
    }
    return target;
}
