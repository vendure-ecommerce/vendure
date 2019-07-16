import { assertNever } from '@vendure/common/lib/shared-utils';

import { UserInputError } from '../../common/error/errors';
import {
    CustomFieldConfig,
    DateTimeCustomFieldConfig,
    FloatCustomFieldConfig,
    IntCustomFieldConfig,
    LocaleStringCustomFieldConfig,
    StringCustomFieldConfig,
} from '../../config/custom-field/custom-field-types';

/**
 * Validates the value of a custom field input against any configured constraints.
 * If validation fails, an error is thrown.
 */
export function validateCustomFieldValue(config: CustomFieldConfig, value: any): void {
    switch (config.type) {
        case 'string':
        case 'localeString':
            return validateStringField(config, value);
            break;
        case 'int':
        case 'float':
            return validateNumberField(config, value);
            break;
        case 'datetime':
            return validateDateTimeField(config, value);
            break;
        case 'boolean':
            break;
        default:
            assertNever(config);
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
