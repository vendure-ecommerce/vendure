import { AppLayout } from '@/components/layout/app-layout.js';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { AUTHENTICATED_ROUTE_PREFIX } from '@/constants.js';
import * as React from 'react';

export const Route = createFileRoute(AUTHENTICATED_ROUTE_PREFIX)({
    beforeLoad: ({ context, location }) => {
        if (!context.auth.isAuthenticated) {
            throw redirect({
                to: '/login',
                search: {
                    redirect: location.href,
                },
            });
        }
    },
    loader: () => ({
        breadcrumb: 'Dashboard',
    }),
    component: AuthLayout,
});

function AuthLayout() {
    return <AppLayout />;
}
