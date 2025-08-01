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
    /**
     * @description
     * A unique identifier for the custom form component.
     */
    id: string;
    /**
     * @description
     * The React component that will be rendered as the custom form input.
     */
    component: React.FunctionComponent<CustomFormComponentInputProps>;
}

/**
 * @description
 * Interface for registering custom field components in the dashboard.
 * For input and display components, use the co-located approach with detailForms.
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
}
