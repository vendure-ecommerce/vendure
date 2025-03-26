import { PageBreadcrumb } from '@/components/layout/generated-breadcrumbs.js';
import { NavMenuItem } from '@/framework/nav-menu/nav-menu.js';
import { AnyRoute, RouteOptions } from '@tanstack/react-router';
import React from 'react';

import { DashboardWidgetDefinition } from '../dashboard-widget/types.js';

export interface DashboardRouteDefinition {
    component: (route: AnyRoute) => React.ReactNode;
    id: string;
    path: string;
    navMenuItem?: Partial<NavMenuItem> & { sectionId: string };
    loader?: RouteOptions['loader'];
}

/**
 * @description
 * The main entry point for a dashboard extension.
 * This is used to define the routes, widgets, etc. that will be displayed in the dashboard.
 */
export interface DashboardExtension {
    routes: DashboardRouteDefinition[];
    widgets: DashboardWidgetDefinition[];
}
