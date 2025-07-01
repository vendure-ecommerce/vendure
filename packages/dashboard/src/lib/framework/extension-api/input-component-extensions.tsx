import { DateTimeInput } from '@/components/data-input/datetime-input.js';
import { FacetValueInput } from '@/components/data-input/facet-value-input.js';
import { MoneyInput } from '@/components/data-input/money-input.js';
import { Checkbox } from '@/components/ui/checkbox.js';
import { Input } from '@/components/ui/input.js';
import { DataInputComponent } from '../component-registry/component-registry.js';
import { globalRegistry } from '../registry/global-registry.js';
import { DashboardInputComponent } from './extension-api-types.js';

globalRegistry.register('inputComponents', new Map<string, DataInputComponent>());

// Create component functions for built-in components
const TextInput: DataInputComponent = props => (
    <Input {...props} onChange={e => props.onChange(e.target.value)} />
);
const NumberInput: DataInputComponent = props => (
    <Input {...props} onChange={e => props.onChange(e.target.value)} type="number" />
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

export function getInputComponent(id: string): DataInputComponent | undefined {
    return globalRegistry.get('inputComponents').get(id);
}

export function addInputComponent({ id, component }: DashboardInputComponent) {
    const inputComponents = globalRegistry.get('inputComponents');
    if (inputComponents.has(id)) {
        // eslint-disable-next-line no-console
        console.warn(`Input component with id "${id}" is already registered and will be overwritten.`);
    }
    inputComponents.set(id, component);
}
