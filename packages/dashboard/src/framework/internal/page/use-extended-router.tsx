import { useDashboardExtensions } from '@/framework/internal/extension-api/use-dashboard-extensions.js';
import { ListPage } from '@/framework/internal/page/list-page.js';
import { listViewExtensionRoutes } from '@/framework/internal/page/page-api.js';
import { AUTHENTICATED_ROUTE_PREFIX } from '@/routes/_authenticated.js';
import { AnyRoute, createRoute, Router } from '@tanstack/react-router';
import { useMemo } from 'react';

/**
 * Extends the TanStack Router with additional routes for each dashboard
 * extension.
 */
const UseExtendedRouter = (router: Router<AnyRoute, any, any>) => {
    const { extensionsLoaded } = useDashboardExtensions();

    return useMemo(() => {
        if (!extensionsLoaded) {
            return router;
        }

        const authenticatedRouteIndex = router.routeTree.children.findIndex(
            (r: AnyRoute) => r.id === AUTHENTICATED_ROUTE_PREFIX,
        );

        if (authenticatedRouteIndex === -1) {
            return router;
        }

        let authenticatedRoute: AnyRoute = router.routeTree.children[authenticatedRouteIndex];

        const newRoutes: AnyRoute[] = [];
        // Create new routes for each extension
        for (const [path, config] of listViewExtensionRoutes.entries()) {
            const pathWithoutLeadingSlash = path.startsWith('/') ? path.slice(1) : path;
            if (
                authenticatedRoute.children.findIndex((r: AnyRoute) => r.path === pathWithoutLeadingSlash) >
                -1
            ) {
                // Skip if the route already exists
                continue;
            }

            const newRoute = createRoute({
                path: `/${pathWithoutLeadingSlash}`,
                getParentRoute: () => authenticatedRoute,
                component: () => (
                    <ListPage
                        title={config.title}
                        listQuery={config.listQuery}
                        defaultVisibility={config.defaultVisibility}
                        customizeColumns={config.customizeColumns}
                        onSearchTermChange={config.onSearchTermChange}
                        defaultColumnOrder={config.defaultColumnOrder}
                        route={() => newRoute}
                    />
                ),
            });
            newRoutes.push(newRoute);
        }

        const childrenWithoutAuthenticated = router.routeTree.children.filter(
            (r: AnyRoute) => r.id !== AUTHENTICATED_ROUTE_PREFIX,
        );

        // Create a new router with the modified route tree
        const newRouter = new Router({
            routeTree: router.routeTree.addChildren([
                ...childrenWithoutAuthenticated,
                authenticatedRoute.addChildren([...authenticatedRoute.children, ...newRoutes]),
            ]),
            basepath: router.basepath,
            defaultPreload: router.options.defaultPreload,
            defaultPreloadDelay: router.options.defaultPreloadDelay,
        });
        return newRouter;
    }, [router, extensionsLoaded]);
};

// const UseExtendedRouter = UseExtendedRouter;
export default UseExtendedRouter;
