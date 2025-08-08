import { useEffect } from 'react';
import { useSearchContext, QuickAction } from '@/vdb/providers/search-provider.js';

/**
 * Example of how plugin developers can register custom global and context-aware actions
 * through the extension system (to be integrated with defineDashboardExtensions)
 */

/**
 * Register global actions that are available everywhere
 */
export function registerGlobalPluginActions() {
    // This would typically be called from within a plugin's dashboard extension
    const { registerQuickAction } = useSearchContext();

    const customGlobalActions: QuickAction[] = [
        {
            id: 'plugin-sync-inventory',
            label: 'Sync Inventory',
            description: 'Sync inventory with external system',
            icon: 'refresh-ccw',
            shortcut: 'ctrl+shift+i',
            isContextAware: false,
            handler: async (context) => {
                context.showNotification('Starting inventory sync...', 'success');
                try {
                    // Custom plugin API call
                    // await syncInventory();
                    context.showNotification('Inventory sync completed', 'success');
                } catch (error) {
                    context.showNotification('Inventory sync failed', 'error');
                }
            }
        },
        {
            id: 'plugin-generate-report',
            label: 'Generate Custom Report',
            description: 'Generate a custom sales report',
            icon: 'file-text',
            isContextAware: false,
            handler: async (context) => {
                // This could open a dialog for report configuration
                // or navigate to a custom report page
                context.navigate('/custom-reports/generate');
            }
        }
    ];

    // Register each action
    customGlobalActions.forEach(action => {
        registerQuickAction(action);
    });
}

/**
 * Hook for registering plugin-specific context actions
 * This would be used in route components where the plugin wants to add actions
 */
export function useCustomPluginRouteActions(
    routeType: 'product' | 'customer' | 'order',
    entityId?: string
) {
    const { registerQuickAction, unregisterQuickAction } = useSearchContext();

    useEffect(() => {
        const customActions: QuickAction[] = [];

        // Add actions based on route type
        if (routeType === 'product' && entityId) {
            customActions.push({
                id: 'plugin-update-seo',
                label: 'Update SEO Data',
                description: 'Update SEO metadata for this product',
                icon: 'search',
                isContextAware: true,
                handler: async (context) => {
                    // Custom SEO plugin functionality
                    context.showNotification('SEO data updated', 'success');
                }
            });

            customActions.push({
                id: 'plugin-check-competition',
                label: 'Check Competition',
                description: 'Check competitor pricing for this product',
                icon: 'bar-chart',
                isContextAware: true,
                handler: async (context) => {
                    // Open competition analysis dialog or navigate to page
                    context.navigate(`/competition-analysis/${entityId}`);
                }
            });
        }

        if (routeType === 'customer' && entityId) {
            customActions.push({
                id: 'plugin-send-email',
                label: 'Send Marketing Email',
                description: 'Send a personalized marketing email',
                icon: 'mail',
                isContextAware: true,
                handler: async (context) => {
                    // Open email composer dialog
                    context.showNotification('Email composer opened', 'success');
                }
            });
        }

        if (routeType === 'order' && entityId) {
            customActions.push({
                id: 'plugin-track-shipment',
                label: 'Track Shipment',
                description: 'Get real-time shipment tracking',
                icon: 'truck',
                isContextAware: true,
                handler: async (context) => {
                    // Integration with shipping provider API
                    context.navigate(`/tracking/${entityId}`);
                }
            });
        }

        // Register all custom actions
        customActions.forEach(action => {
            registerQuickAction(action);
        });

        // Cleanup when component unmounts or entityId changes
        return () => {
            customActions.forEach(action => {
                unregisterQuickAction(action.id);
            });
        };
    }, [routeType, entityId, registerQuickAction, unregisterQuickAction]);
}

/**
 * Integration with defineDashboardExtensions (future implementation)
 * This shows how the extension API could be used to register actions
 */

export interface QuickActionExtension {
    // Global actions (available everywhere)
    globalActions?: QuickAction[];

    // Context-aware actions (route/page specific)
    contextActions?: {
        [routePattern: string]: QuickAction[];
    };

    // Entity-specific actions (based on entity type)
    entityActions?: {
        [entityType: string]: QuickAction[];
    };
}

export function registerQuickActionExtensions(extensions: QuickActionExtension) {
    const { registerQuickAction } = useSearchContext();

    // Register global actions
    extensions.globalActions?.forEach(action => {
        registerQuickAction({
            ...action,
            isContextAware: false
        });
    });

    // Context actions would be registered by matching routes
    // This would be handled by the router/extension system
    
    // Entity actions would be registered based on current entity type
    // This would also be handled by the extension system
}

/**
 * Example usage in a plugin's dashboard extension:
 * 
 * defineDashboardExtensions({
 *     quickActions: {
 *         globalActions: [
 *             {
 *                 id: 'my-plugin-sync',
 *                 label: 'Sync with My Service',
 *                 icon: 'refresh',
 *                 handler: async (context) => {
 *                     // Plugin logic here
 *                 }
 *             }
 *         ],
 *         contextActions: {
 *             '/products/:id': [
 *                 {
 *                     id: 'my-plugin-product-action',
 *                     label: 'Custom Product Action',
 *                     icon: 'zap',
 *                     handler: async (context) => {
 *                         // Product-specific plugin logic
 *                     }
 *                 }
 *             ]
 *         }
 *     }
 * });
 */