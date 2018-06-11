import { LanguageCode } from './language-code';

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
export interface Translatable { translations: Translation<any>[]; }

// prettier-ignore
/**
 * Translations of localizable entities should implement this type.
 */
export type Translation<T> =
    // Translation must include the languageCode and a reference to the base Translatable entity it is associated with
    { languageCode: LanguageCode; base: T; } &
    // Translation must include all translatable keys as a string type
    { [K in TranslatableKeys<T>]: string; };

export type LocalizedInput<T> = { [K in TranslatableKeys<T>]: string } & { languageCode: LanguageCode };

/**
 * This interface defines the shape of a DTO used to create / update an entity which has one or more LocaleString
 * properties.
 */
export interface TranslatedInput<T> {
    translations: Array<LocalizedInput<T>>;
}
