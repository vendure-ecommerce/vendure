import { CombinationModeInput } from '@/vdb/components/data-input/combination-mode-input.js';
import { DateTimeInput } from '@/vdb/components/data-input/datetime-input.js';
import { FacetValueInput } from '@/vdb/components/data-input/facet-value-input.js';
import { MoneyInput } from '@/vdb/components/data-input/money-input.js';
import { ProductMultiInput } from '@/vdb/components/data-input/product-multi-selector.js';
import { Checkbox } from '@/vdb/components/ui/checkbox.js';
import { Input } from '@/vdb/components/ui/input.js';
import { DataInputComponent } from '../component-registry/component-registry.js';
import { globalRegistry } from '../registry/global-registry.js';

globalRegistry.register('inputComponents', new Map<string, DataInputComponent>());

// Create component functions for built-in components
const TextInput: DataInputComponent = props => (
    <Input {...props} onChange={e => props.onChange(e.target.value)} />
);
const NumberInput: DataInputComponent = props => (
    <Input {...props} onChange={e => props.onChange(e.target.valueAsNumber)} type="number" />
);
const CheckboxInput: DataInputComponent = props => (
    <Checkbox
        {...props}
        checked={props.value === 'true' || props.value === true}
        onCheckedChange={value => props.onChange(value)}
    />
);

// Register built-in input components
const inputComponents = globalRegistry.get('inputComponents');
inputComponents.set('vendure:moneyInput', MoneyInput);
inputComponents.set('vendure:textInput', TextInput);
inputComponents.set('vendure:numberInput', NumberInput);
inputComponents.set('vendure:dateTimeInput', DateTimeInput);
inputComponents.set('vendure:checkboxInput', CheckboxInput);
inputComponents.set('vendure:facetValueInput', FacetValueInput);
inputComponents.set('vendure:combinationModeInput', CombinationModeInput);
inputComponents.set('vendure:productMultiInput', ProductMultiInput);

export function getInputComponent(id: string): DataInputComponent | undefined {
    return globalRegistry.get('inputComponents').get(id);
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
    component: DataInputComponent;
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
