import { NavMenuItem } from '@/framework/nav-menu/nav-menu.js';
import { AnyRoute, RouteOptions } from '@tanstack/react-router';
import React from 'react';

import { DashboardWidgetDefinition } from '../dashboard-widget/types.js';
import { PageContext } from '../layout-engine/page-layout.js';

export interface DashboardRouteDefinition {
    component: (route: AnyRoute) => React.ReactNode;
    id: string;
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
}
