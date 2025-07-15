import { OverriddenFormComponent } from '@/vdb/framework/form-engine/overridden-form-component.js';
import { LocationWrapper } from '@/vdb/framework/layout-engine/location-wrapper.js';
import { FieldPath, FieldValues } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form.js';

export type FormFieldWrapperProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = React.ComponentProps<typeof FormField<TFieldValues, TName>> & {
    label?: React.ReactNode;
    description?: React.ReactNode;
    /**
     * @description
     * Whether to render the form control.
     * If false, the form control will not be rendered.
     * This is useful when you want to render the form control in a custom way, e.g. for <Select/> components,
     * where the FormControl needs to nested in the root component.
     * @default true
     */
    renderFormControl?: boolean;
};

export function FormFieldWrapper<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
    control,
    name,
    render,
    label,
    description,
    renderFormControl = true,
}: FormFieldWrapperProps<TFieldValues, TName>) {
    return (
        <LocationWrapper identifier={name}>
            <FormField
                control={control}
                name={name}
                render={renderArgs => (
                    <FormItem>
                        {label && <FormLabel>{label}</FormLabel>}
                        {renderFormControl ? (
                            <FormControl>
                                <OverriddenFormComponent field={renderArgs.field} fieldName={name}>
                                    {render(renderArgs)}
                                </OverriddenFormComponent>
                            </FormControl>
                        ) : (
                            <OverriddenFormComponent field={renderArgs.field} fieldName={name}>
                                {render(renderArgs)}
                            </OverriddenFormComponent>
                        )}
                        {description && <FormDescription>{description}</FormDescription>}
                        <FormMessage />
                    </FormItem>
                )}
            />
        </LocationWrapper>
    );
}
