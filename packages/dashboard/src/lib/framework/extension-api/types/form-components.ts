import type React from 'react';

import { CustomFormComponentInputProps } from '../../form-engine/custom-form-component.js';

/**
 * @description
 * Allows you to define custom form components for custom fields in the dashboard.
 *
 * @docsCategory extensions
 * @since 3.4.0
 */
export interface DashboardCustomFormComponent {
    id: string;
    component: React.FunctionComponent<CustomFormComponentInputProps>;
}

/**
 * @description
 * Allows you to define custom input components that can be used in detail forms
 * and other places in the dashboard where input components are rendered.
 *
 * @docsCategory extensions
 * @since 3.4.0
 */
export interface DashboardInputComponent {
    /**
     * @description
     * The ID of the page where this input component should be used.
     */
    pageId: string;
    /**
     * @description
     * The ID of the block where this input component should be used.
     */
    blockId: string;
    /**
     * @description
     * The name of the field where this input component should be used.
     */
    field: string;
    /**
     * @description
     * The React component that will be rendered as the input.
     * It should accept `value`, `onChange`, and other standard input props.
     */
    component: React.ComponentType<{ value: any; onChange: (value: any) => void; [key: string]: any }>;
}

/**
 * @description
 * Allows you to define custom display components that can be used to render
 * data in forms, tables, detail views, and other places in the dashboard.
 *
 * @docsCategory extensions
 * @since 3.4.0
 */
export interface DashboardDisplayComponent {
    /**
     * @description
     * The ID of the page where this display component should be used.
     */
    pageId: string;
    /**
     * @description
     * The ID of the block where this display component should be used.
     */
    blockId: string;
    /**
     * @description
     * The name of the field where this display component should be used.
     */
    field: string;
    /**
     * @description
     * The React component that will be rendered as the display.
     * It should accept `value` and other standard display props.
     */
    component: React.ComponentType<{ value: any; [key: string]: any }>;
}

/**
 * @description
 * Unified interface for registering custom form components in the dashboard.
 * This includes custom field components, input components, and display components.
 *
 * @docsCategory extensions
 * @since 3.4.0
 */
export interface DashboardCustomFormComponents {
    /**
     * @description
     * Custom form components for custom fields. These are used when rendering
     * custom fields in forms.
     */
    customFields?: DashboardCustomFormComponent[];
    /**
     * @description
     * Custom input components that can be used in detail forms and other places
     * where input components are rendered.
     */
    inputs?: DashboardInputComponent[];
    /**
     * @description
     * Custom display components that can be used in forms and other places
     * where display components are rendered.
     */
    displays?: DashboardDisplayComponent[];
}
