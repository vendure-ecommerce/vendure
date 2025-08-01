import {
    DataDisplayComponent,
    DataInputComponent,
} from '@/vdb/framework/component-registry/component-registry.js';
import { DocumentNode } from 'graphql';

/**
 * @description
 * Allows you to define custom input components for specific fields in detail forms.
 * The pageId is already defined in the detail form extension, so only the blockId and field are needed.
 *
 * @docsCategory extensions
 * @since 3.4.0
 */
export interface DashboardDetailFormInputComponent {
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
    component: DataInputComponent;
}

/**
 * @description
 * Allows you to define custom display components for specific fields in detail forms.
 * The pageId is already defined in the detail form extension, so only the blockId and field are needed.
 *
 * @docsCategory extensions
 * @since 3.4.0
 */
export interface DashboardDetailFormDisplayComponent {
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
    component: DataDisplayComponent;
}

export interface DashboardDetailFormExtensionDefinition {
    /**
     * @description
     * The ID of the page where the detail form is located, e.g. `'product-detail'`, `'order-detail'`.
     */
    pageId: string;
    /**
     * @description
     * Extends the GraphQL query used to fetch data for the detail page, allowing you to add additional fields that can be used by custom input or display components.
     */
    extendDetailDocument?: string | DocumentNode | (() => DocumentNode | string);
    /**
     * @description
     * Custom input components for specific fields in the detail form.
     */
    inputs?: DashboardDetailFormInputComponent[];
    /**
     * @description
     * Custom display components for specific fields in the detail form.
     */
    displays?: DashboardDetailFormDisplayComponent[];
}
