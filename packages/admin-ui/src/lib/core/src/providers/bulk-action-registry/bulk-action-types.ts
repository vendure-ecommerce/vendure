import { Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * @description
 * A valid location of a list view that supports the bulk actions API.
 *
 * @since 1.8.0
 * @docsCategory bulk-actions
 * @docsPage BulkAction
 */
export type BulkActionLocationId = 'product-list' | 'order-list' | string;

/**
 * @description
 * This is the argument which gets passed to the `onClick` function of a BulkAction.
 *
 * @since 1.8.0
 * @docsCategory bulk-actions
 * @docsPage BulkAction
 */
export interface BulkActionClickContext<T> {
    selection: T[];
    event: MouseEvent;
    route: ActivatedRoute;
    injector: Injector;
}

/**
 * @description
 * Configures a bulk action which can be performed on all selected items in a list view.
 *
 * For a full example, see the {@link registerBulkAction} docs.
 *
 * @since 1.8.0
 * @docsCategory bulk-actions
 * @docsPage BulkAction
 * @docsWeight 0
 */
export interface BulkAction<T = any> {
    location: BulkActionLocationId;
    label: string;
    icon?: string;
    iconClass?: string;
    onClick: (context: BulkActionClickContext<T>) => void;
    /**
     * Control the display of this item based on the user permissions.
     */
    requiresPermission?: string | ((userPermissions: string[]) => boolean);
}
