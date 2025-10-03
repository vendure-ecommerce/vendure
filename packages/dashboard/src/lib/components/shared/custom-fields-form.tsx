import { CustomFieldListInput } from '@/vdb/components/data-input/custom-field-list-input.js';
import { StructFormInput } from '@/vdb/components/data-input/struct-form-input.js';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/vdb/components/ui/form.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/vdb/components/ui/tabs.js';
import { CustomFormComponent } from '@/vdb/framework/form-engine/custom-form-component.js';
import { useCustomFieldConfig } from '@/vdb/hooks/use-custom-field-config.js';
import { useUserSettings } from '@/vdb/hooks/use-user-settings.js';
import { useLingui } from '@/vdb/lib/trans.js';
import { customFieldConfigFragment } from '@/vdb/providers/server-config.js';
import { ResultOf } from 'gql.tada';
import React, { useMemo } from 'react';
import { Control } from 'react-hook-form';
import { FormControlAdapter } from '../../framework/form-engine/form-control-adapter.js';
import { TranslatableFormField } from './translatable-form-field.js';

type CustomFieldConfig = ResultOf<typeof customFieldConfigFragment>;

interface CustomFieldsFormProps {
    entityType: string;
    control: Control<any, any>;
    formPathPrefix?: string;
}

export function CustomFieldsForm({ entityType, control, formPathPrefix }: Readonly<CustomFieldsFormProps>) {
    const { i18n } = useLingui();
    const customFields = useCustomFieldConfig(entityType);

    const getCustomFieldBaseName = (fieldDef: CustomFieldConfig) => {
        if (fieldDef.type !== 'relation') {
            return fieldDef.name;
        }
        return fieldDef.list ? fieldDef.name + 'Ids' : fieldDef.name + 'Id';
    };

    const getFieldName = (fieldDef: CustomFieldConfig) => {
        const name = getCustomFieldBaseName(fieldDef);
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
}

function CustomFieldItem({ fieldDef, control, fieldName }: Readonly<CustomFieldItemProps>) {
    const {
        settings: { displayLanguage },
    } = useUserSettings();

    const getTranslation = (input: Array<{ languageCode: string; value: string }> | null | undefined) => {
        return input?.find(t => t.languageCode === displayLanguage)?.value;
    };
    const hasCustomFormComponent = fieldDef.ui?.component;
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
                                        {...field}
                                    />
                                ) : (
                                    <FormControlAdapter
                                        fieldDef={fieldDef}
                                        field={field}
                                        valueMode="native"
                                    />
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
                                {...fieldProps.field}
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
                                <FormLabel>{getTranslation(fieldDef.label) ?? fieldDef.name}</FormLabel>
                                <FormControl>
                                    <CustomFieldListInput
                                        {...field}
                                        disabled={isReadonly}
                                        renderInput={(index, inputField) => (
                                            <StructFormInput
                                                {...inputField}
                                                fieldDef={fieldDef}
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
                            <FormLabel>{getTranslation(fieldDef.label) ?? fieldDef.name}</FormLabel>
                            <FormControl>
                                <StructFormInput
                                    {...field}
                                    fieldDef={fieldDef}
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
                        fieldName={fieldDef.name}
                    >
                        <FormControlAdapter
                            fieldDef={fieldDef}
                            field={field}
                            valueMode="native"
                        />
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

function CustomFieldFormItem({
    fieldDef,
    getTranslation,
    fieldName,
    children,
}: Readonly<CustomFieldFormItemProps>) {
    return (
        <FormItem>
            <FormLabel>{getTranslation(fieldDef.label) ?? fieldName}</FormLabel>
            <FormControl>{children}</FormControl>
            <FormDescription>{getTranslation(fieldDef.description)}</FormDescription>
            <FormMessage />
        </FormItem>
    );
}
