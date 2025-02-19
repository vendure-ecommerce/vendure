import { AuthContext, useAuth } from '@/auth.js';
import { AppSidebar } from '@/components/app-sidebar.js';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb.js';
import { Separator } from '@/components/ui/separator.js';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar.js';
import * as React from 'react';
import { Link, Outlet, createRootRoute, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

interface MyRouterContext {
    auth: AuthContext;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    component: RootComponent,
});

function RootComponent() {
    // const auth = useAuth();
    // if (!auth.isAuthenticated) {
    //     return ;
    // }
    return (
        <>
            <Outlet />
            <TanStackRouterDevtools position="bottom-right" />
        </>
    );
}
