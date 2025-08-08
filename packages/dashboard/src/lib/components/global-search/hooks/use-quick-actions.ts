import { useLocation, useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';
import { toast } from 'sonner';

import { QuickActionContext, useVisibleQuickActions } from '../quick-actions-registry.js';

export const useQuickActions = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const createActionContext = useCallback((): QuickActionContext => {
        // Extract entity info from current path
        const pathSegments = location.pathname.split('/').filter(Boolean);
        const currentEntityType = pathSegments[0];
        const currentEntityId = pathSegments.find(
            segment => segment.match(/^[a-f0-9-]{36}$/i) || segment.match(/^\d+$/),
        );

        return {
            currentRoute: location,
            currentEntityType,
            currentEntityId,
            navigate: (path: string) => navigate({ to: path }),
            showNotification: (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
                toast[type](message);
            },
            confirm: async (message: string) => {
                // TODO: Replace with our internal confirm dialog
                return window.confirm(message);
            },
        };
    }, [location, navigate]);

    // Get all actions visible for the current location from the registry
    const availableActions = useVisibleQuickActions(location);

    const executeAction = useCallback(
        async (actionId: string) => {
            const action = availableActions.find(a => a.id === actionId);
            if (!action) {
                // eslint-disable-next-line
                console.warn(`Quick action with id "${actionId}" not found`);
                return;
            }

            try {
                const context = createActionContext();
                await action.handler(context);
            } catch (error) {
                // eslint-disable-next-line
                console.error(`Error executing quick action "${actionId}":`, error);
                toast.error(`Failed to execute action: ${action.label}`);
            }
        },
        [availableActions, createActionContext],
    );

    return {
        actions: availableActions,
        executeAction,
        createContext: createActionContext,
    };
};
