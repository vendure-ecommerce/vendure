import { ConfigurableOperationDefFragment } from '@/vdb/graphql/fragments.js';
import { CustomFieldConfig } from '@vendure/common/lib/generated-types';
import { ConfigArgType, CustomFieldType, DefaultFormComponentId } from '@vendure/common/lib/shared-types';

/**
 * Universal field definition that can represent both custom fields and configurable operation args
 */
export interface UniversalFieldDefinition {
    name: string;
    type: CustomFieldType | 'ID'; // Extends CustomFieldType with ID for config args
    list?: boolean;
    readonly?: boolean;
    ui?: {
        component?: DefaultFormComponentId | string;
        options?: Array<{ value: string; label: string | Array<{ languageCode: string; value: string }> }>;
        min?: number;
        max?: number;
        step?: number;
        prefix?: string;
        suffix?: string;
        tab?: string;
        fullWidth?: boolean;
        spellcheck?: boolean;
        selectionMode?: string;
    };
    entity?: string; // for relations
    label?: string | Array<{ languageCode: string; value: string }>;
    description?: string | Array<{ languageCode: string; value: string }>;
}

/**
 * Convert a custom field config to universal field definition
 */
export function customFieldToUniversal(fieldDef: CustomFieldConfig): UniversalFieldDefinition {
    const hasOptions = (fieldDef as any).options;
    const hasUi = fieldDef.ui;
    const hasNumericConfig =
        (fieldDef as any).min !== undefined ||
        (fieldDef as any).max !== undefined ||
        (fieldDef as any).step !== undefined;

    return {
        name: fieldDef.name,
        type: fieldDef.type as any,
        list: fieldDef.list ?? false,
        readonly: fieldDef.readonly ?? false,
        ui:
            hasUi || hasOptions || hasNumericConfig
                ? {
                      component: fieldDef.ui?.component,
                      options: (fieldDef as any).options,
                      ...((fieldDef as any).min != null && {
                          min: (fieldDef as any).min,
                      }),
                      ...((fieldDef as any).max != null && {
                          max: (fieldDef as any).max,
                      }),
                      ...((fieldDef as any).step != null && {
                          step: (fieldDef as any).step,
                      }),
                      tab: fieldDef.ui?.tab,
                      fullWidth: fieldDef.ui?.fullWidth,
                  }
                : undefined,
        entity: (fieldDef as any).entity,
        label: fieldDef.label,
        description: fieldDef.description,
    };
}

/**
 * Convert a configurable operation arg definition to universal field definition
 */
export function configArgToUniversal(
    definition: ConfigurableOperationDefFragment['args'][number],
): UniversalFieldDefinition {
    const ui = definition.ui;

    return {
        name: definition.name,
        type: mapConfigArgType(definition.type as ConfigArgType),
        list: definition.list ?? false,
        readonly: false,
        ui: ui
            ? {
                  component: ui.component,
                  options: ui.options,
                  min: ui.min ?? undefined,
                  max: ui.max ?? undefined,
                  step: ui.step ?? undefined,
                  prefix: ui.prefix,
                  suffix: ui.suffix,
                  spellcheck: ui.spellcheck,
                  selectionMode: ui.selectionMode,
              }
            : undefined,
        entity: getEntityFromUiComponent(ui?.component),
        label: definition.label,
        description: definition.description,
    };
}

function mapConfigArgType(configArgType: ConfigArgType): UniversalFieldDefinition['type'] {
    // All ConfigArgType values are compatible with our extended type
    return configArgType as UniversalFieldDefinition['type'];
}

function getEntityFromUiComponent(component?: string): string | undefined {
    switch (component) {
        case 'product-selector-form-input':
        case 'product-multi-form-input':
            return 'Product';
        case 'customer-group-form-input':
            return 'CustomerGroup';
        default:
            return undefined;
    }
}
