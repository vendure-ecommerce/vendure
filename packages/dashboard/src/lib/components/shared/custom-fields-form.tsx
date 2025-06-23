import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form.js';
import { Input } from '@/components/ui/input.js';
import { CustomFormComponent } from '@/framework/form-engine/custom-form-component.js';
import { useCustomFieldConfig } from '@/hooks/use-custom-field-config.js';
import { useUserSettings } from '@/hooks/use-user-settings.js';
import { customFieldConfigFragment } from '@/providers/server-config.js';
import { CustomFieldType } from '@vendure/common/lib/shared-types';
import { ResultOf } from 'gql.tada';
import { Control, ControllerRenderProps } from 'react-hook-form';
import { Switch } from '../ui/switch.js';
import { TranslatableFormField } from './translatable-form-field.js';

type CustomFieldConfig = ResultOf<typeof customFieldConfigFragment>;

interface CustomFieldsFormProps {
    entityType: string;
    control: Control<any, any>;
    formPathPrefix?: string;
}

export function CustomFieldsForm({ entityType, control, formPathPrefix }: CustomFieldsFormProps) {
    const {
        settings: { displayLanguage },
    } = useUserSettings();
    function getTranslation(input: Array<{ languageCode: string; value: string }> | null | undefined) {
        return input?.find(t => t.languageCode === displayLanguage)?.value;
    }
    const customFields = useCustomFieldConfig(entityType);

    return (
        <div className="grid grid-cols-2 gap-4">
            {customFields?.map(fieldDef => {
                const hasCustomFormComponent = fieldDef.ui && fieldDef.ui.component;
                return (
                    <div key={fieldDef.name}>
                        {hasCustomFormComponent && (
                            <FormField
                                control={control}
                                name={
                                    formPathPrefix
                                        ? `${formPathPrefix}.customFields.${fieldDef.name}`
                                        : `customFields.${fieldDef.name}`
                                }
                                render={fieldProps => (
                                    <FormItem>
                                        <FormLabel>
                                            {getTranslation(fieldDef.label) ?? fieldProps.field.name}
                                        </FormLabel>
                                        <FormControl>
                                            {fieldDef.readonly ? (
                                                fieldProps.field.value
                                            ) : (
                                                <CustomFormComponent
                                                    fieldDef={fieldDef}
                                                    fieldProps={fieldProps}
                                                />
                                            )}
                                        </FormControl>
                                        <FormDescription>
                                            {getTranslation(fieldDef.description)}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        {!hasCustomFormComponent &&
                            (fieldDef.type === 'localeString' || fieldDef.type === 'localeText' ? (
                                <TranslatableFormField
                                    control={control}
                                    name={
                                        formPathPrefix
                                            ? `${formPathPrefix}.customFields.${fieldDef.name}`
                                            : `customFields.${fieldDef.name}`
                                    }
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {getTranslation(fieldDef.label) ?? field.name}
                                            </FormLabel>
                                            <FormControl>
                                                {fieldDef.readonly ? (
                                                    field.value
                                                ) : (
                                                    <FormInputForType fieldDef={fieldDef} field={field} />
                                                )}
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            ) : (
                                <FormField
                                    control={control}
                                    name={
                                        formPathPrefix
                                            ? `${formPathPrefix}.customFields.${fieldDef.name}`
                                            : `customFields.${fieldDef.name}`
                                    }
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {getTranslation(fieldDef.label) ?? field.name}
                                            </FormLabel>
                                            <FormControl>
                                                {fieldDef.readonly ? (
                                                    field.value
                                                ) : (
                                                    <FormInputForType fieldDef={fieldDef} field={field} />
                                                )}
                                            </FormControl>
                                            <FormDescription>
                                                {getTranslation(fieldDef.description)}
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                    </div>
                );
            })}
        </div>
    );
}

function FormInputForType({
    fieldDef,
    field,
}: {
    fieldDef: CustomFieldConfig;
    field: ControllerRenderProps<any, any>;
}) {
    switch (fieldDef.type as CustomFieldType) {
        case 'string':
            return <Input {...field} />;
        case 'float':
        case 'int':
            return <Input type="number" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} />;
        case 'boolean':
            return <Switch checked={field.value} onCheckedChange={field.onChange} />;
        default:
            return <Input {...field} />;
    }
}
