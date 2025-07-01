import { DocumentNode } from 'graphql';

import { BulkAction } from '../../data-table/data-table-types.js';

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
}
