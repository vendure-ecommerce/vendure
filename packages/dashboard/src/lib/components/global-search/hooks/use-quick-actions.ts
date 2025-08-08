import { QuickAction, QuickActionContext, useSearchContext } from '@/vdb/providers/search-provider.js';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo } from 'react';
import { toast } from 'sonner';

export const useQuickActions = () => {
    const { quickActions, registerQuickAction } = useSearchContext();
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
            currentRoute: location.pathname,
            currentEntityType,
            currentEntityId,
            navigate: (path: string) => navigate({ to: path }),
            showNotification: (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
                toast[type](message);
            },
            confirm: async (message: string) => {
                return window.confirm(message);
            },
            executeGraphQL: async (query: string, variables?: any) => {
                // perform API operation
            },
        };
    }, [location, navigate]);

    // Built-in global actions
    const builtInGlobalActions: QuickAction[] = useMemo(
        () => [
            {
                id: 'create-product',
                label: 'Create New Product',
                description: 'Create a new product',
                icon: 'plus',
                shortcut: 'ctrl+shift+p',
                isContextAware: false,
                handler: context => context.navigate('/products/create'),
            },
            {
                id: 'create-customer',
                label: 'Create New Customer',
                description: 'Create a new customer',
                icon: 'user-plus',
                shortcut: 'ctrl+shift+c',
                isContextAware: false,
                handler: context => context.navigate('/customers/create'),
            },
            {
                id: 'create-order',
                label: 'Create New Order',
                description: 'Create a new order',
                icon: 'shopping-cart',
                shortcut: 'ctrl+shift+o',
                isContextAware: false,
                handler: context => context.navigate('/orders/create'),
            },
            {
                id: 'go-to-products',
                label: 'Go to Products',
                description: 'Navigate to products list',
                icon: 'package',
                isContextAware: false,
                handler: context => context.navigate('/products'),
            },
            {
                id: 'go-to-orders',
                label: 'Go to Orders',
                description: 'Navigate to orders list',
                icon: 'shopping-cart',
                isContextAware: false,
                handler: context => context.navigate('/orders'),
            },
            {
                id: 'go-to-customers',
                label: 'Go to Customers',
                description: 'Navigate to customers list',
                icon: 'users',
                isContextAware: false,
                handler: context => context.navigate('/customers'),
            },
            {
                id: 'go-to-profile',
                label: 'Go to Profile',
                description: 'Navigate to user profile',
                icon: 'user',
                isContextAware: false,
                handler: context => context.navigate('/profile'),
            },
        ],
        [],
    );

    // Context-aware actions based on current route
    const getContextActions = useCallback(
        (route: string, entityType?: string, entityId?: string): QuickAction[] => {
            const actions: QuickAction[] = [];

            // Product detail page actions
            if (route.includes('/products/') && entityId) {
                actions.push({
                    id: 'duplicate-product',
                    label: 'Duplicate Product',
                    description: 'Duplicate current product',
                    icon: 'copy',
                    shortcut: 'ctrl+d',
                    isContextAware: true,
                    handler: async context => {
                        const confirmed = await context.confirm('Duplicate this product?');
                        if (confirmed) {
                            // Implementation would go here
                            context.showNotification('Product duplicated');
                            context.navigate(`/products/${entityId}/duplicate`);
                        }
                    },
                });

                actions.push({
                    id: 'add-variant',
                    label: 'Add Product Variant',
                    description: 'Add new variant to current product',
                    icon: 'plus-square',
                    shortcut: 'ctrl+shift+v',
                    isContextAware: true,
                    handler: context => {
                        context.navigate(`/products/${entityId}/variants/create`);
                    },
                });
            }

            // Order detail page actions
            if (route.includes('/orders/') && entityId) {
                actions.push({
                    id: 'fulfill-order',
                    label: 'Fulfill Order',
                    description: 'Fulfill current order',
                    icon: 'truck',
                    shortcut: 'ctrl+f',
                    isContextAware: true,
                    handler: context => {
                        context.navigate(`/orders/${entityId}/fulfill`);
                    },
                });

                actions.push({
                    id: 'cancel-order',
                    label: 'Cancel Order',
                    description: 'Cancel current order',
                    icon: 'x-circle',
                    shortcut: 'ctrl+shift+x',
                    isContextAware: true,
                    handler: async context => {
                        const confirmed = await context.confirm(
                            'Are you sure you want to cancel this order?',
                        );
                        if (confirmed) {
                            // Implementation would go here
                            context.showNotification('Order cancelled');
                        }
                    },
                });
            }

            // Customer detail page actions
            if (route.includes('/customers/') && entityId) {
                actions.push({
                    id: 'view-customer-orders',
                    label: 'View Customer Orders',
                    description: 'View orders for current customer',
                    icon: 'list',
                    isContextAware: true,
                    handler: context => {
                        context.navigate(`/customers/${entityId}/orders`);
                    },
                });
            }

            // Any list page actions
            if (route.includes('/list') || route.match(/\/(products|orders|customers|collections)$/)) {
                actions.push({
                    id: 'export-data',
                    label: 'Export Data',
                    description: 'Export current filtered data',
                    icon: 'download',
                    shortcut: 'ctrl+e',
                    isContextAware: true,
                    handler: async context => {
                        context.showNotification('Export started', 'success');
                        // Implementation would go here
                    },
                });

                if (entityType) {
                    actions.push({
                        id: 'create-new-item',
                        label: `Create New ${entityType.charAt(0).toUpperCase() + entityType.slice(1)}`,
                        description: `Create new ${entityType}`,
                        icon: 'plus',
                        shortcut: 'ctrl+n',
                        isContextAware: true,
                        handler: context => {
                            context.navigate(`/${entityType}/new`);
                        },
                    });
                }
            }

            return actions;
        },
        [],
    );

    // Register built-in actions
    useEffect(() => {
        builtInGlobalActions.forEach(action => {
            registerQuickAction(action);
        });
    }, [builtInGlobalActions, registerQuickAction]);

    // Get all available actions for current context
    const availableActions = useMemo(() => {
        const pathSegments = location.pathname.split('/').filter(Boolean);
        const entityType = pathSegments[0];
        const entityId = pathSegments.find(
            segment => segment.match(/^[a-f0-9-]{36}$/i) || segment.match(/^\d+$/),
        );

        const contextActions = getContextActions(location.pathname, entityType, entityId);

        // Combine built-in global actions, context actions, and registered custom actions
        const allActions = [
            ...builtInGlobalActions,
            ...contextActions,
            ...quickActions.filter(
                action =>
                    !builtInGlobalActions.some(builtin => builtin.id === action.id) &&
                    !contextActions.some(context => context.id === action.id),
            ),
        ];

        return allActions;
    }, [location.pathname, builtInGlobalActions, getContextActions, quickActions]);

    const executeAction = useCallback(
        async (actionId: string) => {
            const action = availableActions.find(a => a.id === actionId);
            if (!action) {
                return;
            }

            try {
                const context = createActionContext();
                await action.handler(context);
            } catch (error) {
                toast.error(`Failed to execute action: ${action.label}`);
            }
        },
        [availableActions, createActionContext],
    );

    return {
        actions: availableActions,
        executeAction,
        registerAction: registerQuickAction,
        createContext: createActionContext,
    };
};
