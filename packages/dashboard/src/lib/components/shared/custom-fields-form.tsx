import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/vdb/components/ui/form.js';
import { Input } from '@/vdb/components/ui/input.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/vdb/components/ui/tabs.js';
import { SelectWithOptions } from '@/vdb/components/data-input/select-with-options.js';
import { DateTimeInput } from '@/vdb/components/data-input/datetime-input.js';
import { CustomFormComponent } from '@/vdb/framework/form-engine/custom-form-component.js';
import { useCustomFieldConfig } from '@/vdb/hooks/use-custom-field-config.js';
import { useUserSettings } from '@/vdb/hooks/use-user-settings.js';
import { useLingui } from '@/vdb/lib/trans.js';
import { customFieldConfigFragment } from '@/vdb/providers/server-config.js';
import { CustomFieldType } from '@vendure/common/lib/shared-types';
import { ResultOf } from 'gql.tada';
import React, { useMemo } from 'react';
import { Control, ControllerRenderProps } from 'react-hook-form';
import { Switch } from '../ui/switch.js';
import { TranslatableFormField } from './translatable-form-field.js';
import { StringCustomFieldConfig } from '@vendure/common/lib/generated-types';

type CustomFieldConfig = ResultOf<typeof customFieldConfigFragment>;

interface CustomFieldsFormProps {
    entityType: string;
    control: Control<any, any>;
    formPathPrefix?: string;
}

export function CustomFieldsForm({ entityType, control, formPathPrefix }: Readonly<CustomFieldsFormProps>) {
    const {
        settings: { displayLanguage },
    } = useUserSettings();
    const { i18n } = useLingui();

    const getTranslation = (input: Array<{ languageCode: string; value: string }> | null | undefined) => {
        return input?.find(t => t.languageCode === displayLanguage)?.value;
    };

    const customFields = useCustomFieldConfig(entityType);

    const getFieldName = (fieldDef: CustomFieldConfig) => {
        const name =
            fieldDef.type === 'relation'
                ? fieldDef.list
                    ? fieldDef.name + 'Ids'
                    : fieldDef.name + 'Id'
                : fieldDef.name;
        return formPathPrefix ? `${formPathPrefix}.customFields.${name}` : `customFields.${name}`;
    };

    // Group custom fields by tabs
    const groupedFields = useMemo(() => {
        if (!customFields) return [];

        const tabMap = new Map<string, CustomFieldConfig[]>();
        const defaultTabName = '__default_tab__';

        for (const field of customFields) {
            const tabName = field.ui?.tab ?? defaultTabName;
            if (tabMap.has(tabName)) {
                tabMap.get(tabName)?.push(field);
            } else {
                tabMap.set(tabName, [field]);
            }
        }

        return Array.from(tabMap.entries())
            .sort((a, b) => (a[0] === defaultTabName ? -1 : 1))
            .map(([tabName, customFields]) => ({
                tabName: tabName === defaultTabName ? 'general' : tabName,
                customFields,
            }));
    }, [customFields]);

    // Check if we should show tabs (more than one tab or at least one field has a tab)
    const shouldShowTabs = useMemo(() => {
        if (!customFields) return false;
        const hasTabbedFields = customFields.some(field => field.ui?.tab);
        return hasTabbedFields || groupedFields.length > 1;
    }, [customFields, groupedFields.length]);

    if (!shouldShowTabs) {
        // Single tab view - use the original grid layout
        return (
            <div className="grid grid-cols-2 gap-4">
                {customFields?.map(fieldDef => (
                    <CustomFieldItem
                        key={fieldDef.name}
                        fieldDef={fieldDef}
                        control={control}
                        fieldName={getFieldName(fieldDef)}
                        getTranslation={getTranslation}
                    />
                ))}
            </div>
        );
    }

    // Tabbed view
    return (
        <Tabs defaultValue={groupedFields[0]?.tabName} className="w-full">
            <TabsList>
                {groupedFields.map(group => (
                    <TabsTrigger key={group.tabName} value={group.tabName}>
                        {group.tabName === 'general' ? i18n.t('General') : group.tabName}
                    </TabsTrigger>
                ))}
            </TabsList>
            {groupedFields.map(group => (
                <TabsContent key={group.tabName} value={group.tabName} className="mt-4">
                    <div className="grid grid-cols-2 gap-4">
                        {group.customFields.map(fieldDef => (
                            <CustomFieldItem
                                key={fieldDef.name}
                                fieldDef={fieldDef}
                                control={control}
                                fieldName={getFieldName(fieldDef)}
                                getTranslation={getTranslation}
                            />
                        ))}
                    </div>
                </TabsContent>
            ))}
        </Tabs>
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
    const shouldBeFullWidth = fieldDef.ui?.fullWidth === true;
    const containerClassName = shouldBeFullWidth ? 'col-span-2' : '';

    // For locale fields, always use TranslatableFormField regardless of custom components
    if (isLocaleField) {
        return (
            <div className={containerClassName}>
                <TranslatableFormField
                    control={control}
                    name={fieldName}
                    render={({ field, ...props }) => (
                        <FormItem>
                            <FormLabel>{getTranslation(fieldDef.label) ?? field.name}</FormLabel>
                            <FormControl>
                                {hasCustomFormComponent ? (
                                    <CustomFormComponent
                                        fieldDef={fieldDef}
                                        fieldProps={{
                                            ...props,
                                            field: {
                                                ...field,
                                                disabled: fieldDef.readonly ?? false,
                                            },
                                        }}
                                    />
                                ) : (
                                    <FormInputForType fieldDef={fieldDef} field={field} />
                                )}
                            </FormControl>
                            <FormDescription>{getTranslation(fieldDef.description)}</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        );
    }

    // For non-locale fields with custom components
    if (hasCustomFormComponent) {
        return (
            <div className={containerClassName}>
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
            </div>
        );
    }

    // For regular fields without custom components
    return (
        <div className={containerClassName}>
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
        </div>
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
        case 'string': {
            // Check if the field has options (dropdown)
            const options = (fieldDef as StringCustomFieldConfig).options;
            if (options && options.length > 0) {
                return (
                    <SelectWithOptions
                        field={field}
                        options={options}
                        disabled={isReadonly}
                        nullable={fieldDef.nullable ?? true}
                    />
                );
            }
            return <Input {...field} disabled={isReadonly} />;
        }
        case 'float':
        case 'int': {
            const numericFieldDef = fieldDef as any;
            const isFloat = fieldDef.type === 'float';
            const min = isFloat ? numericFieldDef.floatMin : numericFieldDef.intMin;
            const max = isFloat ? numericFieldDef.floatMax : numericFieldDef.intMax;
            const step = isFloat ? numericFieldDef.floatStep : numericFieldDef.intStep;
            
            // Set min value as default if field is empty and min exists
            React.useEffect(() => {
                if (min !== undefined && (field.value === undefined || field.value === null || field.value === '')) {
                    field.onChange(min);
                }
            }, [field.value, min, field.onChange]);

            return (
                <Input
                    type="number"
                    value={field.value ?? ''}
                    onChange={e => {
                        const value = e.target.valueAsNumber;
                        field.onChange(isNaN(value) ? undefined : value);
                    }}
                    disabled={isReadonly}
                    min={min}
                    max={max}
                    step={step}
                />
            );
        }
        case 'boolean':
            return <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isReadonly} />;
        case 'datetime': {
            const datetimeFieldDef = fieldDef as any;
            const min = datetimeFieldDef.datetimeMin;
            const max = datetimeFieldDef.datetimeMax;
            const step = datetimeFieldDef.datetimeStep;
            
            // Set min value as default if field is empty and min exists
            React.useEffect(() => {
                if (min !== undefined && (field.value === undefined || field.value === null || field.value === '')) {
                    field.onChange(new Date(min));
                }
            }, [field.value, min, field.onChange]);
            
            if (isReadonly) {
                // For readonly datetime fields, display as formatted text
                const dateValue = field.value ? new Date(field.value).toLocaleString() : '';
                return <Input value={dateValue} disabled readOnly />;
            }
            
            return (
                <DateTimeInput
                    value={field.value}
                    onChange={(date) => {
                        // Validate against min/max constraints
                        let validatedDate = date;
                        if (min && date < new Date(min)) {
                            validatedDate = new Date(min);
                        }
                        if (max && date > new Date(max)) {
                            validatedDate = new Date(max);
                        }
                        field.onChange(validatedDate);
                    }}
                />
            );
        }
        case 'relation':
            if (fieldDef.list) {
                return (
                    <Input
                        {...field}
                        onChange={e => field.onChange(e.target.value.split(','))}
                        disabled={isReadonly}
                    />
                );
            } else {
                return <Input {...field} disabled={isReadonly} />;
            }
        default:
            return <Input {...field} disabled={isReadonly} />;
    }
}
