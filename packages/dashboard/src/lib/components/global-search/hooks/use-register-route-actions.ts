import { QuickAction, useSearchContext } from '@/vdb/providers/search-provider.js';
import { useLocation, useParams } from '@tanstack/react-router';
import { useEffect } from 'react';

/**
 * Hook for registering context-aware quick actions that are specific to a route.
 * This should be used within route components to register actions that are only
 * available when that specific route is active.
 */
export const useRegisterRouteActions = (actions: QuickAction[]) => {
    const { registerQuickAction, unregisterQuickAction } = useSearchContext();
    const location = useLocation();
    const params = useParams({ strict: false });

    useEffect(() => {
        // Register actions when component mounts or location changes
        actions.forEach(action => {
            registerQuickAction({
                ...action,
                isContextAware: true, // Mark all route actions as context-aware
                // Store route info in metadata for cleanup
                params: {
                    ...action.params,
                    __routePath: location.pathname,
                    __routeParams: params,
                },
            });
        });

        // Cleanup function to unregister actions when component unmounts or route changes
        return () => {
            actions.forEach(action => {
                unregisterQuickAction(action.id);
            });
        };
    }, [actions, registerQuickAction, unregisterQuickAction, location.pathname, params]);
};

/**
 * Convenience hook for creating route-specific actions with access to current route context.
 * Provides common utilities like navigate, showNotification, etc.
 */
export const useRouteActionHelpers = () => {
    const location = useLocation();
    const params = useParams({ strict: false });

    // Extract entity info from current path
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const entityType = pathSegments[0];
    const entityId =
        pathSegments.find(segment => segment.match(/^[a-f0-9-]{36}$/i) || segment.match(/^\d+$/)) ||
        params.id;

    return {
        currentRoute: location.pathname,
        entityType,
        entityId,
        params,
        pathSegments,
    };
};
