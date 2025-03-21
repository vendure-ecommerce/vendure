import { BooleanDisplayCheckbox } from '@/components/data-display/boolean.js';
import { DateTime } from '@/components/data-display/date-time.js';
import { Money } from '@/components/data-display/money.js';
import { DateTimeInput } from '@/components/data-input/datetime-input.js';
import { FacetValueInput } from '@/components/data-input/facet-value-input.js';
import { MoneyInput } from '@/components/data-input/money-input.js';
import { AssetLike, VendureImage } from '@/components/shared/vendure-image.js';
import { Checkbox } from '@/components/ui/checkbox.js';
import { Input } from '@/components/ui/input.js';
import * as React from 'react';

export interface ComponentRegistryEntry<Props extends Record<string, any>> {
    component: React.ComponentType<Props>;
}

// Basic component types
export type DataDisplayComponent = React.ComponentType<{ value: any; [key: string]: any }>;
export type DataInputComponent = React.ComponentType<{ value: any; onChange: (value: any) => void; [key: string]: any }>;

// Simple component registry
interface ComponentRegistry {
    dataDisplay: Record<string, DataDisplayComponent>;
    dataInput: Record<string, DataInputComponent>;
}

export const COMPONENT_REGISTRY: ComponentRegistry = {
    dataDisplay: {
        'vendure:boolean': BooleanDisplayCheckbox,
        'vendure:dateTime': DateTime,
        'vendure:asset': ({value}) => <VendureImage asset={value} preset="tiny" />,
        'vendure:money': Money,
    },
    dataInput: {
        'vendure:moneyInput': MoneyInput,
        'vendure:textInput': (props) => <Input {...props} onChange={e => props.onChange(e.target.value)} />,
        'vendure:numberInput': (props) => <Input {...props} onChange={e => props.onChange(e.target.value)} type="number" />,
        'vendure:dateTimeInput': DateTimeInput,
        'vendure:checkboxInput': (props) => <Checkbox {...props} checked={props.value === 'true' || props.value === true}  onCheckedChange={value => props.onChange(value)} />,
        'vendure:facetValueInput': FacetValueInput,
    }
};

// Simplified implementation - replace with actual implementation
export function useComponentRegistry() {
    return {
        getDisplayComponent: (id: string): DataDisplayComponent | undefined => {
            // This is a placeholder implementation
            return COMPONENT_REGISTRY.dataDisplay[id];
        },
        getInputComponent: (id: string): DataInputComponent | undefined => {
            // This is a placeholder implementation
            return COMPONENT_REGISTRY.dataInput[id];
        },
    };
}

export function registerInputComponent(id: string,  component: DataInputComponent) {
    if (COMPONENT_REGISTRY.dataInput[id]) {
        throw new Error(`Input component with id ${id} already registered`);
    }
    COMPONENT_REGISTRY.dataInput[id] = component;
}

export function registerDisplayComponent(id: string, component: DataDisplayComponent) {
    if (COMPONENT_REGISTRY.dataDisplay[id]) {
        throw new Error(`Display component with id ${id} already registered`);
    }
    COMPONENT_REGISTRY.dataDisplay[id] = component;
}
