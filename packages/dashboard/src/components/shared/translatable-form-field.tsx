import { Controller } from 'react-hook-form';
import { FieldPath } from 'react-hook-form';
import { useUserSettings } from '@/providers/user-settings.js';
import { ControllerProps } from 'react-hook-form';
import { FieldValues } from 'react-hook-form';

export type TranslatableFormFieldProps = {};

export const TranslatableFormField = <
    TFieldValues extends FieldValues & {
        translations?: Array<{ languageCode: string }> | null;
    } = FieldValues,
>({
    name,
    ...props
}: Omit<ControllerProps<TFieldValues>, 'name'> & {
    name: keyof Omit<NonNullable<TFieldValues['translations']>[number], 'languageCode'>;
}) => {
    const { contentLanguage } = useUserSettings().settings;
    const index = props.control?._formValues?.translations?.findIndex(
        (translation: any) => translation?.languageCode === contentLanguage,
    );
    if (index === undefined || index === -1) {
        return null;
    }
    const translationName = `translations.${index}.${String(name)}` as FieldPath<TFieldValues>;
    return <Controller {...props} name={translationName} key={translationName} />;
};
