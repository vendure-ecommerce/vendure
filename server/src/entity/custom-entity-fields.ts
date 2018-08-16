import { Column, ColumnType, Entity } from 'typeorm';

import { assertNever } from '../../../shared/shared-utils';
import { CustomFields, CustomFieldType, getConfig } from '../config/vendure-config';

const config = getConfig();

@Entity()
export class CustomAddressFields {}
@Entity()
export class CustomCustomerFields {}
@Entity()
export class CustomProductFields {}
@Entity()
export class CustomProductFieldsTranslation {}
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

/**
 * Dynamically add columns to the custom field entity based on the CustomFields config.
 */
function registerEntityCustomFields(
    entityName: keyof CustomFields,
    ctor: { new (): any },
    translation = false,
) {
    const customFields = config.customFields && config.customFields[entityName];
    if (customFields) {
        for (const customField of customFields) {
            const { name, type } = customField;
            const registerColumn = () => Column({ type: getColumnType(type), name })(new ctor(), name);

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

function getColumnType(type: CustomFieldType): ColumnType {
    const dbEngine = config.dbConnectionOptions.type;
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

registerEntityCustomFields('Address', CustomAddressFields);
registerEntityCustomFields('Customer', CustomCustomerFields);
registerEntityCustomFields('Product', CustomProductFields);
registerEntityCustomFields('Product', CustomProductFieldsTranslation, true);
registerEntityCustomFields('ProductOption', CustomProductOptionFields);
registerEntityCustomFields('ProductOption', CustomProductOptionFieldsTranslation, true);
registerEntityCustomFields('ProductOptionGroup', CustomProductOptionGroupFields);
registerEntityCustomFields('ProductOptionGroup', CustomProductOptionGroupFieldsTranslation, true);
registerEntityCustomFields('ProductVariant', CustomProductVariantFields);
registerEntityCustomFields('ProductVariant', CustomProductVariantFieldsTranslation, true);
registerEntityCustomFields('User', CustomUserFields);
