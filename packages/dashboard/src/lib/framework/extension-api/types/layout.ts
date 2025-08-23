import type React from 'react';

import { PageContextValue } from '../../layout-engine/page-provider.js';

export interface ActionBarButtonState {
    disabled: boolean;
    visible: boolean;
}

/**
 * @description
 * Allows you to define custom action bar items for any page in the dashboard.
 *
 * @docsCategory extensions
 * @docsPage Layout
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
     * A React component that will be rendered in the action bar.
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

export type PageBlockPosition = { blockId: string; order: 'before' | 'after' | 'replace' };

/**
 * @description
 * The location of a page block in the dashboard. The location can be found by turning on
 * "developer mode" in the dashboard user menu (bottom left corner) and then
 * clicking the `< />` icon when hovering over a page block.
 *
 * @docsCategory extensions
 * @docsPage Layout
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
 * @docsCategory extensions
 * @docsPage Layout
 * @since 3.3.0
 */
export interface DashboardPageBlockDefinition {
    id: string;
    title?: React.ReactNode;
    location: PageBlockLocation;
    component: React.FunctionComponent<{ context: PageContextValue }>;
    requiresPermission?: string | string[];
}
