import { CustomFieldConfig } from '@vendure/common/lib/generated-types';
import {
    ControllerFieldState,
    ControllerRenderProps,
    FieldPath,
    FieldValues,
    UseFormStateReturn,
} from 'react-hook-form';
import { getCustomFormComponent } from './custom-form-component-extensions.js';

export interface CustomFormComponentProps {
    fieldProps: CustomFormComponentInputProps;
    fieldDef: Pick<CustomFieldConfig, 'ui' | 'type' | 'name'>;
}

export interface CustomFormComponentInputProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
    field: ControllerRenderProps<TFieldValues, TName>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<TFieldValues>;
}

export function CustomFormComponent({ fieldDef, fieldProps }: CustomFormComponentProps) {
    const Component = getCustomFormComponent(fieldDef.ui?.component);

    if (!Component) {
        return null;
    }

    return <Component {...fieldProps} />;
}
