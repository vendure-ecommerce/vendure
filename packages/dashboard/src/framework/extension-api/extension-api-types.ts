import { NavMenuItem } from '@/framework/nav-menu/nav-menu.js';
import { AnyRoute } from '@tanstack/react-router';
import React from 'react';

import { DashboardWidgetDefinition } from '../dashboard-widget/types.js';

export interface DashboardBaseRouteDefinition {
    id: string;
    navMenuItem?: Partial<NavMenuItem> & { sectionId: string };
    path: string;
}

export interface DashboardRouteDefinition extends DashboardBaseRouteDefinition {
    component: (route: AnyRoute) => React.ReactNode;
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
