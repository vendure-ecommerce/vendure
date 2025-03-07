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
