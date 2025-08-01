import { AnyRoute, RouteOptions } from '@tanstack/react-router';
import { LucideIcon } from 'lucide-react';
import type React from 'react';

import { NavMenuItem } from '../../nav-menu/nav-menu-extensions.js';

/**
 * @description
 * Defines a custom route for the dashboard with optional navigation menu integration.
 */
export interface DashboardRouteDefinition {
    /**
     * @description
     * The React component that will be rendered for this route.
     */
    component: (route: AnyRoute) => React.ReactNode;
    /**
     * @description
     * The URL path for this route, e.g. '/my-custom-page'.
     */
    path: string;
    /**
     * @description
     * Optional navigation menu item configuration to add this route to the sidebar.
     */
    navMenuItem?: Partial<NavMenuItem> & { sectionId: string };
    /**
     * @description
     * Optional loader function to fetch data before the route renders.
     */
    loader?: RouteOptions['loader'];
}

/**
 * @description
 * Defines a custom navigation section in the dashboard sidebar.
 */
export interface DashboardNavSectionDefinition {
    /**
     * @description
     * A unique identifier for the navigation section.
     */
    id: string;
    /**
     * @description
     * The display title for the navigation section.
     */
    title: string;
    /**
     * @description
     * Optional icon to display next to the section title.
     */
    icon?: LucideIcon;
    /**
     * @description
     * Optional order number to control the position of this section in the sidebar.
     */
    order?: number;
}
