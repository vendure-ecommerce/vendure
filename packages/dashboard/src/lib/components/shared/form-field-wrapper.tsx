import { OverriddenFormComponent } from '@/vdb/framework/form-engine/overridden-form-component.js';
import { LocationWrapper } from '@/vdb/framework/layout-engine/location-wrapper.js';
import { FieldPath, FieldValues } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form.js';

/**
 * @description
 * The props for the FormFieldWrapper component.
 *
 * @docsCategory form-components
 * @docsPage FormFieldWrapper
 * @since 3.4.0
 */
export type FormFieldWrapperProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = React.ComponentProps<typeof FormField<TFieldValues, TName>> & {
    /**
     * @description
     * The label for the form field.
     */
    label?: React.ReactNode;
    /**
     * @description
     * The description for the form field.
     */
    description?: React.ReactNode;
    /**
     * @description
     * Whether to render the form control.
     * If false, the form control will not be rendered.
     * This is useful when you want to render the form control in a custom way, e.g. for <Select/> components,
     * where the FormControl needs to nested in the root component.
     *
     * @default true
     */
    renderFormControl?: boolean;
};

/**
 * @description
 * This is a wrapper that can be used in all forms to wrap the actual form control, and provide a label, description and error message.
 * 
 * Use this instead of the default Shadcn FormField (etc.) components, as it also supports
 * overridden form components.
 * 
 * @example
 * ```tsx
 * <PageBlock column="main" blockId="main-form">
 *     <DetailFormGrid>
 *         <FormFieldWrapper
 *             control={form.control}
 *             name="description"
 *             label={<Trans>Description</Trans>}
 *             render={({ field }) => <Input {...field} />}
 *         />
 *         <FormFieldWrapper
 *             control={form.control}
 *             name="code"
 *             label={<Trans>Code</Trans>}
 *             render={({ field }) => <Input {...field} />}
 *         />
 *     </DetailFormGrid>
 * </PageBlock>
 * ```
 * 
 * If you are dealing with translatable fields, use the {@link TranslatableFormFieldWrapper} component instead.
 *
 * @docsCategory form-components
 * @docsPage FormFieldWrapper
 * @docsWeight 0
 * @since 3.4.0
 */
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
