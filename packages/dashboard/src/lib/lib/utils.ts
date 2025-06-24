import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Converts a camelCase string to Title Case.
 * Examples:
 *   "firstName" -> "First Name"
 *   "dateOfBirth" -> "Date Of Birth"
 *   "totalItems" -> "Total Items"
 */
export function camelCaseToTitleCase(text: string): string {
    if (!text) return '';

    return (
        text
            // Insert space before capital letters
            .replace(/([A-Z])/g, ' $1')
            // Capitalize first character
            .replace(/^./, str => str.toUpperCase())
            // Handle the case where the string starts with a capital
            .trim()
    );
}

/**
 * Formats a file size in bytes to a human-readable string.
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)).toString() + ' ' + sizes[i];
}

/**
 * This is a copy of the normalizeString function from @vendure/common/lib/normalize-string.js
 * It is duplicated here due to issues importing from that package
 * inside the monorepo.
 */
export function normalizeString(input: string, spaceReplacer = ' '): string {
    const multipleSequentialReplacerRegex = new RegExp(`([${spaceReplacer}]){2,}`, 'g');

    return (input || '')
        .normalize('NFD')
        .replace(/[\u00df]/g, 'ss')
        .replace(/[\u1e9e]/g, 'SS')
        .replace(/[\u0308]/g, 'e')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[!"£$%^&*()+[\]{};:@#~?\\/,|><`¬'=‘’©®™]/g, '')
        .replace(/\s+/g, spaceReplacer)
        .replace(multipleSequentialReplacerRegex, spaceReplacer);
}

/**
 * Deep merges two objects, handling nested objects and arrays.
 * Ignores undefined values in the source object.
 *
 * @param target - The target object to merge into (can be null/undefined)
 * @param source - The source object to merge from (can be null/undefined)
 * @returns A new object with merged values, or the non-null object if one is null/undefined
 */
export function deepMerge<T extends Record<string, any>, U extends Record<string, any>>(
    target: T | null | undefined,
    source: U | null | undefined,
): T & U {
    // Handle null/undefined cases
    if (!target && !source) {
        return {} as T & U;
    }
    if (!target) {
        return structuredClone(source) as T & U;
    }
    if (!source) {
        return structuredClone(target) as T & U;
    }

    // Create a deep copy of the target to avoid mutation
    const result = structuredClone(target) as T & U;

    for (const key in source) {
        if (source.hasOwnProperty(key)) {
            const sourceValue = source[key];

            // Skip undefined values
            if (sourceValue === undefined) {
                continue;
            }

            const targetValue = result[key as keyof typeof result];

            if (Array.isArray(sourceValue)) {
                if (Array.isArray(targetValue)) {
                    // For arrays, replace target with source array (don't merge/concatenate)
                    // This prevents duplicates and maintains the source array structure
                    (result as any)[key] = structuredClone(sourceValue);
                } else {
                    // Target is not an array, replace with source array
                    (result as any)[key] = structuredClone(sourceValue);
                }
            } else if (sourceValue !== null && typeof sourceValue === 'object') {
                if (targetValue !== null && typeof targetValue === 'object' && !Array.isArray(targetValue)) {
                    // Both are objects, recursively merge
                    (result as any)[key] = deepMerge(targetValue, sourceValue);
                } else {
                    // Target is not an object, replace with source object
                    (result as any)[key] = structuredClone(sourceValue);
                }
            } else {
                // Primitive value, replace
                (result as any)[key] = sourceValue;
            }
        }
    }

    return result;
}
