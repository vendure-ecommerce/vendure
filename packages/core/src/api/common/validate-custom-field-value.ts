import { LanguageCode } from '@vendure/common/lib/generated-types';
import { assertNever } from '@vendure/common/lib/shared-utils';

import { UserInputError } from '../../common/error/errors';
import { Injector } from '../../common/injector';
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
export async function validateCustomFieldValue(
    config: CustomFieldConfig,
    value: any,
    injector: Injector,
    languageCode?: LanguageCode,
): Promise<void> {
    if (config.readonly) {
        throw new UserInputError('error.field-invalid-readonly', { name: config.name });
    }
    if (config.nullable === false) {
        if (value === null) {
            throw new UserInputError('error.field-invalid-non-nullable', {
                name: config.name,
            });
        }
    }
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
        case 'relation':
        case 'text':
            break;
        default:
            assertNever(config);
    }
    await validateCustomFunction(config as TypedCustomFieldConfig<any, any>, value, injector, languageCode);
}

async function validateCustomFunction<T extends TypedCustomFieldConfig<any, any>>(
    config: T,
    value: any,
    injector: Injector,
    languageCode?: LanguageCode,
) {
    if (typeof config.validate === 'function') {
        const error = await config.validate(value, injector);
        if (typeof error === 'string') {
            throw new UserInputError(error);
        }
        if (Array.isArray(error)) {
            const localizedError = error.find(e => e.languageCode === languageCode) || error[0];
            throw new UserInputError(localizedError.value);
        }
    }
}

function validateStringField(
    config: StringCustomFieldConfig | LocaleStringCustomFieldConfig,
    value: string,
): void {
    const { pattern } = config;
    if (pattern) {
        const re = new RegExp(pattern);
        if (!re.test(value)) {
            throw new UserInputError('error.field-invalid-string-pattern', {
                name: config.name,
                value,
                pattern,
            });
        }
    }
    const options = (config as StringCustomFieldConfig).options;
    if (options) {
        const validOptions = options.map(o => o.value);
        if (value === null && config.nullable === true) {
            return;
        }
        if (!validOptions.includes(value)) {
            throw new UserInputError('error.field-invalid-string-option', {
                name: config.name,
                value,
                validOptions: validOptions.map(o => `'${o}'`).join(', '),
            });
        }
    }
}

function validateNumberField(config: IntCustomFieldConfig | FloatCustomFieldConfig, value: number): void {
    const { min, max } = config;
    if (min != null && value < min) {
        throw new UserInputError('error.field-invalid-number-range-min', { name: config.name, value, min });
    }
    if (max != null && max < value) {
        throw new UserInputError('error.field-invalid-number-range-max', { name: config.name, value, max });
    }
}
function validateDateTimeField(config: DateTimeCustomFieldConfig, value: string): void {
    const { min, max } = config;
    const valueDate = new Date(value);
    if (min != null && valueDate < new Date(min)) {
        throw new UserInputError('error.field-invalid-datetime-range-min', {
            name: config.name,
            value: valueDate.toISOString(),
            min,
        });
    }
    if (max != null && new Date(max) < valueDate) {
        throw new UserInputError('error.field-invalid-datetime-range-max', {
            name: config.name,
            value: valueDate.toISOString(),
            max,
        });
    }
}
