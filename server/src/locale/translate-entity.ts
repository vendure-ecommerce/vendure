import { LanguageCode } from './language-code';
import { Translatable } from './locale-types';

// prettier-ignore
export type TranslatableRelationsKeys<T> = {
    [K in keyof T]: T[K] extends string ? never :
    T[K] extends number ? never :
    T[K] extends boolean ? never :
    T[K] extends undefined ? never :
    T[K] extends Array<string> ? never :
    T[K] extends Array<number> ? never :
    T[K] extends Array<boolean> ? never :
    K extends 'translations' ? never : K
}[keyof T];

export type UnwrappedArray<T extends Array<any>> = T[number];

// prettier-ignore
export type NestedTranslatableRelations<T> = {
    [K in TranslatableRelationsKeys<T>]: T[K] extends Array<any> ?
        [K, TranslatableRelationsKeys<UnwrappedArray<T[K]>>]:
        [K, TranslatableRelationsKeys<T[K]>]
};

export type NestedTranslatableRelationKeys<T> = NestedTranslatableRelations<T>[keyof NestedTranslatableRelations<T>];

export type DeepTranslatableRelations<T> = Array<TranslatableRelationsKeys<T> | NestedTranslatableRelationKeys<T>>;

export class NotTranslatedError extends Error {}

/**
 * Converts a Translatable entity into the public-facing entity by unwrapping
 * the translated strings from the matching Translation entity.
 */
export function translateEntity<T extends Translatable>(translatable: T, languageCode: LanguageCode): T {
    const translation =
        translatable.translations && translatable.translations.find(t => t.languageCode === languageCode);

    if (!translation) {
        throw new NotTranslatedError(
            `Translatable entity "${
                translatable.constructor.name
            }" has not been translated into the requested language (${languageCode})`,
        );
    }

    const translated = { ...(translatable as any) };

    for (const [key, value] of Object.entries(translation)) {
        if (key !== 'base' && key !== 'id') {
            translated[key] = value;
        }
    }
    return translated;
}

/**
 * Translates an entity and its deeply-nested translatable properties. Supports up to 2 levels of nesting.
 */
export function translateDeep<T extends Translatable>(
    translatable: T,
    languageCode: LanguageCode,
    translatableRelations: DeepTranslatableRelations<T> = [],
): T {
    let translatedEntity: T;
    try {
        translatedEntity = translateEntity(translatable, languageCode);
    } catch (e) {
        translatedEntity = translatable as any;
    }

    for (const path of translatableRelations) {
        let object: any;
        let property: string;
        let value: any;

        if (Array.isArray(path) && path.length === 2) {
            const [path0, path1] = path as any;
            const valueLevel0 = translatable[path0];

            if (Array.isArray(valueLevel0)) {
                valueLevel0.forEach((nested1, index) => {
                    object = translatedEntity[path0][index];
                    property = path1;
                    object[property] = translateLeaf(object, property, languageCode);
                });
                object = null;
            } else {
                object = translatedEntity[path0];
                property = path1;
                value = translateLeaf(object, property, languageCode);
            }
        } else {
            object = translatedEntity;
            property = path as any;
            value = translateLeaf(object, property, languageCode);
        }
        if (object && property!) {
            object[property] = value;
        }
    }

    return translatedEntity;
}

function translateLeaf(object: object | undefined, property: string, languageCode: LanguageCode): any {
    if (object && object[property]) {
        if (Array.isArray(object[property])) {
            return object[property].map(nested2 => translateEntity(nested2, languageCode));
        } else if (object[property]) {
            return translateEntity(object[property], languageCode);
        }
    }
}
