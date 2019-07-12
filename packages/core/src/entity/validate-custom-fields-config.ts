import { Connection, getConnection, getMetadataArgsStorage } from 'typeorm';

import { Type } from '../../../common/lib/shared-types';
import { CustomFieldConfig, CustomFields } from '../config/custom-field/custom-field-types';

import { VendureEntity } from './base/base.entity';

function validateCustomFieldsForEntity(
    entity: Type<VendureEntity>,
    customFields: CustomFieldConfig[],
): string[] {
    const metadata = getMetadataArgsStorage();
    const isTranslatable =
        -1 < metadata.relations.findIndex(r => r.target === entity && r.propertyName === 'translations');
    return [
        ...assertValidFieldNames(entity.name, customFields),
        ...assertNoNameConflicts(entity.name, customFields),
        ...assetNonNullablesHaveDefaults(entity.name, customFields),
        ...(isTranslatable ? [] : assertNoLocaleStringFields(entity.name, customFields)),
    ];
}

/**
 * Assert that the custom entity names are valid
 */
function assertValidFieldNames(entityName: string, customFields: CustomFieldConfig[]): string[] {
    const errors: string[] = [];
    const validNameRe = /^[a-zA-Z_]+[a-zA-Z0-9_]*$/;
    for (const field of customFields) {
        if (!validNameRe.test(field.name)) {
            errors.push(`${entityName} entity has an invalid custom field name: "${field.name}"`);
        }
    }
    return errors;
}

/**
 * Assert that none of the custom field names conflict with one another.
 */
function assertNoNameConflicts(entityName: string, customFields: CustomFieldConfig[]): string[] {
    const nameCounts = customFields
        .map(f => f.name)
        .reduce(
            (hash, name) => {
                hash[name] ? hash[name]++ : (hash[name] = 1);
                return hash;
            },
            {} as { [name: string]: number },
        );
    return Object.entries(nameCounts)
        .filter(([name, count]) => 1 < count)
        .map(([name, count]) => `${entityName} entity has duplicated custom field name: "${name}"`);
}

/**
 * For entities which are not localized (Address, Customer), we assert that none of the custom fields
 * have a type "localeString".
 */
function assertNoLocaleStringFields(entityName: string, customFields: CustomFieldConfig[]): string[] {
    if (!!customFields.find(f => f.type === 'localeString')) {
        return [`${entityName} entity does not support custom fields of type "localeString"`];
    }
    return [];
}

/**
 * Assert that any non-nullable field must have a defaultValue specified.
 */
function assetNonNullablesHaveDefaults(entityName: string, customFields: CustomFieldConfig[]): string[] {
    const errors: string[] = [];
    for (const field of customFields) {
        if (field.nullable === false && field.defaultValue === undefined) {
            errors.push(
                `${entityName} entity custom field "${
                    field.name
                }" is non-nullable and must have a defaultValue`,
            );
        }
    }
    return errors;
}

/**
 * Validates the custom fields config, e.g. by ensuring that there are no naming conflicts with the built-in fields
 * of each entity.
 */
export function validateCustomFieldsConfig(
    customFieldConfig: CustomFields,
    entities: Array<Type<any>>,
): { valid: boolean; errors: string[] } {
    let errors: string[] = [];
    for (const key of Object.keys(customFieldConfig)) {
        const entityName = key as keyof CustomFields;
        const customEntityFields = customFieldConfig[entityName] || [];
        const entity = entities.find(e => e.name === entityName);
        if (entity) {
            errors = errors.concat(validateCustomFieldsForEntity(entity, customEntityFields));
        }
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
