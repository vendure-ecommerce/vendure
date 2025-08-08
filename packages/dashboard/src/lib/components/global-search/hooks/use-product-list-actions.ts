import { QuickAction, QuickActionContext } from '@/vdb/providers/search-provider.js';

import { useRegisterRouteActions } from './use-register-route-actions.js';

interface ProductListActionsOptions {
    onCreateProduct?: () => void;
    onExport?: () => void;
    onRefresh?: () => void;
    onBulkEdit?: () => void;
    onImport?: () => void;
    onBulkDelete?: () => void;
    onBulkDuplicate?: () => void;
    onFilterEnabled?: () => void;
    onFilterDisabled?: () => void;
    onFilterOutOfStock?: () => void;
    onClearFilters?: () => void;
    selectedCount?: number;
    totalCount?: number;
    dynamicLabels?: {
        export?: { label: string; description: string };
        bulkEdit?: { label: string; description: string };
    };
}

/**
 * Hook for registering context-aware quick actions specific to the product list page.
 * This provides actions that are relevant when viewing the products list.
 */
export function useProductListActions(options: ProductListActionsOptions = {}) {
    const {
        onCreateProduct,
        onExport,
        onRefresh,
        onBulkEdit,
        onImport,
        onBulkDelete,
        onBulkDuplicate,
        onFilterEnabled,
        onFilterDisabled,
        onFilterOutOfStock,
        onClearFilters,
        selectedCount = 0,
        totalCount = 0,
        dynamicLabels,
    } = options;

    const productListActions: QuickAction[] = [
        // Create new product action
        {
            id: 'create-new-product',
            label: 'Create New Product',
            description: 'Add a new product to the catalog',
            icon: 'plus',
            shortcut: 'ctrl+n',
            isContextAware: true,
            requiredPermissions: ['CreateProduct', 'CreateCatalog'],
            handler: (context: QuickActionContext) => {
                if (onCreateProduct) {
                    onCreateProduct();
                } else {
                    context.navigate('/products/new');
                }
            },
        },

        // Export products action
        {
            id: 'export-products',
            label: dynamicLabels?.export?.label || 'Export Products',
            description:
                dynamicLabels?.export?.description ||
                `Export ${totalCount > 0 ? `${totalCount} products` : 'products'} to CSV`,
            icon: 'download',
            shortcut: 'ctrl+e',
            isContextAware: true,
            handler: async (context: QuickActionContext) => {
                if (onExport) {
                    onExport();
                } else {
                    context.showNotification('Product export started', 'success');
                    // Default export implementation would go here
                    // This could trigger a download or navigate to an export page
                }
            },
        },

        // Import products action
        {
            id: 'import-products',
            label: 'Import Products',
            description: 'Import products from CSV file',
            icon: 'upload',
            shortcut: 'ctrl+i',
            isContextAware: true,
            requiredPermissions: ['CreateProduct', 'UpdateProduct'],
            handler: (context: QuickActionContext) => {
                if (onImport) {
                    onImport();
                } else {
                    // Could open an import dialog or navigate to import page
                    context.navigate('/products/import');
                    // Or trigger a file picker dialog
                    // document.createElement('input').click();
                }
            },
        },

        // Refresh products list action
        {
            id: 'refresh-products',
            label: 'Refresh Products',
            description: 'Reload the products list',
            icon: 'refresh-cw',
            shortcut: 'ctrl+r',
            isContextAware: true,
            handler: async (context: QuickActionContext) => {
                if (onRefresh) {
                    onRefresh();
                } else {
                    context.showNotification('Products list refreshed', 'success');
                }
            },
        },

        // Bulk operations action (only show if items are selected)
        ...(selectedCount > 0
            ? [
                  {
                      id: 'bulk-edit-products',
                      label: dynamicLabels?.bulkEdit?.label || `Bulk Edit (${selectedCount} selected)`,
                      description:
                          dynamicLabels?.bulkEdit?.description ||
                          `Edit ${selectedCount} selected products at once`,
                      icon: 'edit',
                      shortcut: 'ctrl+b',
                      isContextAware: true,
                      handler: async (context: QuickActionContext) => {
                          if (onBulkEdit) {
                              onBulkEdit();
                          } else {
                              context.showNotification(
                                  `Bulk edit mode activated for ${selectedCount} products`,
                                  'success',
                              );
                              // This could open a bulk edit dialog or enter a special mode
                          }
                      },
                  },
              ]
            : []),

        // Additional bulk actions (only show if items are selected)
        ...(selectedCount > 0 && onBulkDelete
            ? [
                  {
                      id: 'bulk-delete-products',
                      label: `Delete Selected (${selectedCount})`,
                      description: `Delete ${selectedCount} selected products permanently`,
                      icon: 'trash',
                      shortcut: 'ctrl+shift+delete',
                      isContextAware: true,
                      requiredPermissions: ['DeleteProduct'],
                      handler: async (context: QuickActionContext) => {
                          if (onBulkDelete) {
                              onBulkDelete();
                          } else {
                              const confirmed = await context.confirm(
                                  `Are you sure you want to delete ${selectedCount} products? This cannot be undone.`,
                              );
                              if (confirmed) {
                                  context.showNotification(`${selectedCount} products deleted`, 'success');
                              }
                          }
                      },
                  },
              ]
            : []),

        ...(selectedCount > 0 && onBulkDuplicate
            ? [
                  {
                      id: 'bulk-duplicate-products',
                      label: `Duplicate Selected (${selectedCount})`,
                      description: `Create copies of ${selectedCount} selected products`,
                      icon: 'copy',
                      shortcut: 'ctrl+shift+d',
                      isContextAware: true,
                      requiredPermissions: ['CreateProduct'],
                      handler: async (context: QuickActionContext) => {
                          if (onBulkDuplicate) {
                              onBulkDuplicate();
                          } else {
                              context.showNotification(`${selectedCount} products duplicated`, 'success');
                          }
                      },
                  },
              ]
            : []),

        // Quick filters/views
        {
            id: 'filter-enabled-products',
            label: 'Show Enabled Products',
            description: 'Filter to show only enabled products',
            icon: 'eye',
            isContextAware: true,
            handler: (context: QuickActionContext) => {
                if (onFilterEnabled) {
                    onFilterEnabled();
                } else {
                    context.showNotification('Showing enabled products only', 'success');
                }
            },
        },

        {
            id: 'filter-disabled-products',
            label: 'Show Disabled Products',
            description: 'Filter to show only disabled products',
            icon: 'eye-off',
            isContextAware: true,
            handler: (context: QuickActionContext) => {
                if (onFilterDisabled) {
                    onFilterDisabled();
                } else {
                    context.showNotification('Showing disabled products only', 'success');
                }
            },
        },

        {
            id: 'filter-out-of-stock',
            label: 'Show Out of Stock',
            description: 'Filter to show products that are out of stock',
            icon: 'alert-triangle',
            isContextAware: true,
            handler: (context: QuickActionContext) => {
                if (onFilterOutOfStock) {
                    onFilterOutOfStock();
                } else {
                    context.showNotification('Showing out of stock products only', 'success');
                }
            },
        },

        // Clear all filters
        {
            id: 'clear-filters',
            label: 'Clear All Filters',
            description: 'Remove all applied filters and show all products',
            icon: 'filter-x',
            shortcut: 'ctrl+shift+x',
            isContextAware: true,
            handler: (context: QuickActionContext) => {
                if (onClearFilters) {
                    onClearFilters();
                } else {
                    context.showNotification('All filters cleared', 'success');
                }
            },
        },

        // Product management actions
        {
            id: 'manage-facets',
            label: 'Manage Facets',
            description: 'Navigate to facet management',
            icon: 'tags',
            isContextAware: true,
            handler: (context: QuickActionContext) => {
                context.navigate('/facets');
            },
        },

        {
            id: 'manage-collections',
            label: 'Manage Collections',
            description: 'Navigate to collection management',
            icon: 'folder',
            isContextAware: true,
            handler: (context: QuickActionContext) => {
                context.navigate('/collections');
            },
        },
    ];

    useRegisterRouteActions(productListActions);
}
