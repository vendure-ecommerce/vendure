import { CustomFieldListInput } from '@/vdb/components/data-input/custom-field-list-input.js';
import { DateTimeInput } from '@/vdb/components/data-input/datetime-input.js';
import { SelectWithOptions } from '@/vdb/components/data-input/select-with-options.js';
import { StructFormInput } from '@/vdb/components/data-input/struct-form-input.js';
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
import { CustomFormComponent } from '@/vdb/framework/form-engine/custom-form-component.js';
import { useCustomFieldConfig } from '@/vdb/hooks/use-custom-field-config.js';
import { useUserSettings } from '@/vdb/hooks/use-user-settings.js';
import { useLingui } from '@/vdb/lib/trans.js';
import { customFieldConfigFragment } from '@/vdb/providers/server-config.js';
import { StringCustomFieldConfig } from '@vendure/common/lib/generated-types';
import { CustomFieldType } from '@vendure/common/lib/shared-types';
import { ResultOf } from 'gql.tada';
import React, { useMemo } from 'react';
import { Control, ControllerRenderProps } from 'react-hook-form';
import { Switch } from '../ui/switch.js';
import { TranslatableFormField } from './translatable-form-field.js';

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
            <div className="grid @md:grid-cols-2 gap-6">
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
                    <div className="grid @md:grid-cols-2 gap-6">
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
    const isReadonly = fieldDef.readonly ?? false;

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

    // For struct fields, use the special struct component
    if (fieldDef.type === 'struct') {
        const isList = fieldDef.list ?? false;

        // Handle struct lists - entire struct objects in a list
        if (isList) {
            return (
                <div className={containerClassName}>
                    <FormField
                        control={control}
                        name={fieldName}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{getTranslation(fieldDef.label) ?? field.name}</FormLabel>
                                <FormControl>
                                    <CustomFieldListInput
                                        field={field}
                                        disabled={isReadonly}
                                        renderInput={(index, inputField) => (
                                            <StructFormInput
                                                field={inputField}
                                                fieldDef={fieldDef as any}
                                                control={control}
                                                getTranslation={getTranslation}
                                            />
                                        )}
                                        defaultValue={{}} // Empty struct object as default
                                        isFullWidth={true} // Structs should always be full-width
                                    />
                                </FormControl>
                                <FormDescription>{getTranslation(fieldDef.description)}</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            );
        }

        // Handle single struct fields
        return (
            <div className={containerClassName}>
                <FormField
                    control={control}
                    name={fieldName}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{getTranslation(fieldDef.label) ?? field.name}</FormLabel>
                            <FormControl>
                                <StructFormInput
                                    field={field}
                                    fieldDef={fieldDef as any}
                                    control={control}
                                    getTranslation={getTranslation}
                                />
                            </FormControl>
                            <FormDescription>{getTranslation(fieldDef.description)}</FormDescription>
                            <FormMessage />
                        </FormItem>
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
    const isList = fieldDef.list ?? false;

    // Helper function to render individual input components
    const renderSingleInput = (inputField: ControllerRenderProps<any, any>) => {
        switch (fieldDef.type as CustomFieldType) {
            case 'string': {
                return (
                    <Input
                        value={inputField.value ?? ''}
                        onChange={e => inputField.onChange(e.target.value)}
                        onBlur={inputField.onBlur}
                        name={inputField.name}
                        disabled={isReadonly}
                    />
                );
            }
            case 'float':
            case 'int': {
                const numericFieldDef = fieldDef as any;
                const isFloat = fieldDef.type === 'float';
                const min = isFloat ? numericFieldDef.floatMin : numericFieldDef.intMin;
                const max = isFloat ? numericFieldDef.floatMax : numericFieldDef.intMax;
                const step = isFloat ? numericFieldDef.floatStep : numericFieldDef.intStep;

                return (
                    <Input
                        type="number"
                        value={inputField.value ?? ''}
                        onChange={e => {
                            const value = e.target.valueAsNumber;
                            inputField.onChange(isNaN(value) ? undefined : value);
                        }}
                        onBlur={inputField.onBlur}
                        name={inputField.name}
                        disabled={isReadonly}
                        min={min}
                        max={max}
                        step={step}
                    />
                );
            }
            case 'boolean':
                return (
                    <Switch
                        checked={inputField.value}
                        onCheckedChange={inputField.onChange}
                        disabled={isReadonly}
                    />
                );
            case 'datetime': {
                return (
                    <DateTimeInput
                        value={inputField.value}
                        onChange={inputField.onChange}
                        disabled={isReadonly}
                    />
                );
            }
            case 'relation':
                return (
                    <Input
                        value={inputField.value ?? ''}
                        onChange={e => inputField.onChange(e.target.value)}
                        onBlur={inputField.onBlur}
                        name={inputField.name}
                        disabled={isReadonly}
                    />
                );
            case 'struct':
                // Struct fields need special handling and can't be rendered as simple inputs
                return null;
            default:
                return (
                    <Input
                        value={inputField.value ?? ''}
                        onChange={e => inputField.onChange(e.target.value)}
                        onBlur={inputField.onBlur}
                        name={inputField.name}
                        disabled={isReadonly}
                    />
                );
        }
    };

    // Handle struct fields with special component
    if (fieldDef.type === 'struct') {
        // We need access to the control and getTranslation function
        // This will need to be passed down from the parent component
        return null; // Placeholder - struct fields are handled differently in the parent
    }

    // Handle string fields with options (dropdown) - already handles list case with multi-select
    if (fieldDef.type === 'string') {
        const options = (fieldDef as StringCustomFieldConfig).options;
        if (options && options.length > 0) {
            return (
                <SelectWithOptions
                    field={field}
                    options={options}
                    disabled={isReadonly}
                    nullable={fieldDef.nullable ?? true}
                    isListField={isList}
                />
            );
        }
    }

    // For list fields (except string with options which is handled above), wrap with list input
    if (isList) {
        const getDefaultValue = () => {
            switch (fieldDef.type as CustomFieldType) {
                case 'string':
                    return '';
                case 'int':
                case 'float':
                    return 0;
                case 'boolean':
                    return false;
                case 'datetime':
                    return '';
                default:
                    return '';
            }
        };

        return (
            <CustomFieldListInput
                field={field}
                disabled={isReadonly}
                renderInput={(index, inputField) => renderSingleInput(inputField)}
                defaultValue={getDefaultValue()}
            />
        );
    }

    // For non-list fields, render directly
    return renderSingleInput(field);
}
