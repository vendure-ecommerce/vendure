import { useCustomFieldConfig } from '@/hooks/use-custom-field-config.js';
import { Control, ControllerRenderProps } from 'react-hook-form';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form.js';
import { Input } from '@/components/ui/input.js';
import { useUserSettings } from '@/hooks/use-user-settings.js';
import { Switch } from '../ui/switch.js';
import { CustomFieldType } from '@vendure/common/lib/shared-types';
import { TranslatableFormField } from './translatable-form-field.js';
import { customFieldConfigFragment } from '@/providers/server-config.js';
import { ResultOf } from 'gql.tada';

type CustomFieldConfig = ResultOf<typeof customFieldConfigFragment>;

interface CustomFieldsFormProps {
    entityType: string;
    control: Control<any, any>;
}

export function CustomFieldsForm({ entityType, control }: CustomFieldsFormProps) {
    const {
        settings: { displayLanguage },
    } = useUserSettings();
    function getTranslation(input: Array<{ languageCode: string; value: string }> | null | undefined) {
        return input?.find(t => t.languageCode === displayLanguage)?.value;
    }
    const customFields = useCustomFieldConfig(entityType);
    return (
        <div className="grid grid-cols-2 gap-4">
            {customFields?.map(fieldDef => (
                <div key={fieldDef.name}>
                    {fieldDef.type === 'localeString' || fieldDef.type === 'localeText' ? (
                        <TranslatableFormField
                            control={control}
                            name={`customFields.${fieldDef.name}`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{getTranslation(fieldDef.label) ?? field.name}</FormLabel>
                                    <FormControl>
                                        {fieldDef.readonly ? field.value : <FormInputForType fieldDef={fieldDef} field={field} />}
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    ) : (
                        <FormField
                            control={control}
                            name={`customFields.${fieldDef.name}`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>{getTranslation(fieldDef.label) ?? field.name}</FormLabel>
                                <FormControl>
                                    {fieldDef.readonly ? field.value : <FormInputForType fieldDef={fieldDef} field={field} />}
                                </FormControl>
                                <FormDescription>{getTranslation(fieldDef.description)}</FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

function FormInputForType({ fieldDef, field }: { fieldDef: CustomFieldConfig, field: ControllerRenderProps }) {
    switch (fieldDef.type as CustomFieldType) {    
        case 'string':
            return <Input {...field} />;
        case 'float':
        case 'int':
            return <Input type="number" {...field}  onChange={(e) => field.onChange(e.target.valueAsNumber)} />;
        case 'boolean':
            return <Switch checked={field.value} onCheckedChange={field.onChange} />;
        default:
            return <Input {...field} />
    }
}
