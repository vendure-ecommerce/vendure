import { PageBreadcrumb } from '@/components/layout/generated-breadcrumbs.js';
import { NavMenuItem } from '@/framework/nav-menu/nav-menu.js';
import { AnyRoute, RouteOptions } from '@tanstack/react-router';
import React from 'react';

export interface DashboardRouteDefinition {
    component: (route: AnyRoute) => React.ReactNode;
    id: string;
    path: string;
    navMenuItem?: Partial<NavMenuItem> & { sectionId: string };
    loader?: RouteOptions['loader'];
}

export interface DashboardExtension {
    routes: DashboardRouteDefinition[];
}
