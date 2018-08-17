import { ID } from '../../../shared/shared-types';
import { CustomFieldsObject } from '../../../shared/shared-types';
import { UnwrappedArray } from '../common/common-types';
import { VendureEntity } from '../entity/base/base.entity';

import { LanguageCode } from './language-code';
import { TranslatableRelationsKeys } from './translate-entity';

/**
 * This type should be used in any interfaces where the value is to be
 * localized into different languages.
 */
export type LocaleString = string & { _opaqueType: 'LocaleString' };

export type TranslatableKeys<T> = { [K in keyof T]: T[K] extends LocaleString ? K : never }[keyof T];

export type NonTranslateableKeys<T> = { [K in keyof T]: T[K] extends LocaleString ? never : K }[keyof T];

// prettier-ignore
/**
 * Entities which have localizable string properties should implement this type.
 */
export interface Translatable { translations: Array<Translation<any>>; }

export type TranslationCustomFields<T> = { [K in keyof T]: K extends 'customFields' ? K : never }[keyof T];

// prettier-ignore
/**
 * Translations of localizable entities should implement this type.
 */
export type Translation<T> =
    // Translation must include the languageCode and a reference to the base Translatable entity it is associated with
    {
        id: ID;
        languageCode: LanguageCode;
        base: T;
    } &
    // Translation must include all translatable keys as a string type
    { [K in TranslatableKeys<T>]: string; } &
    { [K in TranslationCustomFields<T>]: CustomFieldsObject; };

/**
 * This is the type of a translation object when provided as input to a create or update operation.
 */
export type TranslationInput<T> = { [K in TranslatableKeys<T>]: string } & {
    id?: ID;
    languageCode: LanguageCode;
};

/**
 * This interface defines the shape of a DTO used to create / update an entity which has one or more LocaleString
 * properties.
 */
export interface TranslatedInput<T> {
    translations: Array<TranslationInput<T>>;
}

// prettier-ignore
/**
 * This is the type of a Translatable entity after it has been deep-translated into a given language.
 */
export type Translated<T> =  T & { languageCode: LanguageCode; } & {
    [K in TranslatableRelationsKeys<T>]: T[K] extends any[] ? Array<Translated<UnwrappedArray<T[K]>>> : Translated<T[K]>;
};
