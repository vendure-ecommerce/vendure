import { InjectableStrategy } from '../../common/types/injectable-strategy';

/**
 * @description
 * Defines the strategy for generating slugs from input strings.
 * Slugs are URL-friendly versions of text that are commonly used for
 * entity identifiers in URLs.
 *
 * @example
 * ```ts
 * export class CustomSlugStrategy implements SlugStrategy {
 *   generate(input: string): string {
 *     return input
 *       .toLowerCase()
 *       .replace(/[^a-z0-9]+/g, '-')
 *       .replace(/^-+|-+$/g, '');
 *   }
 * }
 * ```
 *
 * @docsCategory configuration
 * @since 3.x.x
 */
export interface SlugStrategy extends InjectableStrategy {
    /**
     * @description
     * Generates a slug from the input string.
     *
     * @param input The input string to be converted to a slug
     * @returns A URL-friendly slug string
     */
    generate(input: string): string;
}
