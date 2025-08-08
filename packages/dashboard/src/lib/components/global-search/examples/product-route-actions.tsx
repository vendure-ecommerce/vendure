import { QuickAction } from '@/vdb/providers/search-provider.js';
import { useNavigate } from '@tanstack/react-router';
import { useRegisterRouteActions, useRouteActionHelpers } from '../hooks/use-register-route-actions.js';

/**
 * Example component showing how to register context-aware quick actions
 * for a product detail route. This would be used inside the ProductDetailPage component.
 */
export function useProductRouteActions() {
    const navigate = useNavigate();
    const { entityId, entityType } = useRouteActionHelpers();

    // Define the actions specific to this route
    const productActions: QuickAction[] = [
        {
            id: 'duplicate-product',
            label: 'Duplicate Product',
            description: 'Create a copy of this product',
            icon: 'copy',
            shortcut: 'ctrl+d',
            isContextAware: true,
            handler: async context => {
                const confirmed = await context.confirm('Duplicate this product?');
                if (confirmed) {
                    // In a real implementation, this would call the duplicate API
                    context.showNotification('Product duplicated successfully');
                    // Navigate to the new product or stay on current
                    // context.navigate(`/products/${newProductId}`);
                }
            },
        },
        {
            id: 'add-product-variant',
            label: 'Add Variant',
            description: 'Add a new variant to this product',
            icon: 'plus-square',
            shortcut: 'ctrl+shift+v',
            isContextAware: true,
            handler: context => {
                // This could open a dialog or navigate to variant creation
                context.navigate(`/products/${entityId}/variants/create`);
            },
        },
        {
            id: 'save-product',
            label: 'Save Product',
            description: 'Save changes to this product',
            icon: 'save',
            shortcut: 'ctrl+s',
            isContextAware: true,
            handler: async context => {
                // In a real implementation, this would trigger form submission
                // You might access form state through a callback or context
                context.showNotification('Product saved');
            },
        },
        {
            id: 'delete-product',
            label: 'Delete Product',
            description: 'Delete this product permanently',
            icon: 'trash',
            shortcut: 'ctrl+shift+delete',
            isContextAware: true,
            requiredPermissions: ['DeleteProduct'],
            handler: async context => {
                const confirmed = await context.confirm(
                    'Are you sure you want to delete this product? This action cannot be undone.',
                );
                if (confirmed) {
                    // In a real implementation, this would call the delete API
                    context.showNotification('Product deleted', 'success');
                    context.navigate('/products');
                }
            },
        },
    ];

    // Register these actions when the component mounts
    useRegisterRouteActions(productActions);
}

/**
 * Alternative approach: Create actions dynamically based on product state
 */
export function useProductRouteActionsWithState(product: any, isDirty: boolean, onSave: () => void) {
    const { entityId } = useRouteActionHelpers();

    const productActions: QuickAction[] = [
        // Basic actions that always exist
        {
            id: 'duplicate-product',
            label: 'Duplicate Product',
            description: 'Create a copy of this product',
            icon: 'copy',
            shortcut: 'ctrl+d',
            isContextAware: true,
            handler: async context => {
                const confirmed = await context.confirm('Duplicate this product?');
                if (confirmed) {
                    context.showNotification('Product duplicated successfully');
                }
            },
        },
        // Conditional actions based on state
        ...(isDirty
            ? [
                  {
                      id: 'save-product',
                      label: 'Save Product',
                      description: 'Save changes to this product',
                      icon: 'save',
                      shortcut: 'ctrl+s',
                      isContextAware: true,
                      handler: async context => {
                          onSave();
                          context.showNotification('Product saved');
                      },
                  },
              ]
            : []),
        // Actions based on product properties
        ...(product?.enabled
            ? [
                  {
                      id: 'disable-product',
                      label: 'Disable Product',
                      description: 'Mark this product as disabled',
                      icon: 'eye-off',
                      isContextAware: true,
                      handler: async context => {
                          // Implementation here
                          context.showNotification('Product disabled');
                      },
                  },
              ]
            : [
                  {
                      id: 'enable-product',
                      label: 'Enable Product',
                      description: 'Mark this product as enabled',
                      icon: 'eye',
                      isContextAware: true,
                      handler: async context => {
                          // Implementation here
                          context.showNotification('Product enabled');
                      },
                  },
              ]),
    ];

    useRegisterRouteActions(productActions);
}

/**
 * Usage in a route component:
 *
 * function ProductDetailPage() {
 *     // Register product-specific actions
 *     useProductRouteActions();
 *
 *     // ... rest of component logic
 * }
 */
