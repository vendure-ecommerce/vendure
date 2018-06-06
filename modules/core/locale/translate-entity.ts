import { Translatable, TranslatedEntity } from './locale-types';

/**
 * Converts a Translatable entity into the public-facing entity by unwrapping
 * the translated strings from the first of the Translation entities.
 */
export function translateEntity<T>(translatable: Translatable<T>): TranslatedEntity<T> {
    if (!translatable.translations || translatable.translations.length === 0) {
        throw new Error(`Translatable entity "${translatable.constructor.name}" has no translations`);
    }
    const translation = translatable.translations[0];

    const translated = { ...(translatable as any) };
    delete translated.translations;

    for (const [key, value] of Object.entries(translation)) {
        if (key !== 'languageCode' && key !== 'id') {
            translated[key] = value;
        }
    }
    return translated;
}

export type TranslatableRelationsKeys<T> = {
    [K in keyof T]: T[K] extends string
        ? never
        : T[K] extends number
            ? never
            : T[K] extends boolean
                ? never
                : T[K] extends undefined
                    ? never
                    : T[K] extends Array<string>
                        ? never
                        : T[K] extends Array<number>
                            ? never
                            : T[K] extends Array<boolean> ? never : K extends 'translations' ? never : K
}[keyof T];

export type UnwrappedArray<T extends Array<any>> = T[number];

export type NestedTranslatableRelations<T> = {
    [K in TranslatableRelationsKeys<T>]: T[K] extends Array<any>
        ? [K, TranslatableRelationsKeys<UnwrappedArray<T[K]>>]
        : TranslatableRelationsKeys<T[K]>
};

export type NestedTranslatableRelationKeys<T> = NestedTranslatableRelations<T>[keyof NestedTranslatableRelations<T>];

export type DeepTranslatableRelations<T> = Array<TranslatableRelationsKeys<T> | NestedTranslatableRelationKeys<T>>;

export function translateDeep<T>(
    translatable: Translatable<T>,
    translatableRelations: DeepTranslatableRelations<T> = [],
): TranslatedEntity<T> {
    const translatedEntity = translateEntity(translatable);

    for (const path of translatableRelations) {
        if (Array.isArray(path) && path.length === 2) {
            const [path0, path1] = path;
            const value = translatable[path0].forEach((nested1, index) => {
                translatedEntity[path0][index][path1] = nested1[path1].map(nested2 => translateEntity(nested2));
            });
        } else {
            const value = (translatable as any)[path];
            if (Array.isArray(value)) {
                (translatedEntity as any)[path] = value.map(val => translateEntity(val));
            } else {
                (translatedEntity as any)[path] = translateEntity(value);
            }
        }
    }

    return translatedEntity as any;
}
