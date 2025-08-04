import { DefaultFormComponentId } from '@vendure/common/lib/shared-types';
import { ControllerRenderProps } from 'react-hook-form';

import { CustomFieldListInput } from '@/vdb/components/data-input/custom-field-list-input.js';
import { StructFormInput } from '@/vdb/components/data-input/struct-form-input.js';
import {
    CustomFormComponent,
    CustomFormComponentInputProps,
} from '@/vdb/framework/form-engine/custom-form-component.js';

import { ConfigurableOperationListInput } from '../data-input/configurable-operation-list-input.js';
import { FacetValueInput } from '../data-input/facet-value-input.js';
import { getDirectFormComponent } from './direct-form-component-map.js';
import { UniversalFieldDefinition } from './universal-field-definition.js';
import { UniversalInputComponent } from './universal-input-components.js';
import { ValueMode } from './value-transformers.js';

export interface UniversalFormInputProps {
    fieldDef: UniversalFieldDefinition;
    field: ControllerRenderProps<any, any>;
    valueMode: ValueMode;
    disabled?: boolean;
    // Additional props for config args mode
    position?: number;
    // Additional props for custom fields mode
    control?: any;
    getTranslation?: (
        input: Array<{ languageCode: string; value: string }> | null | undefined,
    ) => string | undefined;
}

/**
 * Universal form input component that handles both custom fields and configurable operation args
 * Maintains full backward compatibility with existing APIs while eliminating duplication
 */
export function UniversalFormInput({
    fieldDef,
    field,
    valueMode,
    disabled = false,
    position,
    control,
    getTranslation,
}: Readonly<UniversalFormInputProps>) {
    const uiComponent = fieldDef.ui?.component;
    const isList = fieldDef.list ?? false;
    const isReadonly = disabled || fieldDef.readonly;

    // Handle special case: facet-value-form-input (only in config args)
    if (uiComponent === 'facet-value-form-input' && valueMode === 'json-string') {
        return <FacetValueInput value={field.value} onChange={field.onChange} readOnly={isReadonly} />;
    }

    // Handle custom form components (custom fields mode)
    if (uiComponent && valueMode === 'native') {
        const fieldProps: CustomFormComponentInputProps = {
            field: {
                ...field,
                disabled: isReadonly,
            },
            fieldState: {} as any, // This would be passed from the parent FormField
            formState: {} as any, // This would be passed from the parent FormField
        };

        return <CustomFormComponent fieldDef={fieldDef as any} fieldProps={fieldProps} />;
    }

    // Handle direct component mapping (config args mode)
    if (uiComponent && valueMode === 'json-string') {
        const DirectComponent = getDirectFormComponent(uiComponent as DefaultFormComponentId);
        if (DirectComponent) {
            return (
                <DirectComponent
                    fieldDef={fieldDef}
                    field={field}
                    valueMode={valueMode}
                    disabled={isReadonly}
                    position={position}
                />
            );
        }
    }

    // Handle struct fields (custom fields mode only)
    if (fieldDef.type === 'struct' && valueMode === 'native') {
        if (isList) {
            return (
                <CustomFieldListInput
                    field={field}
                    disabled={isReadonly}
                    renderInput={(index, inputField) => (
                        <StructFormInput
                            field={inputField}
                            fieldDef={fieldDef as any}
                            control={control}
                            getTranslation={getTranslation}
                        />
                    )}
                    defaultValue={{}}
                    isFullWidth={true}
                />
            );
        }

        return (
            <StructFormInput
                field={field}
                fieldDef={fieldDef as any}
                control={control}
                getTranslation={getTranslation}
            />
        );
    }

    // Handle list fields
    if (isList) {
        if (valueMode === 'json-string') {
            // Use ConfigurableOperationListInput for config args
            return (
                <ConfigurableOperationListInput
                    definition={fieldDef as any}
                    value={field.value}
                    onChange={field.onChange}
                    readOnly={isReadonly}
                />
            );
        } else {
            // Use CustomFieldListInput for custom fields
            const getDefaultValue = () => {
                switch (fieldDef.type) {
                    case 'string':
                    case 'localeString':
                    case 'localeText':
                        return '';
                    case 'int':
                    case 'float':
                        return 0;
                    case 'boolean':
                        return false;
                    case 'datetime':
                        return '';
                    case 'relation':
                        return '';
                    default:
                        return '';
                }
            };

            return (
                <CustomFieldListInput
                    field={field}
                    disabled={isReadonly}
                    renderInput={(index, inputField) => (
                        <UniversalInputComponent
                            fieldDef={{ ...fieldDef, list: false }}
                            field={inputField}
                            valueMode={valueMode}
                            disabled={isReadonly}
                        />
                    )}
                    defaultValue={getDefaultValue()}
                />
            );
        }
    }

    // Fall back to consolidated input component
    return (
        <UniversalInputComponent
            fieldDef={fieldDef}
            field={field}
            valueMode={valueMode}
            disabled={isReadonly}
        />
    );
}
