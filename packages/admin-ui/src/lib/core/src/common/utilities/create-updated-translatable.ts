import { CustomFieldsObject, CustomFieldType } from '@vendure/common/lib/shared-types';
import { assertNever } from '@vendure/common/lib/shared-utils';

import { CustomFieldConfig, LanguageCode } from '../generated-types';

export interface TranslatableUpdateOptions<T extends { translations: any[] } & MayHaveCustomFields> {
    translatable: T;
    updatedFields: { [key: string]: any };
    languageCode: LanguageCode;
    customFieldConfig?: CustomFieldConfig[];
    defaultTranslation?: Partial<T['translations'][number]>;
}

export type MayHaveCustomFields = {
    customFields?: { [key: string]: any };
};

/**
 * When updating an entity which has translations, the value from the form will pertain to the current
 * languageCode. This function ensures that the "translations" array is correctly set based on the
 * existing languages and the updated values in the specified language.
 */
export function createUpdatedTranslatable<T extends { translations: any[] } & MayHaveCustomFields>(
    options: TranslatableUpdateOptions<T>,
): T {
    const { translatable, updatedFields, languageCode, customFieldConfig, defaultTranslation } = options;
    const currentTranslation =
        translatable.translations.find(t => t.languageCode === languageCode) || defaultTranslation;
    const index = translatable.translations.indexOf(currentTranslation);
    const newTranslation = patchObject(currentTranslation, updatedFields);
    const newCustomFields: CustomFieldsObject = {};
    const newTranslatedCustomFields: CustomFieldsObject = {};
    if (customFieldConfig && updatedFields.hasOwnProperty('customFields')) {
        for (const field of customFieldConfig) {
            const value = updatedFields.customFields[field.name];
            if (field.type === 'localeString') {
                newTranslatedCustomFields[field.name] = value;
            } else {
                newCustomFields[field.name] =
                    value === '' ? getDefaultValue(field.type as CustomFieldType) : value;
            }
        }
        newTranslation.customFields = newTranslatedCustomFields;
    }
    const newTranslatable = {
        ...(patchObject(translatable, updatedFields) as any),
        ...{ translations: translatable.translations.slice() },
    };
    if (customFieldConfig) {
        newTranslatable.customFields = newCustomFields;
    }
    if (index !== -1) {
        newTranslatable.translations.splice(index, 1, newTranslation);
    } else {
        newTranslatable.translations.push(newTranslation);
    }
    return newTranslatable;
}

function getDefaultValue(type: CustomFieldType): any {
    switch (type) {
        case 'localeString':
        case 'string':
            return '';
        case 'boolean':
            return false;
        case 'float':
        case 'int':
            return 0;
        case 'datetime':
            return new Date();
        default:
            assertNever(type);
    }
}

/**
 * Returns a shallow clone of `obj` with any properties contained in `patch` overwriting
 * those of `obj`.
 */
function patchObject<T extends { [key: string]: any }>(obj: T, patch: { [key: string]: any }): T {
    const clone: any = Object.assign({}, obj);
    Object.keys(clone).forEach(key => {
        if (patch.hasOwnProperty(key)) {
            clone[key] = patch[key];
        }
    });
    return clone;
}
