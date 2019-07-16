import { LanguageCode } from '@vendure/common/lib/generated-types';
import { assertNever } from '@vendure/common/lib/shared-utils';

import { DEFAULT_LANGUAGE_CODE } from '../../common/constants';
import { UserInputError } from '../../common/error/errors';
import {
    CustomFieldConfig,
    DateTimeCustomFieldConfig,
    FloatCustomFieldConfig,
    IntCustomFieldConfig,
    LocaleStringCustomFieldConfig,
    StringCustomFieldConfig,
    TypedCustomFieldConfig,
} from '../../config/custom-field/custom-field-types';

/**
 * Validates the value of a custom field input against any configured constraints.
 * If validation fails, an error is thrown.
 */
export function validateCustomFieldValue(config: CustomFieldConfig, value: any, languageCode?: LanguageCode): void {
    switch (config.type) {
        case 'string':
        case 'localeString':
            validateStringField(config, value);
            break;
        case 'int':
        case 'float':
            validateNumberField(config, value);
            break;
        case 'datetime':
            validateDateTimeField(config, value);
            break;
        case 'boolean':
            break;
        default:
            assertNever(config);
    }
    validateCustomFunction(config, value, languageCode);
}

function validateCustomFunction<T extends TypedCustomFieldConfig<any, any>>(config: T, value: any, languageCode?: LanguageCode) {
    if (typeof config.validate === 'function') {
        const error = config.validate(value);
        if (typeof error === 'string') {
            throw new UserInputError(error);
        }
        if (Array.isArray(error)) {
            const localizedError = error.find(e => e.languageCode === (languageCode || DEFAULT_LANGUAGE_CODE)) || error[0];
            throw new UserInputError(localizedError.value);
        }
    }
}

function validateStringField(config: StringCustomFieldConfig | LocaleStringCustomFieldConfig, value: string): void {
    const { pattern } = config;
    if (pattern) {
        const re = new RegExp(pattern);
        if (!re.test(value)) {
            throw new UserInputError('error.field-invalid-string-pattern', { value, pattern });
        }
    }
}

function validateNumberField(config: IntCustomFieldConfig | FloatCustomFieldConfig, value: number): void {
    const { min, max } = config;
    if (min != null && value < min) {
        throw new UserInputError('error.field-invalid-number-range-min', { value, min });
    }
    if (max != null && max < value) {
        throw new UserInputError('error.field-invalid-number-range-max', { value, max });
    }
}
function validateDateTimeField(config: DateTimeCustomFieldConfig, value: string): void {
    const { min, max } = config;
    const valueDate = new Date(value);
    if (min != null && valueDate < new Date(min)) {
        throw new UserInputError('error.field-invalid-datetime-range-min', { value: valueDate.toISOString(), min });
    }
    if (max != null && new Date(max) < valueDate) {
        throw new UserInputError('error.field-invalid-datetime-range-max', { value: valueDate.toISOString(), max });
    }
}
