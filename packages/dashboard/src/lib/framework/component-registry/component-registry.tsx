import {
    DashboardFormComponent,
    DashboardFormComponentProps,
} from '@/vdb/framework/form-engine/form-engine-types.js';
import * as React from 'react';
import { getDisplayComponent } from '../extension-api/display-component-extensions.js';
import { getInputComponent } from '../extension-api/input-component-extensions.js';

export interface ComponentRegistryEntry<Props extends Record<string, any>> {
    component: React.ComponentType<Props>;
}

// Display component interface (unchanged)
export interface DataDisplayComponentProps {
    value: any;

    [key: string]: any;
}

export type DataDisplayComponent = React.ComponentType<DataDisplayComponentProps>;
export type { DashboardFormComponentProps as DataInputComponentProps };

// Component registry hook that uses the global registry
export function useComponentRegistry() {
    return {
        getDisplayComponent: (id: string): DataDisplayComponent | undefined => {
            return getDisplayComponent(id);
        },
        getInputComponent: (id: string): DashboardFormComponent | undefined => {
            return getInputComponent(id);
        },
    };
}
