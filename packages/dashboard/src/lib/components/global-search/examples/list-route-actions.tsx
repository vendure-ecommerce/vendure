import { useRegisterRouteActions } from '../hooks/use-register-route-actions.js';
import { QuickAction, QuickActionContext } from '@/vdb/providers/search-provider.js';

/**
 * Example hook for registering quick actions on list pages (e.g., /products, /customers, /orders)
 * These actions are common to most list views.
 */
export function useListRouteActions(options: {
    entityType: string;
    onExport?: () => void;
    onBulkEdit?: () => void;
    canCreate?: boolean;
    canExport?: boolean;
    canBulkEdit?: boolean;
} = { entityType: 'item' }) {
    
    const { entityType, onExport, onBulkEdit, canCreate = true, canExport = true, canBulkEdit = true } = options;
    
    const listActions: QuickAction[] = [
        // Create new item action
        ...(canCreate ? [{
            id: 'create-new-item',
            label: `Create New ${entityType.charAt(0).toUpperCase() + entityType.slice(1)}`,
            description: `Create a new ${entityType}`,
            icon: 'plus',
            shortcut: 'ctrl+n',
            isContextAware: true,
            handler: (context: QuickActionContext) => {
                context.navigate(`/${entityType}s/new`);
            }
        }] : []),

        // Export data action
        ...(canExport ? [{
            id: 'export-data',
            label: 'Export Data',
            description: 'Export current filtered data to CSV',
            icon: 'download',
            shortcut: 'ctrl+e',
            isContextAware: true,
            handler: async (context: QuickActionContext) => {
                if (onExport) {
                    onExport();
                } else {
                    // Default export behavior
                    context.showNotification('Export started', 'success');
                    // In real implementation, this would trigger the actual export
                }
            }
        }] : []),

        // Bulk edit action
        ...(canBulkEdit ? [{
            id: 'bulk-edit',
            label: 'Bulk Edit',
            description: 'Edit multiple items at once',
            icon: 'edit',
            shortcut: 'ctrl+b',
            isContextAware: true,
            handler: async (context: QuickActionContext) => {
                if (onBulkEdit) {
                    onBulkEdit();
                } else {
                    // Default bulk edit behavior - could open a dialog
                    context.showNotification('Bulk edit mode activated', 'success');
                }
            }
        }] : []),

        // Refresh list action
        {
            id: 'refresh-list',
            label: 'Refresh List',
            description: 'Reload the current list',
            icon: 'refresh-cw',
            shortcut: 'ctrl+r',
            isContextAware: true,
            handler: async (context: QuickActionContext) => {
                // This could trigger a refetch of the list data
                context.showNotification('List refreshed', 'success');
                // In real implementation: refetch();
            }
        }
    ];

    useRegisterRouteActions(listActions);
}

/**
 * Specific implementations for common list pages
 */

export function useProductsListActions(options?: {
    onExport?: () => void;
    onBulkEdit?: () => void;
}) {
    useListRouteActions({
        entityType: 'product',
        ...options,
    });
}

export function useCustomersListActions(options?: {
    onExport?: () => void;
    onBulkEdit?: () => void;
}) {
    useListRouteActions({
        entityType: 'customer',
        ...options,
    });
}

export function useOrdersListActions(options?: {
    onExport?: () => void;
    onBulkEdit?: () => void;
}) {
    useListRouteActions({
        entityType: 'order',
        ...options,
    });
}

/**
 * Usage in a list page component:
 * 
 * function ProductsListPage() {
 *     const handleExport = useCallback(() => {
 *         // Custom export logic
 *     }, []);
 *     
 *     const handleBulkEdit = useCallback(() => {
 *         // Custom bulk edit logic
 *     }, []);
 *     
 *     // Register list-specific actions
 *     useProductsListActions({
 *         onExport: handleExport,
 *         onBulkEdit: handleBulkEdit
 *     });
 *     
 *     // ... rest of component logic
 * }
 */