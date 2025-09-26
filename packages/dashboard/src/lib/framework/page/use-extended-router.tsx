import { AnyRoute, createRoute, Router } from '@tanstack/react-router';
import { useMemo } from 'react';
import { ErrorPage } from '../../components/shared/error-page.js';
import { AUTHENTICATED_ROUTE_PREFIX } from '../../constants.js';
import { useDashboardExtensions } from '../extension-api/use-dashboard-extensions.js';
import { extensionRoutes } from './page-api.js';

/**
 * Extends the TanStack Router with additional routes for each dashboard
 * extension.
 */
export const useExtendedRouter = (router: Router<AnyRoute, any, any>) => {
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

        const newAuthenticatedRoutes: AnyRoute[] = [];
        const newRootRoutes: AnyRoute[] = [];

        // Create new routes for each extension
        for (const [path, config] of extensionRoutes.entries()) {
            const pathWithoutLeadingSlash = path.startsWith('/') ? path.slice(1) : path;

            // Check if route should be authenticated (default is true)
            const isAuthenticated = config.authenticated !== false;

            if (isAuthenticated) {
                // Check if the route already exists under authenticated route
                if (
                    authenticatedRoute.children.findIndex(
                        (r: AnyRoute) => r.path === pathWithoutLeadingSlash,
                    ) > -1
                ) {
                    // Skip if the route already exists
                    continue;
                }

                const newRoute: AnyRoute = createRoute({
                    path: `/${pathWithoutLeadingSlash}`,
                    getParentRoute: () => authenticatedRoute,
                    loader: config.loader,
                    component: () => config.component(newRoute),
                    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
                });
                newAuthenticatedRoutes.push(newRoute);
            } else {
                // Check if the route already exists at the root level
                // Check both by path and by id (which includes the leading slash)
                const routeExists =
                    router.routeTree.children.some(
                        (r: AnyRoute) =>
                            r.path === `/${pathWithoutLeadingSlash}` ||
                            r.path === pathWithoutLeadingSlash ||
                            r.id === `/${pathWithoutLeadingSlash}`,
                    ) ||
                    newRootRoutes.some(
                        (r: AnyRoute) =>
                            r.path === `/${pathWithoutLeadingSlash}` ||
                            r.id === `/${pathWithoutLeadingSlash}`,
                    );

                if (routeExists) {
                    // Skip if the route already exists
                    continue;
                }

                const newRoute: AnyRoute = createRoute({
                    path: `/${pathWithoutLeadingSlash}`,
                    getParentRoute: () => router.routeTree,
                    loader: config.loader,
                    component: () => config.component(newRoute),
                    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
                });
                newRootRoutes.push(newRoute);
            }
        }

        const childrenWithoutAuthenticated = router.routeTree.children.filter(
            (r: AnyRoute) => r.id !== AUTHENTICATED_ROUTE_PREFIX,
        );

        // Create a new router with the modified route tree
        const newRouter = new Router({
            routeTree: router.routeTree.addChildren([
                ...childrenWithoutAuthenticated,
                authenticatedRoute.addChildren([...authenticatedRoute.children, ...newAuthenticatedRoutes]),
                ...newRootRoutes,
            ]),
            basepath: router.basepath,
            defaultPreload: router.options.defaultPreload,
            defaultPreloadDelay: router.options.defaultPreloadDelay,
        });
        return newRouter;
    }, [router, extensionsLoaded]);
};
