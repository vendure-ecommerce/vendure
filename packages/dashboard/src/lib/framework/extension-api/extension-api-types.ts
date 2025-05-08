import { AnyRoute, RouteOptions } from '@tanstack/react-router';
import type React from 'react';

import { DashboardAlertDefinition } from '../alert/types.js';
import { DashboardWidgetDefinition } from '../dashboard-widget/types.js';
import { PageContext } from '../layout-engine/page-layout.js';
import { NavMenuItem } from '../nav-menu/nav-menu-extensions.js';

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

export interface DashboardActionBarItem {
    locationId: string;
    component: React.FunctionComponent<{ context: PageContext }>;
    requiresPermission?: string | string[];
}

export interface DashboardActionBarDropdownMenuItem {
    locationId: string;
    component: React.FunctionComponent<{ context: PageContext }>;
    requiresPermission?: string | string[];
}

export type PageBlockPosition = { blockId: string; order: 'before' | 'after' | 'replace' };

export type PageBlockLocation = {
    pageId: string;
    position: PageBlockPosition;
    column: 'main' | 'side';
};

export interface DashboardPageBlockDefinition {
    id: string;
    title?: React.ReactNode;
    location: PageBlockLocation;
    component: React.FunctionComponent<{ context: PageContext }>;
    requiresPermission?: string | string[];
}

/**
 * @description
 * The main entry point for a dashboard extension.
 * This is used to define the routes, widgets, etc. that will be displayed in the dashboard.
 */
export interface DashboardExtension {
    routes: DashboardRouteDefinition[];
    widgets: DashboardWidgetDefinition[];
    actionBarItems: DashboardActionBarItem[];
    pageBlocks: DashboardPageBlockDefinition[];
    alerts: DashboardAlertDefinition[];
}
