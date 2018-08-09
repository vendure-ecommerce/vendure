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
export class CustomProductOptionFields {}
@Entity()
export class CustomProductOptionGroupFields {}
@Entity()
export class CustomProductVariantFields {}
@Entity()
export class CustomUserFields {}

/**
 * Dynamically add columns to the custom field entity based on the CustomFields config.
 */
function registerEntityCustomFields(entityName: keyof CustomFields, ctor: { new (): any }) {
    const customFields = config.customFields && config.customFields[entityName];
    if (customFields) {
        for (const customField of customFields) {
            const { name, type } = customField;
            Column({ type: getColumnType(type), name })(new ctor(), name);
        }
    }
}

function getColumnType(type: CustomFieldType): ColumnType {
    switch (type) {
        case 'string':
        case 'localeString':
            return 'varchar';
        case 'boolean':
            return 'bool';
        case 'int':
            return 'int';
        case 'float':
            return 'double';
        case 'datetime':
            return 'datetime';
        default:
            assertNever(type);
    }
    return 'varchar';
}

registerEntityCustomFields('Address', CustomAddressFields);
registerEntityCustomFields('Customer', CustomCustomerFields);
registerEntityCustomFields('Product', CustomProductFields);
registerEntityCustomFields('ProductOption', CustomProductOptionFields);
registerEntityCustomFields('ProductOptionGroup', CustomProductOptionGroupFields);
registerEntityCustomFields('ProductVariant', CustomProductVariantFields);
registerEntityCustomFields('User', CustomUserFields);
