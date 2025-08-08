import { GlobalSearchResult } from '@/vdb/graphql/global-search.js';
import { useDebounce } from '@/vdb/hooks/use-debounce.js';
import { useSearchContext } from '@/vdb/providers/search-provider.js';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export const useGlobalSearch = () => {
    const { searchQuery, setSearchResults, setIsSearching, selectedTypes, addRecentSearch } =
        useSearchContext();

    const debouncedQuery = useDebounce(searchQuery, 300);

    const { data, isLoading, error } = useQuery({
        queryKey: ['globalSearch', debouncedQuery, selectedTypes],
        queryFn: async (): Promise<{ globalSearch: GlobalSearchResult[] }> => {
            // For now, return mock data until backend is implemented
            // In the future, this will be: return api.query(GLOBAL_SEARCH_QUERY, { input: ... });
            if (!debouncedQuery || debouncedQuery.length < 2) {
                return { globalSearch: [] };
            }

            // TODO: Replace with actual API call once backend is implemented
            // return api.query(GLOBAL_SEARCH_QUERY, {
            //     input: {
            //         query: debouncedQuery,
            //         types: selectedTypes.length > 0 ? selectedTypes : undefined,
            //         limit: 20,
            //         skip: 0,
            //     },
            // });

            // Mock response for development
            await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
            return {
                globalSearch: [
                    {
                        id: 'mock-product-1',
                        type: 'PRODUCT',
                        title: `Mock Product matching "${debouncedQuery}"`,
                        subtitle: 'SKU: MOCK-001',
                        description: 'This is a mock product for testing the search interface',
                        url: '/products/1',
                        relevanceScore: 0.9,
                        lastModified: new Date().toISOString(),
                    },
                    {
                        id: 'mock-customer-1',
                        type: 'CUSTOMER',
                        title: `Mock Customer "${debouncedQuery}"`,
                        subtitle: 'customer@example.com',
                        description: 'This is a mock customer for testing',
                        url: '/customers/1',
                        relevanceScore: 0.8,
                        lastModified: new Date().toISOString(),
                    },
                ],
            };
        },
        enabled: debouncedQuery.length >= 2,
    });

    useEffect(() => {
        if (data?.globalSearch) {
            setSearchResults(data.globalSearch);
            setIsSearching(false);

            // Add to recent searches if query was successful and returned results
            if (debouncedQuery && data.globalSearch.length > 0) {
                addRecentSearch(debouncedQuery);
            }
        }
    }, [data, setSearchResults, setIsSearching, debouncedQuery, addRecentSearch]);

    // Update loading state
    useEffect(() => {
        if (debouncedQuery && debouncedQuery.length >= 2) {
            setIsSearching(isLoading);
        } else {
            setIsSearching(false);
            setSearchResults([]);
        }
    }, [isLoading, debouncedQuery, setIsSearching, setSearchResults]);

    return {
        results: data?.globalSearch || [],
        loading: isLoading,
        error,
        totalCount: data?.globalSearch?.length || 0,
        hasQuery: debouncedQuery.length >= 2,
    };
};
