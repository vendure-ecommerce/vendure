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
export interface BulkActionClickContext<ItemType, ComponentType> {
    /**
     * @description
     * An array of the selected items from the list.
     */
    selection: ItemType[];
    /**
     * @description
     * The component instance that is hosting the list view. For instance,
     * `ProductListComponent`. This can be used to call methods on the instance,
     * e.g. calling `hostComponent.refresh()` to force a list refresh after
     * deleting the selected items.
     */
    hostComponent: ComponentType;
    /**
     * @description
     * The Angular [Injector](https://angular.io/api/core/Injector) which can be used
     * to get service instances which might be needed in the click handler.
     */
    injector: Injector;
    /**
     * @description
     * Clears the selection in the active list view.
     */
    clearSelection: () => void;
    event: MouseEvent;
    route: ActivatedRoute;
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
export interface BulkAction<ItemType = any, ComponentType = any> {
    location: BulkActionLocationId;
    label: string;
    icon?: string;
    iconClass?: string;
    onClick: (context: BulkActionClickContext<ItemType, ComponentType>) => void;
    /**
     * Control the display of this item based on the user permissions.
     */
    requiresPermission?: string | ((userPermissions: string[]) => boolean);
}
