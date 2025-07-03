import { AuthContext } from '@/vdb/providers/auth.js';
import { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';

export interface MyRouterContext {
    auth: AuthContext;
    queryClient: QueryClient;
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
        </>
    );
}
