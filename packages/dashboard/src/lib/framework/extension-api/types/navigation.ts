import { AnyRoute, RouteOptions } from '@tanstack/react-router';
import { LucideIcon } from 'lucide-react';
import type React from 'react';

import { NavMenuItem } from '../../nav-menu/nav-menu-extensions.js';

export interface DashboardRouteDefinition {
    component: (route: AnyRoute) => React.ReactNode;
    path: string;
    navMenuItem?: Partial<NavMenuItem> & { sectionId: string };
    loader?: RouteOptions['loader'];
}

export interface DashboardNavSectionDefinition {
    id: string;
    title: string;
    icon?: LucideIcon;
    order?: number;
}
