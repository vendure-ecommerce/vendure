import { ControllerRenderProps } from 'react-hook-form';

import { CustomFieldListInput } from '@/vdb/components/data-input/custom-field-list-input.js';
import { StructFormInput } from '@/vdb/components/data-input/struct-form-input.js';
import { CustomFormComponent } from '@/vdb/framework/form-engine/custom-form-component.js';

import { getInputComponent } from '@/vdb/framework/extension-api/input-component-extensions.js';
import { ConfigurableFieldDef } from '@/vdb/framework/form-engine/form-engine-types.js';
import { isCustomFieldConfig } from '@/vdb/framework/form-engine/utils.js';
import { useMemo } from 'react';
import { ConfigurableOperationListInput } from '../../components/data-input/configurable-operation-list-input.js';
import { DefaultInputForType } from './default-input-for-type.js';
import { transformValue, ValueMode } from './value-transformers.js';

export interface FormControlAdapterProps {
    fieldDef: ConfigurableFieldDef;
    field: ControllerRenderProps<any, any>;
    valueMode: ValueMode;
}

/**
 * This is a wrapper component around the final DashboardFormComponent instances.
 *
 * It is responsible for ensuring the correct props get passed to the final component,
 * and for handling differences between form control use between:
 *
 * - Auot-generated forms
 * - Custom field forms
 * - Configurable operation forms
 */
export function FormControlAdapter({ fieldDef, field, valueMode }: Readonly<FormControlAdapterProps>) {
    const isList = fieldDef.list ?? false;
    const isReadonly = isCustomFieldConfig(fieldDef) ? fieldDef.readonly === true : false;
    const componentId = fieldDef.ui?.component;

    const fieldWithTransform = useMemo(() => {
        field.value = transformValue(field.value, fieldDef, valueMode, 'parse');
        const fieldOnChange = field.onChange.bind(field);
        field.onChange = (newValue: any) => {
            const serializedValue = transformValue(newValue, fieldDef, valueMode, 'serialize');
            fieldOnChange(serializedValue);
        };
        return field;
    }, [field]);

    // For non-list, non-struct fields - handle component lookup simply
    if (!isList && fieldDef.type !== 'struct') {
        if (componentId) {
            const customComponent = getInputComponent(componentId);
            if (customComponent) {
                return <CustomFormComponent {...fieldWithTransform} fieldDef={fieldDef} />;
            }
        }
        return <DefaultInputForType {...fieldWithTransform} fieldDef={fieldDef} />;
    }

    // Handle struct fields (custom fields mode only)
    if (fieldDef.type === 'struct' && valueMode === 'native') {
        if (isList) {
            return (
                <CustomFieldListInput
                    {...field}
                    disabled={isReadonly}
                    renderInput={(index, inputField) => (
                        <StructFormInput {...fieldWithTransform} fieldDef={fieldDef} />
                    )}
                    defaultValue={{}}
                    isFullWidth={true}
                />
            );
        }

        return <StructFormInput {...fieldWithTransform} fieldDef={fieldDef} />;
    }

    // Handle list fields
    if (isList) {
        if (valueMode === 'json-string') {
            return <ConfigurableOperationListInput {...fieldWithTransform} fieldDef={fieldDef} />;
        } else {
            // Simple default values
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
                    default:
                        return '';
                }
            };

            return (
                <CustomFieldListInput
                    {...field}
                    disabled={isReadonly}
                    renderInput={(index, inputField) => (
                        <DefaultInputForType {...inputField} fieldDef={fieldDef} />
                    )}
                    defaultValue={getDefaultValue()}
                />
            );
        }
    }

    // Final fallback
    return <DefaultInputForType {...fieldWithTransform} fieldDef={fieldDef} />;
}
