import { CustomFieldConfig, CustomFields, CustomFieldType, Type } from '@vendure/common/lib/shared-types';
import { assertNever } from '@vendure/common/lib/shared-utils';
import { Column, ColumnType, Connection, ConnectionOptions, Entity, getConnection } from 'typeorm';

import { VendureConfig } from '../config/vendure-config';

import { VendureEntity } from './base/base.entity';

@Entity()
export class CustomAddressFields {}
@Entity()
export class CustomFacetFields {}
@Entity()
export class CustomFacetFieldsTranslation {}
@Entity()
export class CustomFacetValueFields {}
@Entity()
export class CustomFacetValueFieldsTranslation {}
@Entity()
export class CustomCustomerFields {}
@Entity()
export class CustomProductFields {}
@Entity()
export class CustomProductFieldsTranslation {}
@Entity()
export class CustomCollectionFields {}
@Entity()
export class CustomCollectionFieldsTranslation {}
@Entity()
export class CustomProductOptionFields {}
@Entity()
export class CustomProductOptionFieldsTranslation {}
@Entity()
export class CustomProductOptionGroupFields {}
@Entity()
export class CustomProductOptionGroupFieldsTranslation {}
@Entity()
export class CustomProductVariantFields {}
@Entity()
export class CustomProductVariantFieldsTranslation {}
@Entity()
export class CustomUserFields {}
@Entity()
export class CustomGlobalSettingsFields {}

/**
 * Dynamically add columns to the custom field entity based on the CustomFields config.
 */
function registerCustomFieldsForEntity(
    config: VendureConfig,
    entityName: keyof CustomFields,
    ctor: { new (): any },
    translation = false,
) {
    const customFields = config.customFields && config.customFields[entityName];
    const dbEngine = config.dbConnectionOptions.type;
    if (customFields) {
        for (const customField of customFields) {
            const { name, type } = customField;
            const registerColumn = () =>
                Column({ type: getColumnType(dbEngine, type), name })(new ctor(), name);

            if (translation) {
                if (type === 'localeString') {
                    registerColumn();
                }
            } else {
                if (type !== 'localeString') {
                    registerColumn();
                }
            }
        }
    }
}

function getColumnType(dbEngine: ConnectionOptions['type'], type: CustomFieldType): ColumnType {
    switch (type) {
        case 'string':
        case 'localeString':
            return 'varchar';
        case 'boolean':
            return dbEngine === 'mysql' ? 'tinyint' : 'bool';
        case 'int':
            return 'int';
        case 'float':
            return 'double';
        case 'datetime':
            return dbEngine === 'mysql' ? 'datetime' : 'timestamp';
        default:
            assertNever(type);
    }
    return 'varchar';
}

function validateCustomFieldsForEntity(
    connection: Connection,
    entity: Type<VendureEntity>,
    customFields: CustomFieldConfig[],
): void {
    const metadata = connection.getMetadata(entity);
    const { relations } = metadata;

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
 * Dynamically registers any custom fields with TypeORM. This function should be run at the bootstrap
 * stage of the app lifecycle, before the AppModule is initialized.
 */
export function registerCustomEntityFields(config: VendureConfig) {
    registerCustomFieldsForEntity(config, 'Address', CustomAddressFields);
    registerCustomFieldsForEntity(config, 'Collection', CustomCollectionFields);
    registerCustomFieldsForEntity(config, 'Collection', CustomCollectionFieldsTranslation, true);
    registerCustomFieldsForEntity(config, 'Customer', CustomCustomerFields);
    registerCustomFieldsForEntity(config, 'Facet', CustomFacetFields);
    registerCustomFieldsForEntity(config, 'Facet', CustomFacetFieldsTranslation, true);
    registerCustomFieldsForEntity(config, 'FacetValue', CustomFacetValueFields);
    registerCustomFieldsForEntity(config, 'FacetValue', CustomFacetValueFieldsTranslation, true);
    registerCustomFieldsForEntity(config, 'Product', CustomProductFields);
    registerCustomFieldsForEntity(config, 'Product', CustomProductFieldsTranslation, true);
    registerCustomFieldsForEntity(config, 'ProductOption', CustomProductOptionFields);
    registerCustomFieldsForEntity(config, 'ProductOption', CustomProductOptionFieldsTranslation, true);
    registerCustomFieldsForEntity(config, 'ProductOptionGroup', CustomProductOptionGroupFields);
    registerCustomFieldsForEntity(
        config,
        'ProductOptionGroup',
        CustomProductOptionGroupFieldsTranslation,
        true,
    );
    registerCustomFieldsForEntity(config, 'ProductVariant', CustomProductVariantFields);
    registerCustomFieldsForEntity(config, 'ProductVariant', CustomProductVariantFieldsTranslation, true);
    registerCustomFieldsForEntity(config, 'User', CustomUserFields);
    registerCustomFieldsForEntity(config, 'GlobalSettings', CustomGlobalSettingsFields);
}

/**
 * Validates the custom fields config, e.g. by ensuring that there are no naming conflicts with the built-in fields
 * of each entity.
 */
export async function validateCustomFieldsConfig(customFieldConfig: CustomFields) {
    const connection = getConnection();
    // dynamic import to avoid bootstrap-time order of loading issues
    const { coreEntitiesMap } = await import('./entities');

    for (const key of Object.keys(customFieldConfig)) {
        const entityName = key as keyof CustomFields;
        const customEntityFields = customFieldConfig[entityName] || [];
        const entity = coreEntitiesMap[entityName];
        validateCustomFieldsForEntity(connection, entity, customEntityFields);
    }
}
