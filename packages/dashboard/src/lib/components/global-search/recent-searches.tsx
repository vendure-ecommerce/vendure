import { CommandGroup, CommandItem, CommandEmpty } from '@/vdb/components/ui/command.js';
import { Button } from '@/vdb/components/ui/button.js';
import { useSearchContext } from '@/vdb/providers/search-provider.js';
import { Clock, X } from 'lucide-react';

interface RecentSearchesProps {
    onSearchSelect: (query: string) => void;
}

export function RecentSearches({ onSearchSelect }: RecentSearchesProps) {
    const { recentSearches, clearRecentSearches } = useSearchContext();

    if (recentSearches.length === 0) {
        return (
            <CommandGroup heading="Getting Started">
                <CommandEmpty className="py-6 text-center">
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Start typing to search products, customers, orders, and more...
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Use <kbd className="px-2 py-1 text-xs bg-muted rounded">⌘K</kbd> to open this anytime
                        </p>
                    </div>
                </CommandEmpty>
            </CommandGroup>
        );
    }

    return (
        <CommandGroup 
            heading={
                <div className="flex items-center justify-between">
                    <span>Recent Searches</span>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-1 text-xs"
                        onClick={clearRecentSearches}
                    >
                        Clear
                    </Button>
                </div>
            }
        >
            {recentSearches.map((query, index) => (
                <CommandItem
                    key={`${query}-${index}`}
                    value={query}
                    onSelect={() => onSearchSelect(query)}
                    className="flex items-center gap-2 p-3"
                >
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 text-sm">{query}</span>
                </CommandItem>
            ))}
        </CommandGroup>
    );
}