import { Controller } from 'react-hook-form';
import { FieldPath } from 'react-hook-form';
import { useUserSettings } from '@/hooks/use-user-settings.js';
import { ControllerProps } from 'react-hook-form';
import { FieldValues } from 'react-hook-form';
import { FormFieldWrapper } from './form-field-wrapper.js';
import { FormMessage } from '../ui/form.js';
import { FormControl } from '../ui/form.js';
import { FormItem } from '../ui/form.js';
import { FormDescription, FormField, FormLabel } from '../ui/form.js';

export type TranslatableEntity = FieldValues & {
    translations?: Array<{ languageCode: string }> | null;
};

export type TranslatableFormFieldProps<TFieldValues extends TranslatableEntity | TranslatableEntity[]> = Omit<
    ControllerProps<TFieldValues>,
    'name'
> & {
    name: TFieldValues extends TranslatableEntity
        ? keyof Omit<NonNullable<TFieldValues['translations']>[number], 'languageCode'>
        : TFieldValues extends TranslatableEntity[]
          ? keyof Omit<NonNullable<TFieldValues[number]['translations']>[number], 'languageCode'>
          : never;
};

export const TranslatableFormField = <
    TFieldValues extends TranslatableEntity | TranslatableEntity[] = TranslatableEntity,
>({
    name,
    ...props
}: TranslatableFormFieldProps<TFieldValues>) => {
    const { contentLanguage } = useUserSettings().settings;
    const formValues = props.control?._formValues;
    const translations = Array.isArray(formValues) ? formValues?.[0].translations : formValues?.translations;
    const index = translations?.findIndex(
        (translation: any) => translation?.languageCode === contentLanguage,
    );
    if (index === undefined || index === -1) {
        return null;
    }
    const translationName = `translations.${index}.${String(name)}` as FieldPath<TFieldValues>;
    return <Controller {...props} name={translationName} key={translationName} />;
};

export type TranslatableFormFieldWrapperProps<
    TFieldValues extends TranslatableEntity | TranslatableEntity[],
> = TranslatableFormFieldProps<TFieldValues> &
    Omit<React.ComponentProps<typeof FormFieldWrapper<TFieldValues>>, 'name'>;

export const TranslatableFormFieldWrapper = <
    TFieldValues extends TranslatableEntity | TranslatableEntity[] = TranslatableEntity,
>({
    name,
    label,
    description,
    render,
    ...props
}: TranslatableFormFieldWrapperProps<TFieldValues>) => {
    return (
        <TranslatableFormField
            control={props.control}
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
};
