import { AuthContext } from '@/providers/auth.js';
import { createRootRouteWithContext, Outlet, retainSearchParams } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import * as React from 'react';

export interface MyRouterContext {
    auth: AuthContext;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    component: RootComponent,
    search: {
        // middlewares: [retainSearchParams(['page', 'perPage', 'sort'] as any)],
    },
});

function RootComponent() {
    return (
        <>
            <Outlet />
            <TanStackRouterDevtools position="bottom-right" />
        </>
    );
}
