import { ALLOWED_PER_PAGE_VALUES, DEFAULT_PER_PAGE } from '../constants.js';

/**
 * Validates and returns a valid per-page value.
 * If the value is not in the allowed list, returns the default value.
 */
export function validatePerPageValue(value: number): number {
    if (ALLOWED_PER_PAGE_VALUES.includes(value as (typeof ALLOWED_PER_PAGE_VALUES)[number])) {
        return value;
    }
    return DEFAULT_PER_PAGE;
}
