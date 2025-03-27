import {
    FormControl,
    FormDescription,
    FormItem,
    FormLabel,
    FormMessage,
    FormField,
} from '../ui/form.js';
import { FieldValues, FieldPath } from 'react-hook-form';

export type FormFieldWrapperProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = React.ComponentProps<typeof FormField<TFieldValues, TName>> & {
    label?: React.ReactNode;
    description?: React.ReactNode;
};

export function FormFieldWrapper<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ control, name, render, label, description }: FormFieldWrapperProps<TFieldValues, TName>) {
    return (
        <FormField
            control={control}
            name={name}
            render={renderArgs => (
                <FormItem>
                    {label && <FormLabel>{label}</FormLabel>}
                    <FormControl>{render(renderArgs)}</FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
