import { GraphQLSchema, isInterfaceType } from 'graphql';

import { CustomFieldConfig, CustomFields } from '../../config/custom-field/custom-field-types';

/**
 * @description
 * Because the "Region" entity is an interface, it cannot be extended directly, so we need to
 * replace it if found in the custom field config with its concrete implementations.
 */
export function getCustomFieldsConfigWithoutInterfaces(
    customFieldConfig: CustomFields,
    schema: GraphQLSchema,
): Array<[entityName: string, config: CustomFieldConfig[]]> {
    const entries = Object.entries(customFieldConfig);
    const regionIndex = entries.findIndex(([name]) => name === 'Region');
    if (regionIndex !== -1) {
        // Region is an interface and cannot directly be extended. Instead, we will use the
        // concrete types that implement it.
        const regionType = schema.getType('Region');
        if (isInterfaceType(regionType)) {
            const implementations = schema.getImplementations(regionType);
            // Remove "Region" from the list of entities to which custom fields can be added
            entries.splice(regionIndex, 1);

            for (const implementation of implementations.objects) {
                entries.push([implementation.name, customFieldConfig.Region ?? []]);
            }
        }
    }
    return entries;
}
