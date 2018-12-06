import { DeepPartial } from '../../../shared/shared-types';

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
    return target;
}
