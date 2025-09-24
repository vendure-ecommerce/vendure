import { SlugStrategy } from './slug-strategy';

/**
 * @description
 * The default strategy for generating slugs. This strategy:
 * - Converts to lowercase
 * - Replaces spaces and special characters with hyphens
 * - Removes non-alphanumeric characters (except hyphens)
 * - Removes leading and trailing hyphens
 * - Collapses multiple hyphens into one
 *
 * @example
 * ```ts
 * const strategy = new DefaultSlugStrategy();
 * strategy.generate("Hello World!"); // "hello-world"
 * strategy.generate("Café Français"); // "cafe-francais"
 * strategy.generate("100% Natural"); // "100-natural"
 * ```
 *
 * @docsCategory configuration
 * @since 3.x.x
 */
export class DefaultSlugStrategy implements SlugStrategy {
    generate(input: string): string {
        if (!input) {
            return '';
        }

        const result = input
            .normalize('NFD') // Normalize unicode characters
            .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
            .replace(/\s+/g, '-'); // Replace spaces with hyphens

        // Split by hyphen, filter out empty strings, and rejoin to handle multiple hyphens
        return result
            .split('-')
            .filter(part => part.length > 0)
            .join('-');
    }
}
