import { CustomFieldType } from '@vendure/common/lib/shared-types';
import { assertNever } from '@vendure/common/lib/shared-utils';
import {
    Column,
    ColumnOptions,
    ColumnType,
    DataSourceOptions,
    Index,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
} from 'typeorm';
import { DateUtils } from 'typeorm/util/DateUtils';

import { CustomFieldConfig, CustomFields } from '../config/custom-field/custom-field-types';
import { Logger } from '../config/logger/vendure-logger';
import { VendureConfig } from '../config/vendure-config';

import {
    CustomAddressFields,
    CustomAdministratorFields,
    CustomAssetFields,
    CustomChannelFields,
    CustomCollectionFields,
    CustomCollectionFieldsTranslation,
    CustomCustomerFields,
    CustomCustomerGroupFields,
    CustomFacetFields,
    CustomFacetFieldsTranslation,
    CustomFacetValueFields,
    CustomFacetValueFieldsTranslation,
    CustomFulfillmentFields,
    CustomGlobalSettingsFields,
    CustomOrderFields,
    CustomOrderLineFields,
    CustomPaymentMethodFields,
    CustomProductFields,
    CustomProductFieldsTranslation,
    CustomProductOptionFields,
    CustomProductOptionFieldsTranslation,
    CustomProductOptionGroupFields,
    CustomProductOptionGroupFieldsTranslation,
    CustomProductVariantFields,
    CustomProductVariantFieldsTranslation,
    CustomPromotionFields,
    CustomRegionFields,
    CustomRegionFieldsTranslation,
    CustomSellerFields,
    CustomShippingMethodFields,
    CustomShippingMethodFieldsTranslation,
    CustomStockLocationFields,
    CustomTaxCategoryFields,
    CustomTaxRateFields,
    CustomUserFields,
    CustomZoneFields,
} from './custom-entity-fields';

/**
 * The maximum length of the "length" argument of a MySQL varchar column.
 */
const MAX_STRING_LENGTH = 65535;

/**
 * Dynamically add columns to the custom field entity based on the CustomFields config.
 */
function registerCustomFieldsForEntity(
    config: VendureConfig,
    entityName: keyof CustomFields,
    // eslint-disable-next-line @typescript-eslint/prefer-function-type
    ctor: { new (): any },
    translation = false,
) {
    const customFields = config.customFields && config.customFields[entityName];
    const dbEngine = config.dbConnectionOptions.type;
    if (customFields) {
        for (const customField of customFields) {
            const { name, list, defaultValue, nullable } = customField;
            const instance = new ctor();
            const registerColumn = () => {
                if (customField.type === 'relation') {
                    if (customField.list) {
                        ManyToMany(type => customField.entity, { eager: customField.eager })(instance, name);
                        JoinTable()(instance, name);
                    } else {
                        ManyToOne(type => customField.entity, { eager: customField.eager })(instance, name);
                        JoinColumn()(instance, name);
                    }
                } else {
                    const options: ColumnOptions = {
                        type: list ? 'simple-json' : getColumnType(dbEngine, customField.type),
                        default: getDefault(customField, dbEngine),
                        name,
                        nullable: nullable === false ? false : true,
                        unique: customField.unique ?? false,
                    };
                    if ((customField.type === 'string' || customField.type === 'localeString') && !list) {
                        const length = customField.length || 255;
                        if (MAX_STRING_LENGTH < length) {
                            throw new Error(
                                `ERROR: The "length" property of the custom field "${customField.name}" is ` +
                                    `greater than the maximum allowed value of ${MAX_STRING_LENGTH}`,
                            );
                        }
                        options.length = length;
                    }
                    if (
                        customField.type === 'float' &&
                        typeof customField.defaultValue === 'number' &&
                        (dbEngine === 'mariadb' || dbEngine === 'mysql')
                    ) {
                        // In the MySQL driver, a default float value will get rounded to the nearest integer.
                        // unless you specify the precision.
                        const defaultValueDecimalPlaces = customField.defaultValue.toString().split('.')[1];
                        if (defaultValueDecimalPlaces) {
                            options.scale = defaultValueDecimalPlaces.length;
                        }
                    }
                    if (
                        customField.type === 'datetime' &&
                        options.precision == null &&
                        // Setting precision on an sqlite datetime will cause
                        // spurious migration commands. See https://github.com/typeorm/typeorm/issues/2333
                        dbEngine !== 'sqljs' &&
                        dbEngine !== 'sqlite' &&
                        !list
                    ) {
                        options.precision = 6;
                    }
                    Column(options)(instance, name);
                    if ((dbEngine === 'mysql' || dbEngine === 'mariadb') && customField.unique === true) {
                        // The MySQL driver seems to work differently and will only apply a unique
                        // constraint if an index is defined on the column. For postgres/sqlite it is
                        // sufficient to add the `unique: true` property to the column options.
                        Index({ unique: true })(instance, name);
                    }
                }
            };

            if (translation) {
                if (customField.type === 'localeString' || customField.type === 'localeText') {
                    registerColumn();
                }
            } else {
                if (customField.type !== 'localeString' && customField.type !== 'localeText') {
                    registerColumn();
                }
            }

            const relationFieldsCount = customFields.filter(f => f.type === 'relation').length;
            const nonLocaleStringFieldsCount = customFields.filter(
                f => f.type !== 'localeString' && f.type !== 'relation',
            ).length;

            if (0 < relationFieldsCount && nonLocaleStringFieldsCount === 0) {
                // if (customFields.filter(f => f.type === 'relation').length === customFields.length) {
                // If there are _only_ relational customFields defined for an Entity, then TypeORM
                // errors when attempting to load that entity ("Cannot set property <fieldName> of undefined").
                // Therefore as a work-around we will add a "fake" column to the customFields embedded type
                // to prevent this error from occurring.
                Column({
                    type: 'boolean',
                    nullable: true,
                    comment:
                        'A work-around needed when only relational custom fields are defined on an entity',
                })(instance, '__fix_relational_custom_fields__');
            }
        }
    }
}

function formatDefaultDatetime(dbEngine: DataSourceOptions['type'], datetime: any): Date | string {
    if (!datetime) {
        return datetime;
    }
    switch (dbEngine) {
        case 'sqlite':
        case 'sqljs':
            return DateUtils.mixedDateToUtcDatetimeString(datetime);
        case 'mysql':
        case 'postgres':
        default:
            return DateUtils.mixedDateToUtcDatetimeString(datetime);
        // return DateUtils.mixedDateToDate(datetime, true, true);
    }
}

function getColumnType(
    dbEngine: DataSourceOptions['type'],
    type: Exclude<CustomFieldType, 'relation'>,
): ColumnType {
    switch (type) {
        case 'string':
        case 'localeString':
            return 'varchar';
        case 'text':
        case 'localeText':
            switch (dbEngine) {
                case 'mysql':
                case 'mariadb':
                    return 'longtext';
                default:
                    return 'text';
            }
        case 'boolean':
            switch (dbEngine) {
                case 'mysql':
                    return 'tinyint';
                case 'postgres':
                    return 'bool';
                case 'sqlite':
                case 'sqljs':
                default:
                    return 'boolean';
            }
        case 'int':
            return 'int';
        case 'float':
            return 'double precision';
        case 'datetime':
            switch (dbEngine) {
                case 'postgres':
                    return 'timestamp';
                case 'mysql':
                case 'sqlite':
                case 'sqljs':
                default:
                    return 'datetime';
            }
        default:
            assertNever(type);
    }
    return 'varchar';
}

function getDefault(customField: CustomFieldConfig, dbEngine: DataSourceOptions['type']) {
    const { name, type, list, defaultValue, nullable } = customField;
    if (list && defaultValue) {
        if (dbEngine === 'mysql') {
            // MySQL does not support defaults on TEXT fields, which is what "simple-json" uses
            // internally. See https://stackoverflow.com/q/3466872/772859
            Logger.warn(
                `MySQL does not support default values on list fields (${name}). No default will be set.`,
            );
            return undefined;
        }
        return JSON.stringify(defaultValue);
    }
    return type === 'datetime' ? formatDefaultDatetime(dbEngine, defaultValue) : defaultValue;
}

/**
 * Dynamically registers any custom fields with TypeORM. This function should be run at the bootstrap
 * stage of the app lifecycle, before the AppModule is initialized.
 */
export function registerCustomEntityFields(config: VendureConfig) {
    registerCustomFieldsForEntity(config, 'Address', CustomAddressFields);
    registerCustomFieldsForEntity(config, 'Administrator', CustomAdministratorFields);
    registerCustomFieldsForEntity(config, 'Asset', CustomAssetFields);
    registerCustomFieldsForEntity(config, 'Collection', CustomCollectionFields);
    registerCustomFieldsForEntity(config, 'Collection', CustomCollectionFieldsTranslation, true);
    registerCustomFieldsForEntity(config, 'Channel', CustomChannelFields);
    registerCustomFieldsForEntity(config, 'Customer', CustomCustomerFields);
    registerCustomFieldsForEntity(config, 'CustomerGroup', CustomCustomerGroupFields);
    registerCustomFieldsForEntity(config, 'Facet', CustomFacetFields);
    registerCustomFieldsForEntity(config, 'Facet', CustomFacetFieldsTranslation, true);
    registerCustomFieldsForEntity(config, 'FacetValue', CustomFacetValueFields);
    registerCustomFieldsForEntity(config, 'FacetValue', CustomFacetValueFieldsTranslation, true);
    registerCustomFieldsForEntity(config, 'Fulfillment', CustomFulfillmentFields);
    registerCustomFieldsForEntity(config, 'Order', CustomOrderFields);
    registerCustomFieldsForEntity(config, 'OrderLine', CustomOrderLineFields);
    registerCustomFieldsForEntity(config, 'PaymentMethod', CustomPaymentMethodFields);
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
    registerCustomFieldsForEntity(config, 'Promotion', CustomPromotionFields);
    registerCustomFieldsForEntity(config, 'TaxCategory', CustomTaxCategoryFields);
    registerCustomFieldsForEntity(config, 'TaxRate', CustomTaxRateFields);
    registerCustomFieldsForEntity(config, 'User', CustomUserFields);
    registerCustomFieldsForEntity(config, 'GlobalSettings', CustomGlobalSettingsFields);
    registerCustomFieldsForEntity(config, 'Region', CustomRegionFields);
    registerCustomFieldsForEntity(config, 'Region', CustomRegionFieldsTranslation, true);
    registerCustomFieldsForEntity(config, 'Seller', CustomSellerFields);
    registerCustomFieldsForEntity(config, 'ShippingMethod', CustomShippingMethodFields);
    registerCustomFieldsForEntity(config, 'ShippingMethod', CustomShippingMethodFieldsTranslation, true);
    registerCustomFieldsForEntity(config, 'StockLocation', CustomStockLocationFields);
    registerCustomFieldsForEntity(config, 'Zone', CustomZoneFields);
}
