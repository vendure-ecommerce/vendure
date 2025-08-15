import { BooleanInput } from '@/vdb/components/data-input/boolean-input.js';
import { DefaultRelationInput } from '@/vdb/components/data-input/default-relation-input.js';
import { DateTimeInput, SelectWithOptions } from '@/vdb/components/data-input/index.js';
import { NumberInput } from '@/vdb/components/data-input/number-input.js';
import { TextInput } from '@/vdb/components/data-input/text-input.js'; // Component renderer interface for cleaner separation
import { DashboardFormComponentProps } from '@/vdb/framework/form-engine/form-engine-types.js';
import { isStringFieldWithOptions } from '@/vdb/framework/form-engine/utils.js';
//
// // Component renderer interface for cleaner separation
// interface ComponentRendererProps {
//     fieldDef: UniversalFieldDefinition;
//     field: ControllerRenderProps<any, any>;
//     valueMode: ValueMode;
//     isReadonly: boolean;
//     transformedValue: any;
//     handleChange: (value: any) => void;
//     handleNumericChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//     handleRegularNumericChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//     handleTextareaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
//     handleTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
// }
//
// /**
//  * Renders relation input component
//  */
// function renderRelationInput({
//     fieldDef,
//     field,
//     transformedValue,
//     handleChange,
//     isReadonly,
// }: ComponentRendererProps) {
//     if (fieldDef.type !== 'relation' || !fieldDef.entity) return null;
//
//     return (
//         <DefaultRelationInput
//             fieldDef={
//                 {
//                     entity: fieldDef.entity,
//                     list: fieldDef.list,
//                 } as any
//             }
//             field={{
//                 ...field,
//                 value: transformedValue,
//                 onChange: handleChange,
//             }}
//             disabled={isReadonly}
//         />
//     );
// }
//
// /**
//  * Renders string field with options as select dropdown
//  */
// function renderSelectInput({
//     fieldDef,
//     valueMode,
//     transformedValue,
//     handleChange,
//     isReadonly,
//     field,
// }: ComponentRendererProps) {
//     if (fieldDef.type !== 'string' || !fieldDef.ui?.options) return null;
//
//     if (valueMode === 'json-string') {
//         return (
//             <Select value={transformedValue || ''} onValueChange={handleChange} disabled={isReadonly}>
//                 <SelectTrigger className="bg-background mb-0">
//                     <SelectValue placeholder="Select an option..." />
//                 </SelectTrigger>
//                 <SelectContent>
//                     {fieldDef.ui.options.map(option => (
//                         <SelectItem key={option.value} value={option.value}>
//                             {typeof option.label === 'string'
//                                 ? option.label
//                                 : Array.isArray(option.label)
//                                   ? option.label[0]?.value || option.value
//                                   : option.value}
//                         </SelectItem>
//                     ))}
//                 </SelectContent>
//             </Select>
//         );
//     }
//
//     return (
//         <SelectWithOptions
//             field={{
//                 ...field,
//                 value: transformedValue,
//                 onChange: handleChange,
//             }}
//             options={fieldDef.ui.options as any}
//             disabled={isReadonly}
//             isListField={fieldDef.list}
//         />
//     );
// }
//
// /**
//  * Renders numeric input components (int/float)
//  */
//
// /**
//  * Renders boolean input as switch
//  */
// function renderBooleanInput({
//     fieldDef,
//     valueMode,
//     transformedValue,
//     handleChange,
//     isReadonly,
// }: ComponentRendererProps) {
//     if (fieldDef.type !== 'boolean') return null;
//
//     const boolValue =
//         valueMode === 'json-string'
//             ? transformedValue === true || transformedValue === 'true'
//             : transformedValue;
//
//     return <Switch checked={boolValue} onCheckedChange={handleChange} disabled={isReadonly} />;
// }
//
// /**
//  * Renders datetime input
//  */
// function renderDateTimeInput({
//     fieldDef,
//     transformedValue,
//     handleChange,
//     isReadonly,
// }: ComponentRendererProps) {
//     if (fieldDef.type !== 'datetime') return null;
//
//     return <DateTimeInput value={transformedValue} onChange={handleChange} disabled={isReadonly} />;
// }
//
// /**
//  * Renders textarea for specific config args
//  */
// function renderTextareaInput({
//     fieldDef,
//     valueMode,
//     transformedValue,
//     handleTextareaChange,
//     isReadonly,
// }: ComponentRendererProps) {
//     if (valueMode !== 'json-string' || fieldDef.ui?.component !== 'textarea-form-input') return null;
//
//     return (
//         <Textarea
//             value={transformedValue || ''}
//             onChange={handleTextareaChange}
//             disabled={isReadonly}
//             spellCheck={fieldDef.ui?.spellcheck ?? true}
//             placeholder="Enter text..."
//             rows={4}
//             className="bg-background"
//         />
//     );
// }
//
// /**
//  * Renders default text input
//  */
// function renderTextInput({
//     valueMode,
//     transformedValue,
//     handleTextChange,
//     isReadonly,
//     field,
// }: ComponentRendererProps) {
//     return (
//         <Input
//             type="text"
//             value={transformedValue ?? ''}
//             onChange={handleTextChange}
//             onBlur={field.onBlur}
//             name={field.name}
//             disabled={isReadonly}
//             placeholder={valueMode === 'json-string' ? 'Enter value...' : undefined}
//             className={valueMode === 'json-string' ? 'bg-background' : undefined}
//         />
//     );
// }

/**
 * Consolidated input component for rendering form inputs based on field type
 * This replaces the duplicate implementations in custom fields and config args
 */
export function DefaultInputForType({ fieldDef, ...fieldProps }: Readonly<DashboardFormComponentProps>) {
    const type = fieldDef && fieldDef.type;
    switch (type) {
        case 'int':
        case 'float':
            return <NumberInput {...fieldProps} fieldDef={fieldDef} />;
        case 'boolean':
            return <BooleanInput {...fieldProps} fieldDef={fieldDef} />;
        case 'datetime':
            return <DateTimeInput {...fieldProps} fieldDef={fieldDef} />;
        case 'relation':
            return <DefaultRelationInput {...fieldProps} fieldDef={fieldDef} />;
        case 'string': {
            if (fieldDef && isStringFieldWithOptions(fieldDef)) {
                return <SelectWithOptions {...fieldProps} fieldDef={fieldDef} />;
            } else {
                return <TextInput {...fieldProps} fieldDef={fieldDef} />;
            }
        }
        default:
            return <TextInput {...fieldProps} fieldDef={fieldDef} />;
    }
}
