import type React from 'react';

import { PageContextValue } from '../../layout-engine/page-provider.js';

/**
 * @description
 * Allows you to define custom action bar items for any page in the dashboard, which is the
 * top bar that normally contains the main call-to-action buttons such as "update" or "create".
 *
 * This API also allows you to specify dropdown menu items, which when defined, will appear in
 * a context menu to the very right of the ActionBar.
 *
 * @docsCategory extensions-api
 * @docsPage ActionBar
 * @since 3.3.0
 */
export interface DashboardActionBarItem {
    /**
     * @description
     * The ID of the page where the action bar item should be displayed.
     */
    pageId: string;
    /**
     * @description
     * A React component that will be rendered in the action bar. Typically, you would use
     * the default Shadcn `<Button>` component.
     */
    component: React.FunctionComponent<{ context: PageContextValue }>;
    /**
     * @description
     * The type of action bar item to display. Defaults to `button`.
     * The 'dropdown' type is used to display the action bar item as a dropdown menu item.
     *
     * When using the dropdown type, use a suitable [dropdown item](https://ui.shadcn.com/docs/components/dropdown-menu)
     * component, such as:
     *
     * ```tsx
     * import { DropdownMenuItem } from '\@vendure/dashboard';
     *
     * // ...
     *
     * {
     *   component: () => <DropdownMenuItem>My Item</DropdownMenuItem>
     * }
     * ```
     *
     * @default 'button'
     */
    type?: 'button' | 'dropdown';
    /**
     * @description
     * Any permissions that are required to display this action bar item.
     */
    requiresPermission?: string | string[];
}

/**
 * @description
 * The relative position of a PageBlock. This is determined by finding an existing
 * block, and then specifying whether your custom block should come before, after,
 * or completely replace that block.
 *
 * @docsCategory extensions-api
 * @docsPage page-blocks
 * @since 3.3.0
 */
export type PageBlockPosition = { blockId: string; order: 'before' | 'after' | 'replace' };

/**
 * @description
 * The location of a page block in the dashboard. The location can be found by turning on
 * "developer mode" in the dashboard user menu (bottom left corner) and then
 * clicking the `< />` icon when hovering over a page block.
 *
 * @docsCategory extensions-api
 * @docsPage page-blocks
 * @since 3.3.0
 */
export type PageBlockLocation = {
    pageId: string;
    position: PageBlockPosition;
    column: 'main' | 'side';
};

/**
 * @description
 * This allows you to insert a custom component into a specific location
 * on any page in the dashboard.
 *
 * @docsCategory extensions-api
 * @docsPage page-blocks
 * @docsWeight 0
 * @since 3.3.0
 */
export interface DashboardPageBlockDefinition {
    id: string;
    title?: React.ReactNode;
    location: PageBlockLocation;
    component: React.FunctionComponent<{ context: PageContextValue }>;
    requiresPermission?: string | string[];
}
