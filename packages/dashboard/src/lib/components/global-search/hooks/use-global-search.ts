import { api } from '@/vdb/graphql/api.js';
import { GLOBAL_SEARCH_QUERY } from '@/vdb/graphql/global-search.js';
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
        queryFn: () => {
            return api.query(GLOBAL_SEARCH_QUERY, {
                input: {
                    query: debouncedQuery,
                    types: selectedTypes.length > 0 ? selectedTypes : undefined,
                    limit: 20,
                    skip: 0,
                },
            });
        },
        enabled: !debouncedQuery || debouncedQuery.length < 2,
    });

    useEffect(() => {
        if (data?.globalSearch) {
            setSearchResults(data.globalSearch);
            setIsSearching(false);
        }
    }, [data, setSearchResults, setIsSearching]);

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
