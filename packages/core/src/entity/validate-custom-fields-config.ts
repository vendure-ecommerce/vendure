import { Connection, getConnection } from 'typeorm';

import { Type } from '../../../common/lib/shared-types';
import { CustomFieldConfig, CustomFields } from '../config/custom-field/custom-field-types';

import { VendureEntity } from './base/base.entity';

function validateCustomFieldsForEntity(
    connection: Connection,
    entity: Type<VendureEntity>,
    customFields: CustomFieldConfig[],
): void {
    const metadata = connection.getMetadata(entity);
    const {relations} = metadata;

    const translationRelation = relations.find(r => r.propertyName === 'translations');
    if (translationRelation) {
        const translationEntity = translationRelation.type;
        const translationPropMap = connection.getMetadata(translationEntity).createPropertiesMap();
        const localeStringFields = customFields.filter(field => field.type === 'localeString');
        assertNoNameConflicts(entity.name, translationPropMap, localeStringFields);
    } else {
        assertNoLocaleStringFields(entity, customFields);
    }

    const nonLocaleStringFields = customFields.filter(field => field.type !== 'localeString');
    const propMap = metadata.createPropertiesMap();
    assertNoNameConflicts(entity.name, propMap, nonLocaleStringFields);
}

/**
 * Assert that none of the custom field names conflict with existing properties of the entity, as provided
 * by the TypeORM PropertiesMap object.
 */
function assertNoNameConflicts(entityName: string, propMap: object, customFields: CustomFieldConfig[]): void {
    for (const customField of customFields) {
        if (propMap.hasOwnProperty(customField.name)) {
            const message = `Custom field name conflict: the "${entityName}" entity already has a built-in property "${
                customField.name
                }".`;
            throw new Error(message);
        }
    }
}

/**
 * For entities which are not localized (Address, Customer), we assert that none of the custom fields
 * have a type "localeString".
 */
function assertNoLocaleStringFields(entity: Type<any>, customFields: CustomFieldConfig[]): void {
    if (!!customFields.find(f => f.type === 'localeString')) {
        const message = `Custom field type error: the "${
            entity.name
            }" entity does not support the "localeString" type.`;
        throw new Error(message);
    }
}

/**
 * Validates the custom fields config, e.g. by ensuring that there are no naming conflicts with the built-in fields
 * of each entity.
 */
export async function validateCustomFieldsConfig(customFieldConfig: CustomFields) {
    const connection = getConnection();
    // dynamic import to avoid bootstrap-time order of loading issues
    const {coreEntitiesMap} = await import('./entities');

    for (const key of Object.keys(customFieldConfig)) {
        const entityName = key as keyof CustomFields;
        const customEntityFields = customFieldConfig[entityName] || [];
        const entity = coreEntitiesMap[entityName];
        validateCustomFieldsForEntity(connection, entity, customEntityFields);
    }
}
