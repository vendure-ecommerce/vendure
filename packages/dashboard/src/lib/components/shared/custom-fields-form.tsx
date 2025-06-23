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

    const getTranslation = (input: Array<{ languageCode: string; value: string }> | null | undefined) => {
        return input?.find(t => t.languageCode === displayLanguage)?.value;
    };

    const customFields = useCustomFieldConfig(entityType);

    const getFieldName = (fieldDefName: string) => {
        return formPathPrefix
            ? `${formPathPrefix}.customFields.${fieldDefName}`
            : `customFields.${fieldDefName}`;
    };

    return (
        <div className="grid grid-cols-2 gap-4">
            {customFields?.map(fieldDef => (
                <CustomFieldItem
                    key={fieldDef.name}
                    fieldDef={fieldDef}
                    control={control}
                    fieldName={getFieldName(fieldDef.name)}
                    getTranslation={getTranslation}
                />
            ))}
        </div>
    );
}

interface CustomFieldItemProps {
    fieldDef: CustomFieldConfig;
    control: Control<any, any>;
    fieldName: string;
    getTranslation: (
        input: Array<{ languageCode: string; value: string }> | null | undefined,
    ) => string | undefined;
}

function CustomFieldItem({ fieldDef, control, fieldName, getTranslation }: CustomFieldItemProps) {
    const hasCustomFormComponent = fieldDef.ui && fieldDef.ui.component;
    const isLocaleField = fieldDef.type === 'localeString' || fieldDef.type === 'localeText';

    if (hasCustomFormComponent) {
        return (
            <FormField
                control={control}
                name={fieldName}
                render={fieldProps => (
                    <CustomFieldFormItem
                        fieldDef={fieldDef}
                        getTranslation={getTranslation}
                        fieldName={fieldProps.field.name}
                    >
                        <CustomFormComponent
                            fieldDef={fieldDef}
                            fieldProps={{
                                ...fieldProps,
                                field: {
                                    ...fieldProps.field,
                                    disabled: fieldDef.readonly ?? false,
                                },
                            }}
                        />
                    </CustomFieldFormItem>
                )}
            />
        );
    }

    if (isLocaleField) {
        return (
            <TranslatableFormField
                control={control}
                name={fieldName}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{getTranslation(fieldDef.label) ?? field.name}</FormLabel>
                        <FormControl>
                            <FormInputForType fieldDef={fieldDef} field={field} />
                        </FormControl>
                    </FormItem>
                )}
            />
        );
    }

    return (
        <FormField
            control={control}
            name={fieldName}
            render={({ field }) => (
                <CustomFieldFormItem
                    fieldDef={fieldDef}
                    getTranslation={getTranslation}
                    fieldName={field.name}
                >
                    <FormInputForType fieldDef={fieldDef} field={field} />
                </CustomFieldFormItem>
            )}
        />
    );
}

interface CustomFieldFormItemProps {
    fieldDef: CustomFieldConfig;
    getTranslation: (
        input: Array<{ languageCode: string; value: string }> | null | undefined,
    ) => string | undefined;
    fieldName: string;
    children: React.ReactNode;
}

function CustomFieldFormItem({ fieldDef, getTranslation, fieldName, children }: CustomFieldFormItemProps) {
    return (
        <FormItem>
            <FormLabel>{getTranslation(fieldDef.label) ?? fieldName}</FormLabel>
            <FormControl>{children}</FormControl>
            <FormDescription>{getTranslation(fieldDef.description)}</FormDescription>
            <FormMessage />
        </FormItem>
    );
}

function FormInputForType({
    fieldDef,
    field,
}: {
    fieldDef: CustomFieldConfig;
    field: ControllerRenderProps<any, any>;
}) {
    const isReadonly = fieldDef.readonly ?? false;

    switch (fieldDef.type as CustomFieldType) {
        case 'string':
            return <Input {...field} disabled={isReadonly} />;
        case 'float':
        case 'int':
            return (
                <Input
                    type="number"
                    {...field}
                    disabled={isReadonly}
                    onChange={e => field.onChange(e.target.valueAsNumber)}
                />
            );
        case 'boolean':
            return <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isReadonly} />;
        default:
            return <Input {...field} disabled={isReadonly} />;
    }
}
