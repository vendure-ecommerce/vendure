import { ParsedLocation, useRouter } from '@tanstack/react-router';
import { useMemo } from 'react';

import { globalRegistry } from '../../framework/registry/global-registry.js';

export interface QuickActionDefinition {
    id: string;
    label: string;
    description?: string;
    icon?: string;
    shortcut?: string;
    requiredPermissions?: string[];
    handler: QuickActionHandler;
    params?: Record<string, any>;
    /**
     * Function that determines if this action should be visible based on the current route.
     * Replaces the isContextAware flag with more flexible visibility logic.
     */
    visible?: (location: ParsedLocation, basepath?: string) => boolean;
}

export type QuickActionHandler = (context: QuickActionContext) => void | Promise<void>;

export interface QuickActionContext {
    currentRoute: ParsedLocation<any>;
    currentEntityType?: string;
    currentEntityId?: string;
    navigate: (path: string) => void;
    showNotification: (message: string, type?: 'success' | 'error' | 'warning') => void;
    confirm: (message: string) => Promise<boolean>;
}

/**
 * Initialize the quick actions registry in the global registry if it doesn't exist
 */
function initializeRegistry(): Map<string, QuickActionDefinition> {
    if (!globalRegistry.has('searchQuickActions')) {
        globalRegistry.register('searchQuickActions', new Map<string, QuickActionDefinition>());
    }
    return globalRegistry.get('searchQuickActions');
}

/**
 * Register a quick action in the global registry
 */
export function registerQuickAction(action: QuickActionDefinition) {
    const registry = initializeRegistry();
    registry.set(action.id, action);
}

/**
 * Get all registered quick actions
 */
export function getRegisteredQuickActions(): QuickActionDefinition[] {
    const registry = initializeRegistry();
    return Array.from(registry.values());
}

/**
 * Get quick actions that are visible for the given location
 */
export function getVisibleQuickActions(location: ParsedLocation, basepath?: string): QuickActionDefinition[] {
    const registry = initializeRegistry();
    return Array.from(registry.values()).filter(action => action.visible?.(location, basepath) ?? true);
}

/**
 * Hook to get quick actions that are visible for the current location, taking router basepath into account
 */
export function useVisibleQuickActions(location: ParsedLocation): QuickActionDefinition[] {
    const router = useRouter();
    const basepath = router.basepath || '';
    return useMemo(() => getVisibleQuickActions(location, basepath), [basepath, location]);
}

/**
 * Clear all registered quick actions (mainly for testing)
 */
export function clearQuickActionsRegistry() {
    const registry = initializeRegistry();
    registry.clear();
}

// Utility functions for common visibility patterns

/**
 * Normalizes a pathname by removing the basepath if present
 */
function normalizePathname(pathname: string, basepath?: string): string {
    if (!basepath || basepath === '/') {
        return pathname;
    }

    // Ensure basepath doesn't end with a slash (unless it's just "/")
    const normalizedBasepath = basepath.endsWith('/') ? basepath.slice(0, -1) : basepath;

    if (pathname.startsWith(normalizedBasepath)) {
        const pathWithoutBase = pathname.slice(normalizedBasepath.length);
        return pathWithoutBase.startsWith('/') ? pathWithoutBase : '/' + pathWithoutBase;
    }

    return pathname;
}

/**
 * Always visible (global actions)
 */
export const alwaysVisible = (_location: ParsedLocation, _basepath?: string) => true;

/**
 * Visible only on specific routes
 */
export const visibleOnRoutes =
    (...routes: string[]) =>
    (location: ParsedLocation, basepath?: string) => {
        const normalizedPath = normalizePathname(location.pathname, basepath);
        return routes.some(route => {
            // Support exact match and pattern matching
            if (route.includes('*')) {
                const pattern = route.replace('*', '.*');
                const regex = new RegExp(`^${pattern}$`);
                return regex.test(normalizedPath);
            }
            return normalizedPath === route || normalizedPath.startsWith(route + '/');
        });
    };

/**
 * Visible only on list pages
 */
export const visibleOnListPages = (entityType?: string) => (location: ParsedLocation, basepath?: string) => {
    const path = normalizePathname(location.pathname, basepath);
    if (entityType) {
        return path === `/${entityType}` || path === `/${entityType}/`;
    }
    // Generic list page detection
    // eslint-disable-next-line
    return /^\/(products|customers|orders|collections|facets|assets|promotions|administrators|roles|channels|countries|zones|sellers|stock-locations|customer-groups|payment-methods|shipping-methods|tax-categories|tax-rates)$/.test(
        path,
    );
};

/**
 * Visible only on detail pages
 */
export const visibleOnDetailPages =
    (entityType?: string) => (location: ParsedLocation, basepath?: string) => {
        const normalizedPath = normalizePathname(location.pathname, basepath);
        const pathSegments = normalizedPath.split('/').filter(Boolean);

        if (entityType) {
            return pathSegments[0] === entityType && pathSegments.length >= 2 && pathSegments[1] !== 'new';
        }

        // Generic detail page detection (has an ID in the URL)
        return (
            pathSegments.length >= 2 &&
            pathSegments[1] !== 'new' &&
            (!!pathSegments[1].match(/^[a-f0-9-]{36}$/i) || !!pathSegments[1].match(/^\d+$/))
        );
    };

/**
 * Visible only on create/new pages
 */
export const visibleOnCreatePages =
    (entityType?: string) => (location: ParsedLocation, basepath?: string) => {
        const normalizedPath = normalizePathname(location.pathname, basepath);
        const pathSegments = normalizedPath.split('/').filter(Boolean);

        if (entityType) {
            return pathSegments[0] === entityType && pathSegments[1] === 'new';
        }

        // Generic create page detection
        return pathSegments.length >= 2 && pathSegments[1] === 'new';
    };

/**
 * Visible when selection exists (requires additional state, used with dynamic actions)
 */
export const visibleWithSelection =
    (getSelectionCount?: () => number) => (location: ParsedLocation, basepath?: string) => {
        const isListPage = visibleOnListPages()(location, basepath);
        return isListPage && (getSelectionCount ? getSelectionCount() > 0 : true);
    };
