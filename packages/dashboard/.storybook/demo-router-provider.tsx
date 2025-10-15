import {
    AnyRoute,
    createMemoryHistory,
    createRootRoute,
    createRoute,
    createRouter,
    RouterProvider,
} from '@tanstack/react-router';

export function createDemoRoute(path?: string, initialPath?: string) {
    const rootRoute = createRootRoute();
    const route = createRoute({
        getParentRoute: () => rootRoute,
        path: path ?? 'test',
        component: () => <div>Test Route</div>,
        loader: () => ({ breadcrumb: 'Test' }),
    });
    const router = createRouter({
        routeTree: rootRoute.addChildren([route]),
        history: createMemoryHistory({
            initialEntries: [initialPath ?? '/test'],
        }),
    });
    return { route, router };
}

/**
 * A wrapper around components that need a Tanstack Router context
 */
export function DemoRouterProvider(props: {
    path?: string;
    initialPath?: string;
    component: (route: AnyRoute) => React.ReactNode;
}) {
    const rootRoute = createRootRoute();
    const route = createRoute({
        getParentRoute: () => rootRoute,
        path: props.path ?? 'test',
        component: () => props.component(route),
        loader: () => ({ breadcrumb: 'Test' }),
    });

    const router = createRouter({
        routeTree: rootRoute.addChildren([route]),
        history: createMemoryHistory({
            initialEntries: [props.initialPath ?? '/test'],
        }),
    });

    return <RouterProvider router={router} />;
}
