import { LanguageCode } from '@vendure/common/lib/generated-types';

import { DEFAULT_LANGUAGE_CODE } from '../../../common/constants';
import { InternalServerError } from '../../../common/error/errors';
import { UnwrappedArray } from '../../../common/types/common-types';
import { Translatable, Translated, Translation } from '../../../common/types/locale-types';
import { VendureEntity } from '../../../entity/base/base.entity';

// prettier-ignore
export type TranslatableRelationsKeys<T> = {
    [K in keyof T]: T[K] extends string ? never :
        T[K] extends number ? never :
            T[K] extends boolean ? never :
                T[K] extends undefined ? never :
                    T[K] extends string[] ? never :
                        T[K] extends number[] ? never :
                            T[K] extends boolean[] ? never :
                                K extends 'translations' ? never :
                                    K extends 'customFields' ? never : K
}[keyof T];

// prettier-ignore
export type NestedTranslatableRelations<T> = {
    [K in TranslatableRelationsKeys<T>]: T[K] extends any[] ?
        [K, TranslatableRelationsKeys<UnwrappedArray<T[K]>>] :
        [K, TranslatableRelationsKeys<T[K]>]
};

// prettier-ignore
export type NestedTranslatableRelationKeys<T> = NestedTranslatableRelations<T>[keyof NestedTranslatableRelations<T>];

// prettier-ignore
export type DeepTranslatableRelations<T> = Array<TranslatableRelationsKeys<T> | NestedTranslatableRelationKeys<T>>;

/**
 * Converts a Translatable entity into the public-facing entity by unwrapping
 * the translated strings from the matching Translation entity.
 */
export function translateEntity<T extends Translatable & VendureEntity>(
    translatable: T,
    languageCode: LanguageCode | [LanguageCode, ...LanguageCode[]],
): Translated<T> {
    let translation: Translation<VendureEntity> | undefined;
    if (translatable.translations) {
        if (Array.isArray(languageCode)) {
            for (const lc of languageCode) {
                translation = translatable.translations.find(t => t.languageCode === lc);
                if (translation) break;
            }
        } else {
            translation = translatable.translations.find(t => t.languageCode === languageCode);
        }

        if (!translation && languageCode !== DEFAULT_LANGUAGE_CODE) {
            translation = translatable.translations.find(t => t.languageCode === DEFAULT_LANGUAGE_CODE);
        }
        if (!translation) {
            // If we cannot find any suitable translation, just return the first one to at least
            // prevent graphql errors when returning the entity.
            translation = translatable.translations[0];
        }
    }

    if (!translation) {
        throw new InternalServerError('error.entity-has-no-translation-in-language', {
            entityName: translatable.constructor.name,
            languageCode: Array.isArray(languageCode) ? languageCode.join() : languageCode,
        });
    }

    const translated = Object.create(
        Object.getPrototypeOf(translatable),
        Object.getOwnPropertyDescriptors(translatable),
    );

    for (const [key, value] of Object.entries(translation)) {
        if (key === 'customFields') {
            if (!translated.customFields) {
                translated.customFields = {};
            }
            Object.assign(translated.customFields, value);
        } else if (key !== 'base' && key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
            translated[key] = value ?? '';
        }
    }
    return translated;
}

/**
 * Translates an entity and its deeply-nested translatable properties. Supports up to 2 levels of nesting.
 */
export function translateDeep<T extends Translatable & VendureEntity>(
    translatable: T,
    languageCode: LanguageCode | [LanguageCode, ...LanguageCode[]],
    translatableRelations: DeepTranslatableRelations<T> = [],
): Translated<T> {
    let translatedEntity: Translated<T>;
    try {
        translatedEntity = translateEntity(translatable, languageCode);
    } catch (e: any) {
        translatedEntity = translatable as any;
    }

    for (const path of translatableRelations) {
        let object: any;
        let property: string;
        let value: any;

        if (Array.isArray(path) && path.length === 2) {
            const [path0, path1] = path as any;
            const valueLevel0 = (translatable as any)[path0];

            if (Array.isArray(valueLevel0)) {
                valueLevel0.forEach((nested1, index) => {
                    object = (translatedEntity as any)[path0][index];
                    property = path1;
                    object[property] = translateLeaf(object, property, languageCode);
                });
                property = '';
                object = null;
            } else {
                object = (translatedEntity as any)[path0];
                property = path1;
                value = translateLeaf(object, property, languageCode);
            }
        } else {
            object = translatedEntity;
            property = path as any;
            value = translateLeaf(object, property, languageCode);
        }

        if (object && property) {
            object[property] = value;
        }
    }

    return translatedEntity;
}

function translateLeaf(
    object: { [key: string]: any } | undefined,
    property: string,
    languageCode: LanguageCode | [LanguageCode, ...LanguageCode[]],
): any {
    if (object && object[property]) {
        if (Array.isArray(object[property])) {
            return object[property].map((nested2: any) => translateEntity(nested2, languageCode));
        } else if (object[property]) {
            return translateEntity(object[property], languageCode);
        }
    }
}

export type TreeNode = { children: TreeNode[] } & Translatable & VendureEntity;

/**
 * Translates a tree structure of Translatable entities
 */
export function translateTree<T extends TreeNode>(
    node: T,
    languageCode: LanguageCode | [LanguageCode, ...LanguageCode[]],
    translatableRelations: DeepTranslatableRelations<T> = [],
): Translated<T> {
    const output = translateDeep(node, languageCode, translatableRelations);
    if (Array.isArray(output.children)) {
        output.children = output.children.map(child =>
            translateTree(child, languageCode, translatableRelations as any),
        );
    }
    return output;
}
