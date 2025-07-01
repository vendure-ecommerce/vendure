import { DocumentNode } from 'graphql';

import { BulkAction } from '../../data-table/data-table-types.js';

/**
 * @description
 * Allows you to define custom display components for specific columns in data tables.
 * The pageId is already defined in the data table extension, so only the column name is needed.
 *
 * @docsCategory extensions
 * @since 3.4.0
 */
export interface DashboardDataTableDisplayComponent {
    /**
     * @description
     * The name of the column where this display component should be used.
     */
    column: string;
    /**
     * @description
     * The React component that will be rendered as the display.
     * It should accept `value` and other standard display props.
     */
    component: React.ComponentType<{ value: any; [key: string]: any }>;
}

/**
 * @description
 * **Status: Developer Preview**
 *
 * This allows you to customize aspects of existing data tables in the dashboard.
 *
 * @docsCategory extensions
 * @since 3.4.0
 */
export interface DashboardDataTableExtensionDefinition {
    /**
     * @description
     * The ID of the page where the data table is located, e.g. `'product-list'`, `'order-list'`.
     */
    pageId: string;
    /**
     * @description
     * The ID of the data table block. Defaults to `'list-table'`, which is the default blockId
     * for the standard list pages. However, some other pages may use a different blockId,
     * such as `'product-variants-table'` on the `'product-detail'` page.
     */
    blockId?: string;
    /**
     * @description
     * An array of additional bulk actions that will be available on the data table.
     */
    bulkActions?: BulkAction[];
    /**
     * @description
     * Allows you to extend the list document for the data table.
     */
    extendListDocument?: string | DocumentNode | (() => DocumentNode | string);
    /**
     * @description
     * Custom display components for specific columns in the data table.
     */
    displayComponents?: DashboardDataTableDisplayComponent[];
}
