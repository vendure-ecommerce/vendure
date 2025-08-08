import { useCallback, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useProductListActions } from '../hooks/use-product-list-actions.js';

/**
 * Enhanced example showing how to integrate product list actions with real data
 * This would be used in a more sophisticated product list component
 */

interface Product {
    id: string;
    name: string;
    enabled: boolean;
    variants: Array<{
        stockOnHand: number;
    }>;
}

interface ProductListState {
    products: Product[];
    selectedProductIds: string[];
    totalCount: number;
    isLoading: boolean;
    filters: {
        enabled?: boolean;
        outOfStock?: boolean;
    };
}

export function useEnhancedProductListActions(
    state: ProductListState,
    actions: {
        refetch: () => void;
        setFilters: (filters: ProductListState['filters']) => void;
        clearFilters: () => void;
        deleteProducts: (ids: string[]) => Promise<void>;
        duplicateProducts: (ids: string[]) => Promise<void>;
        exportProducts: (ids?: string[]) => Promise<void>;
        importProducts: () => Promise<void>;
    }
) {
    const navigate = useNavigate();
    const { products, selectedProductIds, totalCount, filters } = state;
    const selectedCount = selectedProductIds.length;

    // Enhanced handlers that work with real data
    const handleCreateProduct = useCallback(() => {
        navigate({ to: '/products/new' });
    }, [navigate]);

    const handleExport = useCallback(async () => {
        try {
            if (selectedCount > 0) {
                await actions.exportProducts(selectedProductIds);
                toast.success(`Exported ${selectedCount} selected products`);
            } else {
                await actions.exportProducts();
                toast.success(`Exported all ${totalCount} products`);
            }
        } catch (error) {
            toast.error('Export failed');
        }
    }, [actions, selectedProductIds, selectedCount, totalCount]);

    const handleRefresh = useCallback(() => {
        actions.refetch();
        toast.success('Products list refreshed');
    }, [actions]);

    const handleBulkEdit = useCallback(() => {
        if (selectedCount === 0) {
            toast.warning('Please select products to edit');
            return;
        }
        
        // This could open a bulk edit dialog
        toast.success(`Bulk edit mode activated for ${selectedCount} products`);
        // In real implementation:
        // setBulkEditDialogOpen(true);
    }, [selectedCount]);

    const handleImport = useCallback(async () => {
        try {
            await actions.importProducts();
            toast.success('Product import completed');
        } catch (error) {
            toast.error('Import failed');
        }
    }, [actions]);

    const handleBulkDelete = useCallback(async () => {
        if (selectedCount === 0) {
            toast.warning('Please select products to delete');
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete ${selectedCount} selected products? This cannot be undone.`
        );
        
        if (confirmed) {
            try {
                await actions.deleteProducts(selectedProductIds);
                toast.success(`Deleted ${selectedCount} products`);
            } catch (error) {
                toast.error('Delete failed');
            }
        }
    }, [actions, selectedProductIds, selectedCount]);

    const handleBulkDuplicate = useCallback(async () => {
        if (selectedCount === 0) {
            toast.warning('Please select products to duplicate');
            return;
        }

        try {
            await actions.duplicateProducts(selectedProductIds);
            toast.success(`Duplicated ${selectedCount} products`);
        } catch (error) {
            toast.error('Duplicate failed');
        }
    }, [actions, selectedProductIds, selectedCount]);

    // Filter handlers
    const handleFilterEnabled = useCallback(() => {
        const newFilters = { ...filters, enabled: true };
        actions.setFilters(newFilters);
        toast.success('Showing enabled products only');
    }, [actions, filters]);

    const handleFilterDisabled = useCallback(() => {
        const newFilters = { ...filters, enabled: false };
        actions.setFilters(newFilters);
        toast.success('Showing disabled products only');
    }, [actions, filters]);

    const handleFilterOutOfStock = useCallback(() => {
        const newFilters = { ...filters, outOfStock: true };
        actions.setFilters(newFilters);
        toast.success('Showing out of stock products only');
    }, [actions, filters]);

    const handleClearFilters = useCallback(() => {
        actions.clearFilters();
        toast.success('All filters cleared');
    }, [actions]);

    // Dynamic action descriptions based on current state
    const dynamicActions = useMemo(() => ({
        export: {
            label: selectedCount > 0 ? `Export Selected (${selectedCount})` : 'Export All Products',
            description: selectedCount > 0 
                ? `Export ${selectedCount} selected products to CSV`
                : `Export all ${totalCount} products to CSV`
        },
        bulkEdit: {
            label: selectedCount > 0 ? `Bulk Edit (${selectedCount})` : 'Bulk Edit',
            description: selectedCount > 0
                ? `Edit ${selectedCount} selected products at once`
                : 'Select products to edit them in bulk'
        }
    }), [selectedCount, totalCount]);

    // Register the actions with dynamic data
    useProductListActions({
        onCreateProduct: handleCreateProduct,
        onExport: handleExport,
        onRefresh: handleRefresh,
        onBulkEdit: handleBulkEdit,
        onImport: handleImport,
        selectedCount,
        totalCount,
        // Additional dynamic handlers
        onBulkDelete: handleBulkDelete,
        onBulkDuplicate: handleBulkDuplicate,
        onFilterEnabled: handleFilterEnabled,
        onFilterDisabled: handleFilterDisabled,
        onFilterOutOfStock: handleFilterOutOfStock,
        onClearFilters: handleClearFilters,
        // Pass dynamic descriptions
        dynamicLabels: dynamicActions,
    });

    // Return handlers for use in the component if needed
    return {
        handleCreateProduct,
        handleExport,
        handleRefresh,
        handleBulkEdit,
        handleImport,
        handleBulkDelete,
        handleBulkDuplicate,
        handleFilterEnabled,
        handleFilterDisabled,
        handleFilterOutOfStock,
        handleClearFilters,
    };
}

/**
 * Usage in a sophisticated product list component:
 * 
 * function AdvancedProductListPage() {
 *     const [products, setProducts] = useState<Product[]>([]);
 *     const [selectedIds, setSelectedIds] = useState<string[]>([]);
 *     const [filters, setFilters] = useState({});
 *     
 *     const state = {
 *         products,
 *         selectedProductIds: selectedIds,
 *         totalCount: products.length,
 *         isLoading: false,
 *         filters,
 *     };
 *     
 *     const actions = {
 *         refetch: () => { /* refetch logic */ },
 *         setFilters: (newFilters) => setFilters(newFilters),
 *         clearFilters: () => setFilters({}),
 *         deleteProducts: async (ids) => { /* delete logic */ },
 *         duplicateProducts: async (ids) => { /* duplicate logic */ },
 *         exportProducts: async (ids?) => { /* export logic */ },
 *         importProducts: async () => { /* import logic */ },
 *     };
 *     
 *     // Register enhanced actions with real data
 *     const handlers = useEnhancedProductListActions(state, actions);
 *     
 *     return (
 *         <ListPage>
 *             {/* List implementation */}
 *         </ListPage>
 *     );
 * }
 */