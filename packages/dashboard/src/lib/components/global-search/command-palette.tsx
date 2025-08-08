import {
    CommandDialog,
    CommandInput,
    CommandList,
    CommandSeparator,
} from '@/vdb/components/ui/command.js';
import { useSearchContext } from '@/vdb/providers/search-provider.js';
import { useGlobalSearch } from './hooks/use-global-search.js';
import { QuickActionsList } from './quick-actions-list.js';
import { SearchResultsList } from './search-results-list.js';
import { RecentSearches } from './recent-searches.js';
import { useEffect } from 'react';

interface CommandPaletteProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ isOpen, onOpenChange }: CommandPaletteProps) {
    const { 
        searchQuery, 
        setSearchQuery,
        setSearchResults,
        setIsSearching
    } = useSearchContext();
    
    const { hasQuery } = useGlobalSearch();

    // Clear search state when dialog closes
    useEffect(() => {
        if (!isOpen) {
            setSearchQuery('');
            setSearchResults([]);
            setIsSearching(false);
        }
    }, [isOpen, setSearchQuery, setSearchResults, setIsSearching]);

    const handleClose = () => {
        onOpenChange(false);
    };

    const handleResultSelect = () => {
        handleClose();
    };

    const handleActionSelect = () => {
        handleClose();
    };

    return (
        <CommandDialog
            open={isOpen}
            onOpenChange={onOpenChange}
            title="Command Palette"
            description="Search for entities, quick actions, and more..."
        >
            <CommandInput
                placeholder="Search products, customers, orders, or type a command..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="border-0"
            />
            
            <CommandList className="max-h-[400px]">
                {/* Quick Actions - Always shown first, filtered by search query */}
                <QuickActionsList 
                    searchQuery={searchQuery}
                    onActionSelect={handleActionSelect}
                />

                {/* Separator between actions and search results */}
                {hasQuery && <CommandSeparator />}

                {/* Search Results - Only shown when there's a query */}
                {hasQuery && (
                    <SearchResultsList onResultSelect={handleResultSelect} />
                )}

                {/* Recent Searches - Only shown when there's no query */}
                {!hasQuery && <RecentSearches onSearchSelect={setSearchQuery} />}
            </CommandList>
        </CommandDialog>
    );
}