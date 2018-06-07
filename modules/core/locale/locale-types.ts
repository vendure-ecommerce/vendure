/**
 * This type should be used in any interfaces where the value is to be
 * localized into different languages.
 */
import { Product } from '../entity/product/product.interface';

export type LocaleString = string & { _opaqueType: 'LocaleString' };

export type TranslatableKeys<T> = { [K in keyof T]: T[K] extends LocaleString ? K : never }[keyof T];

export type NonTranslateableKeys<T> = { [K in keyof T]: T[K] extends LocaleString ? never : K }[keyof T];

// prettier-ignore
/**
 * Entities which have localizable string properties should implement this type.
 */
export type Translatable<T> =
    // Translatable must include all non-translatable keys of the interface
    { [K in NonTranslateableKeys<T>]: T[K] extends Array<any> ? Array<Translatable<T[K][number]>> : T[K] | Translatable<T[K]> } &
    // Translatable must not include any translatable keys (these are instead handled by the Translation)
    { [K in TranslatableKeys<T>]?: never } &
    // Translatable must include a reference to all translations of the translatable keys
    { translations: Translation<T>[] };

// prettier-ignore
/**
 * Translations of localizable entities should implement this type.
 */
export type Translation<T> =
    // Translation must include the languageCode and a reference to the base Translatable entity it is associated with
    { languageCode: string; base: Translatable<T>; } &
    // Translation must include all translatable keys as a string type
    { [K in TranslatableKeys<T>]: string } &
    { [key: string]: any };

export type TranslatedEntity<T> =
    // Translatable must include all non-translatable keys of the interface
    { [K in NonTranslateableKeys<T>]: T[K] extends Array<any> ? Array<Translatable<T[K][number]>> : T[K] } &
        { [K in TranslatableKeys<T>]: string };
