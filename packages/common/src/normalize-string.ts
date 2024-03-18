import slug from 'slug';

slug.charmap['-'] = '-';
slug.charmap['.'] = '.';
slug.charmap._ = '_';

/**
 * Normalizes a string to replace non-alphanumeric and diacritical marks with
 * plain equivalents.
 * Utilizes https://www.npmjs.com/package/slug
 */
export function normalizeString(input: string = '', spaceReplacer = ' ', languageCode?: string ): string {
    return slug(input, { replacement: spaceReplacer, fallback: false, locale: languageCode });
}
