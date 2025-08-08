import { CommandGroup, CommandEmpty } from '@/vdb/components/ui/command.js';
import { SearchResultItem } from './search-result-item.js';
import { useSearchContext } from '@/vdb/providers/search-provider.js';
import { SearchResultType } from '@/vdb/providers/search-provider.js';
import { useMemo } from 'react';

interface SearchResultsListProps {
    onResultSelect: () => void;
}

export function SearchResultsList({ onResultSelect }: SearchResultsListProps) {
    const { searchResults, isSearching, searchQuery } = useSearchContext();

    // Group results by type
    const groupedResults = useMemo(() => {
        const groups = new Map<SearchResultType, typeof searchResults>();
        
        searchResults.forEach(result => {
            if (!groups.has(result.type)) {
                groups.set(result.type, []);
            }
            groups.get(result.type)!.push(result);
        });

        // Sort groups by priority and results by relevance
        const sortedGroups = Array.from(groups.entries()).sort(([a], [b]) => {
            const priority = getTypePriority(a) - getTypePriority(b);
            return priority;
        });

        return sortedGroups.map(([type, results]) => [
            type,
            results.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
        ] as const);
    }, [searchResults]);

    if (isSearching) {
        return (
            <CommandGroup heading="Searching...">
                <CommandEmpty>Searching...</CommandEmpty>
            </CommandGroup>
        );
    }

    if (!searchQuery || searchQuery.length < 2) {
        return null;
    }

    if (searchResults.length === 0) {
        return <CommandEmpty>No results found.</CommandEmpty>;
    }

    return (
        <>
            {groupedResults.map(([type, results]) => (
                <CommandGroup 
                    key={type} 
                    heading={formatGroupHeading(type, results.length)}
                >
                    {results.map(result => (
                        <SearchResultItem
                            key={result.id}
                            result={result}
                            onSelect={onResultSelect}
                        />
                    ))}
                </CommandGroup>
            ))}
        </>
    );
}

function getTypePriority(type: SearchResultType): number {
    // Define priority order for result types
    const priorities: Record<SearchResultType, number> = {
        [SearchResultType.QUICK_ACTION]: 0,
        [SearchResultType.PRODUCT]: 1,
        [SearchResultType.CUSTOMER]: 2,
        [SearchResultType.ORDER]: 3,
        [SearchResultType.COLLECTION]: 4,
        [SearchResultType.PRODUCT_VARIANT]: 5,
        [SearchResultType.ASSET]: 6,
        [SearchResultType.ADMINISTRATOR]: 7,
        [SearchResultType.NAVIGATION]: 8,
        [SearchResultType.SETTINGS]: 9,
        [SearchResultType.FACET]: 10,
        [SearchResultType.FACET_VALUE]: 11,
        [SearchResultType.PROMOTION]: 12,
        [SearchResultType.PAYMENT_METHOD]: 13,
        [SearchResultType.SHIPPING_METHOD]: 14,
        [SearchResultType.TAX_CATEGORY]: 15,
        [SearchResultType.TAX_RATE]: 16,
        [SearchResultType.COUNTRY]: 17,
        [SearchResultType.ZONE]: 18,
        [SearchResultType.ROLE]: 19,
        [SearchResultType.CUSTOMER_GROUP]: 20,
        [SearchResultType.STOCK_LOCATION]: 21,
        [SearchResultType.TAG]: 22,
        [SearchResultType.CHANNEL]: 23,
        [SearchResultType.CUSTOM_ENTITY]: 24,
        [SearchResultType.DOCUMENTATION]: 25,
        [SearchResultType.BLOG_POST]: 26,
        [SearchResultType.PLUGIN]: 27,
        [SearchResultType.WEBSITE_CONTENT]: 28,
    };

    return priorities[type] ?? 999;
}

function formatGroupHeading(type: SearchResultType, count: number): string {
    const typeNames: Record<SearchResultType, string> = {
        [SearchResultType.PRODUCT]: 'Products',
        [SearchResultType.PRODUCT_VARIANT]: 'Product Variants',
        [SearchResultType.CUSTOMER]: 'Customers',
        [SearchResultType.ORDER]: 'Orders',
        [SearchResultType.COLLECTION]: 'Collections',
        [SearchResultType.ADMINISTRATOR]: 'Administrators',
        [SearchResultType.CHANNEL]: 'Channels',
        [SearchResultType.ASSET]: 'Assets',
        [SearchResultType.FACET]: 'Facets',
        [SearchResultType.FACET_VALUE]: 'Facet Values',
        [SearchResultType.PROMOTION]: 'Promotions',
        [SearchResultType.PAYMENT_METHOD]: 'Payment Methods',
        [SearchResultType.SHIPPING_METHOD]: 'Shipping Methods',
        [SearchResultType.TAX_CATEGORY]: 'Tax Categories',
        [SearchResultType.TAX_RATE]: 'Tax Rates',
        [SearchResultType.COUNTRY]: 'Countries',
        [SearchResultType.ZONE]: 'Zones',
        [SearchResultType.ROLE]: 'Roles',
        [SearchResultType.CUSTOMER_GROUP]: 'Customer Groups',
        [SearchResultType.STOCK_LOCATION]: 'Stock Locations',
        [SearchResultType.TAG]: 'Tags',
        [SearchResultType.CUSTOM_ENTITY]: 'Custom Entities',
        [SearchResultType.NAVIGATION]: 'Navigation',
        [SearchResultType.SETTINGS]: 'Settings',
        [SearchResultType.QUICK_ACTION]: 'Actions',
        [SearchResultType.DOCUMENTATION]: 'Documentation',
        [SearchResultType.BLOG_POST]: 'Blog Posts',
        [SearchResultType.PLUGIN]: 'Plugins',
        [SearchResultType.WEBSITE_CONTENT]: 'Website Content',
    };

    const name = typeNames[type] || type;
    return `${name} (${count})`;
}