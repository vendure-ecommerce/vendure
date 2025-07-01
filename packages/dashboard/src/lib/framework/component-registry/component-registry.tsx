import * as React from 'react';
import { addDisplayComponent, getDisplayComponent } from '../extension-api/display-component-extensions.js';
import { addInputComponent, getInputComponent } from '../extension-api/input-component-extensions.js';

export interface ComponentRegistryEntry<Props extends Record<string, any>> {
    component: React.ComponentType<Props>;
}

// Basic component types

export interface DataDisplayComponentProps {
    value: any;
    [key: string]: any;
}

export interface DataInputComponentProps {
    value: any;
    onChange: (value: any) => void;
    [key: string]: any;
}

export type DataDisplayComponent = React.ComponentType<DataDisplayComponentProps>;
export type DataInputComponent = React.ComponentType<DataInputComponentProps>;

// Component registry hook that uses the global registry
export function useComponentRegistry() {
    return {
        getDisplayComponent: (id: string): DataDisplayComponent | undefined => {
            return getDisplayComponent(id);
        },
        getInputComponent: (id: string): DataInputComponent | undefined => {
            return getInputComponent(id);
        },
    };
}

// Legacy registration functions - these now delegate to the global registry
export function registerInputComponent(id: string, component: DataInputComponent) {
    addInputComponent({ id, component });
}

export function registerDisplayComponent(id: string, component: DataDisplayComponent) {
    addDisplayComponent({ id, component });
}
