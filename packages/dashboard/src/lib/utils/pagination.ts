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

/**
 * Validates and returns a valid page number.
 * If the value is not a valid positive integer, returns 1.
 */
export function validatePageValue(value: number): number {
    if (Number.isFinite(value) && value >= 1 && Number.isInteger(value)) {
        return value;
    }
    return 1;
}