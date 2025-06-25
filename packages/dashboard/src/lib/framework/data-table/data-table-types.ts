import { Table } from '@tanstack/react-table';

export type BulkActionContext<Item extends { id: string } & Record<string, any>> = {
    selection: Item[];
    table: Table<Item>;
};

export type BulkActionComponent<Item extends { id: string } & Record<string, any>> = React.FunctionComponent<
    BulkActionContext<Item>
>;

/**
 * @description
 * **Status: Developer Preview**
 *
 * A bulk action is a component that will be rendered in the bulk actions dropdown.
 *
 * @docsCategory components
 * @docsPage DataTableBulkActions
 * @since 3.4.0
 */
export type BulkAction = {
    order?: number;
    component: BulkActionComponent<any>;
    requiresPermission?: string | string[];
};
