import { api } from '@/vdb/graphql/api.js';
import {
    getSettingsStoreValueDocument,
    setSettingsStoreValueDocument,
} from '@/vdb/graphql/settings-store-operations.js';
import { SavedView, SavedViewsStore, SaveViewInput, UpdateViewInput } from '@/vdb/types/saved-views.js';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ColumnFiltersState } from '@tanstack/react-table';

import { usePageBlock } from './use-page-block.js';
import { usePage } from './use-page.js';
import { usePermissions } from './use-permissions.js';

const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

export function useSavedViews() {
    const queryClient = useQueryClient();
    const { pageId } = usePage();
    const pageBlock = usePageBlock({ optional: true });
    const blockId = pageBlock?.blockId;

    if (!pageId) {
        throw new Error('useSavedViews must be used within a Page context');
    }

    // Create a unique scope combining pageId and blockId
    // Only include blockId if it's not the default "list-table" block from ListPage
    const scope = blockId && blockId !== 'list-table' ? `${pageId}.${blockId}` : pageId;

    const userViewsKey = 'vendure.dashboard.userSavedViews';
    const globalViewsKey = 'vendure.dashboard.globalSavedViews';

    // Query for user views
    const { data: userViewsData, isLoading: userViewsLoading } = useQuery({
        queryKey: ['saved-views-user', scope],
        queryFn: async () => {
            const result = await api.query(getSettingsStoreValueDocument, { key: userViewsKey });
            const allUserViews = (result?.getSettingsStoreValue as SavedViewsStore) || {};
            return allUserViews[scope] || [];
        },
    });

    // Query for global views
    const { data: globalViewsData, isLoading: globalViewsLoading } = useQuery({
        queryKey: ['saved-views-global', scope],
        queryFn: async () => {
            const result = await api.query(getSettingsStoreValueDocument, { key: globalViewsKey });
            const allGlobalViews = (result?.getSettingsStoreValue as SavedViewsStore) || {};
            return allGlobalViews[scope] || [];
        },
    });

    // Save user view mutation
    const saveUserViewMutation = useMutation({
        mutationFn: async (views: SavedView[]) => {
            // Get current data first
            const result = await api.query(getSettingsStoreValueDocument, { key: userViewsKey });
            const allUserViews = (result?.getSettingsStoreValue as SavedViewsStore) || {};

            // Update the specific scope
            const updatedViews = { ...allUserViews, [scope]: views };

            return api.mutate(setSettingsStoreValueDocument, {
                input: { key: userViewsKey, value: updatedViews },
            });
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['saved-views-user', scope] });
        },
    });

    // Save global view mutation
    const saveGlobalViewMutation = useMutation({
        mutationFn: async (views: SavedView[]) => {
            // Get current data first
            const result = await api.query(getSettingsStoreValueDocument, { key: globalViewsKey });
            const allGlobalViews = (result?.getSettingsStoreValue as SavedViewsStore) || {};

            // Update the specific scope
            const updatedViews = { ...allGlobalViews, [scope]: views };

            return api.mutate(setSettingsStoreValueDocument, {
                input: { key: globalViewsKey, value: updatedViews },
            });
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['saved-views-global', scope] });
        },
    });

    const saveView = async (input: SaveViewInput) => {
        const newView: SavedView = {
            id: generateId(),
            name: input.name,
            scope: input.scope,
            filters: input.filters,
            searchTerm: input.searchTerm,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        if (input.scope === 'user') {
            const currentViews = userViewsData || [];
            await saveUserViewMutation.mutateAsync([...currentViews, newView]);
        } else {
            const currentViews = globalViewsData || [];
            await saveGlobalViewMutation.mutateAsync([...currentViews, newView]);
        }

        return newView;
    };

    const updateView = async (input: UpdateViewInput) => {
        const userViews = userViewsData || [];
        const globalViews = globalViewsData || [];

        const viewInUserViews = userViews.find(v => v.id === input.id);
        const viewInGlobalViews = globalViews.find(v => v.id === input.id);

        if (viewInUserViews) {
            const updatedViews = userViews.map(v =>
                v.id === input.id
                    ? {
                          ...v,
                          name: input.name ?? v.name,
                          filters: input.filters ?? v.filters,
                          searchTerm: input.searchTerm !== undefined ? input.searchTerm : v.searchTerm,
                          updatedAt: new Date(),
                      }
                    : v,
            );
            await saveUserViewMutation.mutateAsync(updatedViews);
        } else if (viewInGlobalViews) {
            const updatedViews = globalViews.map(v =>
                v.id === input.id
                    ? {
                          ...v,
                          name: input.name ?? v.name,
                          filters: input.filters ?? v.filters,
                          searchTerm: input.searchTerm !== undefined ? input.searchTerm : v.searchTerm,
                          updatedAt: new Date(),
                      }
                    : v,
            );
            await saveGlobalViewMutation.mutateAsync(updatedViews);
        }
    };

    const deleteView = async (viewId: string) => {
        const userViews = userViewsData || [];
        const globalViews = globalViewsData || [];

        if (userViews.some(v => v.id === viewId)) {
            const updatedViews = userViews.filter(v => v.id !== viewId);
            await saveUserViewMutation.mutateAsync(updatedViews);
        } else if (globalViews.some(v => v.id === viewId)) {
            const updatedViews = globalViews.filter(v => v.id !== viewId);
            await saveGlobalViewMutation.mutateAsync(updatedViews);
        }
    };

    const duplicateView = async (viewId: string, newScope: 'user' | 'global') => {
        const allViews = [...(userViewsData || []), ...(globalViewsData || [])];
        const viewToDuplicate = allViews.find(v => v.id === viewId);

        if (viewToDuplicate) {
            const newView: SavedView = {
                ...viewToDuplicate,
                id: generateId(),
                name: `${viewToDuplicate.name} (Copy)`,
                scope: newScope,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            if (newScope === 'user') {
                const currentViews = userViewsData || [];
                await saveUserViewMutation.mutateAsync([...currentViews, newView]);
            } else {
                const currentViews = globalViewsData || [];
                await saveGlobalViewMutation.mutateAsync([...currentViews, newView]);
            }

            return newView;
        }
    };

    const applyView = (
        view: SavedView,
        setFilters: (filters: ColumnFiltersState) => void,
        setSearchTerm?: (term: string) => void,
    ) => {
        setFilters(view.filters);
        if (setSearchTerm && view.searchTerm !== undefined) {
            setSearchTerm(view.searchTerm);
        }
    };

    // Use UpdateSettings permission for managing global views
    const { hasPermissions } = usePermissions();
    const canManageGlobalViews = hasPermissions(['UpdateSettings']);

    return {
        userViews: userViewsData || [],
        globalViews: globalViewsData || [],
        isLoading: userViewsLoading || globalViewsLoading,
        saveView,
        updateView,
        deleteView,
        duplicateView,
        applyView,
        canManageGlobalViews,
    };
}
