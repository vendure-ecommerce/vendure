import { type ClassValue, clsx } from 'clsx';
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
 * Removes any readonly custom fields from form values before submission.
 * Also removes localeString and localeText fields from the root customFields object
 * since they should only exist in the translations array.
 * This prevents errors when submitting readonly custom field values to mutations.
 *
 * @param values - The form values that may contain custom fields
 * @param customFieldConfigs - Array of custom field configurations for the entity
 * @returns The values with readonly custom fields removed and locale fields properly placed
 */
export function removeReadonlyAndLocalizedCustomFields<T extends Record<string, any>>(
    values: T,
    customFieldConfigs: Array<{ name: string; readonly?: boolean | null; type?: string }> = [],
): T {
    if (!values || !customFieldConfigs?.length) {
        return values;
    }

    // Create a deep copy to avoid mutating the original values
    const result = structuredClone(values);

    // Get readonly field names
    const readonlyFieldNames = customFieldConfigs
        .filter(config => config.readonly === true)
        .map(config => config.name);

    // Get locale-specific field names (localeString and localeText)
    const localeFieldNames = customFieldConfigs
        .filter(config => config.type === 'localeString' || config.type === 'localeText')
        .map(config => config.name);

    // Combine both types of fields to remove from root customFields
    const fieldsToRemoveFromRoot = [...readonlyFieldNames, ...localeFieldNames];

    // Remove readonly and locale fields from main customFields
    if (result.customFields && typeof result.customFields === 'object') {
        for (const fieldName of fieldsToRemoveFromRoot) {
            delete result.customFields[fieldName];
        }
    }

    // Remove readonly fields from translations customFields (but keep locale fields there)
    if (Array.isArray(result.translations)) {
        for (const translation of result.translations) {
            if (translation?.customFields && typeof translation.customFields === 'object') {
                for (const fieldName of readonlyFieldNames) {
                    delete translation.customFields[fieldName];
                }
            }
        }
    }

    return result;
}
