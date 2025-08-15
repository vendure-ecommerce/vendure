import { DashboardFormComponent } from '@/vdb/framework/form-engine/form-engine-types.js';
import { globalRegistry } from '../registry/global-registry.js';

globalRegistry.register('inputComponents', new Map<string, DashboardFormComponent>());

// Register built-in input components
const inputComponents = globalRegistry.get('inputComponents');
// inputComponents.set('vendure:money-input', MoneyInput);
// inputComponents.set('vendure:text-input', TextInput);
// inputComponents.set('vendure:number-input', NumberInput);
// inputComponents.set('vendure:number-form-input', NumberInput);
// inputComponents.set('vendure:date-time-input', DateTimeInput);
// inputComponents.set('vendure:date-form-input', DateTimeInput);
// inputComponents.set('vendure:checkbox-input', CheckboxInput);
// inputComponents.set('vendure:facet-value-input', FacetValueInput);
// inputComponents.set('vendure:combination-mode-input', CombinationModeInput);
// inputComponents.set('vendure:product-multi-input', ProductMultiInput);
// inputComponents.set('vendure:boolean-form-input', BooleanInput);
// inputComponents.set('vendure:currency-form-input', MoneyInput);
// inputComponents.set('vendure:customer-group-form-input', CustomerGroupInput);
// inputComponents.set('vendure:facet-value-form-input', FacetValueInput);
// inputComponents.set('vendure:json-editor-form-input', TextareaInput);
// inputComponents.set('vendure:textarea-form-input', TextareaInput);
// inputComponents.set('vendure:html-editor-form-input', RichTextInput);
// inputComponents.set('vendure:rich-text-form-input', RichTextInput);
// inputComponents.set('vendure:password-form-input', PasswordInput);
// inputComponents.set('vendure:product-selector-form-input', DefaultRelationInput);
// inputComponents.set('vendure:relation-form-input', DefaultRelationInput);
// inputComponents.set('vendure:select-form-input', SelectWithOptions);
// inputComponents.set('vendure:product-multi-form-input', ProductMultiInput);
// inputComponents.set('vendure:combination-mode-form-input', CombinationModeInput);

export function getInputComponent(id: string): DashboardFormComponent | undefined {
    const inputComponent = globalRegistry.get('inputComponents').get(id);
    return inputComponent;
}

/**
 * @description
 * Generates a component key based on the targeting properties.
 * Follows the existing pattern: pageId_blockId_fieldName
 */
export function generateInputComponentKey(pageId: string, blockId: string, field: string): string {
    return `${pageId}_${blockId}_${field}`;
}

export function addInputComponent({
    pageId,
    blockId,
    field,
    component,
}: {
    pageId: string;
    blockId: string;
    field: string;
    component: DashboardFormComponent;
}) {
    const inputComponents = globalRegistry.get('inputComponents');

    // Generate the key using the helper function
    const key = generateInputComponentKey(pageId, blockId, field);

    if (inputComponents.has(key)) {
        // eslint-disable-next-line no-console
        console.warn(`Input component with key "${key}" is already registered and will be overwritten.`);
    }
    inputComponents.set(key, component);
}

export function addCustomFieldInputComponent({
    id,
    component,
}: {
    id: string;
    component: DashboardFormComponent;
}) {
    const inputComponents = globalRegistry.get('inputComponents');

    if (inputComponents.has(id)) {
        // eslint-disable-next-line no-console
        console.warn(`Input component with key "${id}" is already registered and will be overwritten.`);
    }
    inputComponents.set(id, component);
}
