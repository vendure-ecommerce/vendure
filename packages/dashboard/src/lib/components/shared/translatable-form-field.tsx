import { OverriddenFormComponent } from '@/vdb/framework/form-engine/overridden-form-component.js';
import { LocationWrapper } from '@/vdb/framework/layout-engine/location-wrapper.js';
import { useLocalFormat } from '@/vdb/hooks/use-local-format.js';
import { useUserSettings } from '@/vdb/hooks/use-user-settings.js';
import { Trans } from '@lingui/react/macro';
import { useEffect } from 'react';
import { Controller, ControllerProps, FieldPath, FieldValues, useFormContext } from 'react-hook-form';
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '../ui/form.js';
import { FormFieldWrapper } from './form-field-wrapper.js';

export type TranslatableEntity = FieldValues & {
    translations?: Array<{ languageCode: string }> | null;
};

/**
 * @description
 * The props for the TranslatableFormField component.
 *
 * @docsCategory form-components
 * @docsPage TranslatableFormFieldWrapper
 * @since 3.4.0
 */
export type TranslatableFormFieldProps<TFieldValues extends TranslatableEntity | TranslatableEntity[]> = Omit<
    ControllerProps<TFieldValues>,
    'name'
> & {
    /**
     * @description
     * The label for the form field.
     */
    label?: React.ReactNode;
    /**
     * @description
     * The name of the form field.
     */
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
      label,
      ...props
  }: TranslatableFormFieldProps<TFieldValues>) => {
    const { formatLanguageName } = useLocalFormat();
    const { contentLanguage } = useUserSettings().settings;
    const { watch } = useFormContext();
    const formValues = watch();
    const translations = Array.isArray(formValues) ? formValues?.[0]?.translations : formValues?.translations;
    const existingIndex = translations?.findIndex(
        (translation: any) => translation?.languageCode === contentLanguage,
    );
    const isNewTranslation = existingIndex === -1;
    const index = isNewTranslation ? translations?.length : existingIndex;
    if (index === undefined || index === -1) {
        return (
            <FormItem>
                {label && <FormLabel>{label}</FormLabel>}
                <div className="text-sm text-muted-foreground">
                    <Trans>No translation found for {formatLanguageName(contentLanguage)}</Trans>
                </div>
            </FormItem>
        );
    }
    const translationName = `translations.${index}.${String(name)}` as FieldPath<TFieldValues>;
    return (
        <TranslatableFieldController
            {...props}
            name={translationName}
            index={index}
            isNewTranslation={isNewTranslation}
            contentLanguage={contentLanguage}
        />
    );
};

const TranslatableFieldController = <TFieldValues extends TranslatableEntity | TranslatableEntity[]>({
    index,
    isNewTranslation,
    contentLanguage,
    ...props
}: Omit<ControllerProps<TFieldValues>, 'name'> & {
    name: FieldPath<TFieldValues>;
    index: number;
    isNewTranslation: boolean;
    contentLanguage: string;
}) => {
    const { setValue, getValues } = useFormContext();

    useEffect(() => {
        if (isNewTranslation) {
            const translations = getValues('translations') || [];
            const currentLangCode = translations[index]?.languageCode;
            if (currentLangCode !== contentLanguage) {
                setValue(`translations.${index}.languageCode`, contentLanguage, { shouldDirty: true });
            }
        }
    }, [isNewTranslation, index, contentLanguage, setValue, getValues]);

    return <Controller key={`${props.name}-${contentLanguage}`} {...props} />;
};

export type TranslatableFormFieldWrapperProps<
    TFieldValues extends TranslatableEntity | TranslatableEntity[],
> = TranslatableFormFieldProps<TFieldValues> &
    Omit<React.ComponentProps<typeof FormFieldWrapper<TFieldValues>>, 'name'>;

/**
 * @description
 * This is the equivalent of the {@link FormFieldWrapper} component, but for translatable fields.
 *
 * @example
 * ```tsx
 * <PageBlock column="main" blockId="main-form">
 *     <DetailFormGrid>
 *         <TranslatableFormFieldWrapper
 *             control={form.control}
 *             name="name"
 *             label={<Trans>Product name</Trans>}
 *             render={({ field }) => <Input {...field} />}
 *         />
 *         <TranslatableFormFieldWrapper
 *             control={form.control}
 *             name="slug"
 *             label={<Trans>Slug</Trans>}
 *             render={({ field }) => <Input {...field} />}
 *         />
 *     </DetailFormGrid>

 *     <TranslatableFormFieldWrapper
 *         control={form.control}
 *         name="description"
 *         label={<Trans>Description</Trans>}
 *         render={({ field }) => <RichTextInput {...field} />}
 *     />
 * </PageBlock>
 * ```
 *
 * @docsCategory form-components
 * @docsPage TranslatableFormFieldWrapper
 * @docsWeight 0
 * @since 3.4.0
 */
export const TranslatableFormFieldWrapper = <
    TFieldValues extends TranslatableEntity | TranslatableEntity[] = TranslatableEntity,
>({
      name,
      label,
      description,
      render,
      renderFormControl,
      ...props
  }: TranslatableFormFieldWrapperProps<TFieldValues>) => {
    return (
        <LocationWrapper identifier={name as string}>
            <TranslatableFormField
                label={label}
                control={props.control}
                name={name}
                render={renderArgs => (
                    <FormItem>
                        {label && <FormLabel>{label}</FormLabel>}
                        {renderFormControl ? (
                            <FormControl>
                                <OverriddenFormComponent field={renderArgs.field} fieldName={name as string}>
                                    {render(renderArgs)}
                                </OverriddenFormComponent>
                            </FormControl>
                        ) : (
                            <OverriddenFormComponent field={renderArgs.field} fieldName={name as string}>
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
};
