import { configurableOperationDefFragment } from '@/vdb/graphql/fragments.js';
import {
    allCustomFieldsFragment,
    booleanCustomFieldFragment,
    customFieldConfigFragment,
    dateTimeCustomFieldFragment,
    floatCustomFieldFragment,
    intCustomFieldFragment,
    localeStringCustomFieldFragment,
    localeTextCustomFieldFragment,
    relationCustomFieldFragment,
    stringCustomFieldFragment,
    structCustomFieldFragment,
    textCustomFieldFragment,
} from '@/vdb/providers/server-config.js';
import { ResultOf } from 'gql.tada';
import React from 'react';
import { ControllerRenderProps, FieldPath, FieldValues } from 'react-hook-form';

// Base custom field config
export type CustomFieldConfig = ResultOf<typeof customFieldConfigFragment>;

// Individual custom field type configurations
export type StringCustomFieldConfig = ResultOf<typeof stringCustomFieldFragment>;
export type LocaleStringCustomFieldConfig = ResultOf<typeof localeStringCustomFieldFragment>;
export type TextCustomFieldConfig = ResultOf<typeof textCustomFieldFragment>;
export type LocaleTextCustomFieldConfig = ResultOf<typeof localeTextCustomFieldFragment>;
export type BooleanCustomFieldConfig = ResultOf<typeof booleanCustomFieldFragment>;
export type IntCustomFieldConfig = ResultOf<typeof intCustomFieldFragment>;
export type FloatCustomFieldConfig = ResultOf<typeof floatCustomFieldFragment>;
export type DateTimeCustomFieldConfig = ResultOf<typeof dateTimeCustomFieldFragment>;
export type RelationCustomFieldConfig = ResultOf<typeof relationCustomFieldFragment>;
export type StructCustomFieldConfig = ResultOf<typeof structCustomFieldFragment>;

// Union type of all custom field configs
export type AllCustomFieldConfigs = ResultOf<typeof allCustomFieldsFragment>;

// Configurable operation argument definition
export type ConfigurableArgDef = ResultOf<typeof configurableOperationDefFragment>['args'][number];

// Union type for all field definitions
export type ConfigurableFieldDef = AllCustomFieldConfigs | ConfigurableArgDef;

// Struct field types (used within struct custom fields)
export type StructField = StructCustomFieldConfig['fields'][number];

// Individual struct field type configurations (for type guards)
export type StringStructField = Extract<StructField, { type: 'string' }>;
export type IntStructField = Extract<StructField, { type: 'int' }>;
export type FloatStructField = Extract<StructField, { type: 'float' }>;
export type BooleanStructField = Extract<StructField, { type: 'boolean' }>;
export type DateTimeStructField = Extract<StructField, { type: 'datetime' }>;

/**
 * THE single form component interface for the entire dashboard.
 * This replaces all the fragmented interfaces:
 * - DataInputComponent
 * - CustomFormComponentInputProps
 * - DirectFormComponentProps
 * - etc.
 */
export type DashboardFormComponentProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = ControllerRenderProps<TFieldValues, TName> & {
    fieldDef?: ConfigurableFieldDef;
};

/**
 * @description
 * Metadata which can be defined on a {@link DashboardFormComponent} which
 * provides additional information about how the dashboard should render the
 * component.
 */
export type DashboardFormComponentMetadata = {
    isListInput?: boolean;
    isFullWidth?: boolean;
};

/**
 * THE single form component type for the entire dashboard
 */
export type DashboardFormComponent = React.ComponentType<DashboardFormComponentProps> & {
    metadata?: DashboardFormComponentMetadata;
};
