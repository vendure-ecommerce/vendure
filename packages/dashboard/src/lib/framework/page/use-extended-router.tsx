import { AnyRoute, createRoute, createRouter, RouterOptions } from '@tanstack/react-router';
import { useMemo } from 'react';
import { ErrorPage } from '../../components/shared/error-page.js';
import { AUTHENTICATED_ROUTE_PREFIX } from '../../constants.js';
import { useDashboardExtensions } from '../extension-api/use-dashboard-extensions.js';
import { extensionRoutes } from './page-api.js';

/**
 * Creates a TanStack Router with the base route tree extended with additional
 * routes from dashboard extensions.
 */
export const useExtendedRouter = (
    baseRouteTree: AnyRoute,
    routerOptions: Omit<RouterOptions<AnyRoute, any>, 'routeTree'>,
) => {
    const { extensionsLoaded } = useDashboardExtensions();

    return useMemo(() => {
        // Start with the base route tree
        let routeTree = baseRouteTree;

        // Only extend if extensions are loaded
        if (!extensionsLoaded) {
            return createRouter({
                ...routerOptions,
                routeTree,
            });
        }

        const authenticatedRouteIndex = routeTree.children.findIndex(
            (r: AnyRoute) => r.id === AUTHENTICATED_ROUTE_PREFIX,
        );

        if (authenticatedRouteIndex === -1) {
            // No authenticated route found, return router with base tree
            return createRouter({
                ...routerOptions,
                routeTree,
            });
        }

        let authenticatedRoute: AnyRoute = routeTree.children[authenticatedRouteIndex];

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
                    validateSearch: config.validateSearch,
                    component: () => config.component(newRoute),
                    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
                });
                newAuthenticatedRoutes.push(newRoute);
            } else {
                // Check if the route already exists at the root level
                // Check both by path and by id (which includes the leading slash)
                const routeExists =
                    routeTree.children.some(
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
                    getParentRoute: () => routeTree,
                    loader: config.loader,
                    validateSearch: config.validateSearch,
                    component: () => config.component(newRoute),
                    errorComponent: ({ error }) => <ErrorPage message={error.message} />,
                });
                newRootRoutes.push(newRoute);
            }
        }

        // Only extend the tree if we have new routes to add
        if (newAuthenticatedRoutes.length === 0 && newRootRoutes.length === 0) {
            return createRouter({
                ...routerOptions,
                routeTree,
            });
        }

        const childrenWithoutAuthenticated = routeTree.children.filter(
            (r: AnyRoute) => r.id !== AUTHENTICATED_ROUTE_PREFIX,
        );

        const updatedAuthenticatedRoute = authenticatedRoute.addChildren([
            ...authenticatedRoute.children,
            ...newAuthenticatedRoutes,
        ]);

        const extendedRouteTree: AnyRoute = routeTree.addChildren([
            ...childrenWithoutAuthenticated,
            updatedAuthenticatedRoute,
            ...newRootRoutes,
        ]);

        return createRouter({
            ...routerOptions,
            routeTree: extendedRouteTree,
        });
    }, [baseRouteTree, routerOptions, extensionsLoaded]);
};
