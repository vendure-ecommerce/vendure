import { NavMenuItem } from '@/framework/nav-menu/nav-menu.js';
import { AnyRoute } from '@tanstack/react-router';
import React from 'react';

export interface DashboardBaseRouteDefinition {
    id: string;
    navMenuItem?: Partial<NavMenuItem> & { sectionId: string };
    path: string;
}

export interface DashboardRouteDefinition extends DashboardBaseRouteDefinition {
    component: (route: AnyRoute) => React.ReactNode;
}

export interface DashboardExtension {
    routes: DashboardRouteDefinition[];
}
