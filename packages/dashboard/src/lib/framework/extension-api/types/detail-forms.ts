import { DocumentNode } from 'graphql';

export interface DashboardDetailFormExtensionDefinition {
    /**
     * @description
     * The ID of the page where the detail form is located, e.g. `'product-detail'`, `'order-detail'`.
     */
    pageId: string;
    /**
     * @description
     */
    extendDetailDocument?: string | DocumentNode | (() => DocumentNode | string);
}
