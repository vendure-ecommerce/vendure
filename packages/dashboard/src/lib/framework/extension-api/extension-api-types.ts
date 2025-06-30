import { PageContextValue } from '@/framework/layout-engine/page-provider.js';
import { AnyRoute, RouteOptions } from '@tanstack/react-router';
import { LucideIcon } from 'lucide-react';
import type React from 'react';

import { DashboardAlertDefinition } from '../alert/types.js';
import { DashboardWidgetDefinition } from '../dashboard-widget/types.js';
import { BulkAction } from '../data-table/data-table-types.js';
import { CustomFormComponentInputProps } from '../form-engine/custom-form-component.js';
import { NavMenuItem } from '../nav-menu/nav-menu-extensions.js';

/**
 * @description
 * Allows you to define custom form components for custom fields in the dashboard.
 *
 * @docsCategory extensions
 * @since 3.4.0
 */
export interface DashboardCustomFormComponent {
    id: string;
    component: React.FunctionComponent<CustomFormComponentInputProps>;
}

export interface DashboardRouteDefinition {
    component: (route: AnyRoute) => React.ReactNode;
    path: string;
    navMenuItem?: Partial<NavMenuItem> & { sectionId: string };
    loader?: RouteOptions['loader'];
}

export interface ActionBarButtonState {
    disabled: boolean;
    visible: boolean;
}

export interface DashboardNavSectionDefinition {
    id: string;
    title: string;
    icon?: LucideIcon;
    order?: number;
}

/**
 * @description
 * **Status: Developer Preview**
 *
 * Allows you to define custom action bar items for any page in the dashboard.
 *
 * @docsCategory extensions
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
     * Any permissions that are required to display this action bar item.
     */
    requiresPermission?: string | string[];
}

export interface DashboardActionBarDropdownMenuItem {
    locationId: string;
    component: React.FunctionComponent<{ context: PageContextValue }>;
    requiresPermission?: string | string[];
}

export type PageBlockPosition = { blockId: string; order: 'before' | 'after' | 'replace' };

/**
 * @description
 * **Status: Developer Preview**
 *
 * The location of a page block in the dashboard. The location can be found by turning on
 * "developer mode" in the dashboard user menu (bottom left corner) and then
 * clicking the `< />` icon when hovering over a page block.
 *
 * @docsCategory extensions
 * @since 3.3.0
 */
export type PageBlockLocation = {
    pageId: string;
    position: PageBlockPosition;
    column: 'main' | 'side';
};

/**
 * @description
 * **Status: Developer Preview**
 *
 * This allows you to insert a custom component into a specific location
 * on any page in the dashboard.
 *
 * @docsCategory extensions
 * @since 3.3.0
 */
export interface DashboardPageBlockDefinition {
    id: string;
    title?: React.ReactNode;
    location: PageBlockLocation;
    component: React.FunctionComponent<{ context: PageContextValue }>;
    requiresPermission?: string | string[];
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
export interface DashboardDataTableDefinition {
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
}

/**
 * @description
 * **Status: Developer Preview**
 *
 * This is used to define the routes, widgets, etc. that will be displayed in the dashboard.
 *
 * @docsCategory extensions
 * @since 3.3.0
 */
export interface DashboardExtension {
    /**
     * @description
     * Allows you to define custom routes such as list or detail views.
     */
    routes?: DashboardRouteDefinition[];
    /**
     * @description
     * Allows you to define custom nav sections for the dashboard.
     */
    navSections?: DashboardNavSectionDefinition[];
    /**
     * @description
     * Allows you to define custom page blocks for any page in the dashboard.
     */
    pageBlocks?: DashboardPageBlockDefinition[];
    /**
     * @description
     * Allows you to define custom action bar items for any page in the dashboard.
     */
    actionBarItems?: DashboardActionBarItem[];
    /**
     * @description
     * Not yet implemented
     */
    alerts?: DashboardAlertDefinition[];
    /**
     * @description
     * Allows you to define custom routes for the dashboard, which will render the
     * given components and optionally also add a nav menu item.
     */
    widgets?: DashboardWidgetDefinition[];
    /**
     * @description
     * Allows you to define custom form components for custom fields in the dashboard.
     */
    customFormComponents?: DashboardCustomFormComponent[];
    /**
     * @description
     * Allows you to customize aspects of existing data tables in the dashboard.
     */
    dataTables?: DashboardDataTableDefinition[];
}
