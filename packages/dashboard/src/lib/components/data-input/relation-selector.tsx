import { Button } from '@/vdb/components/ui/button.js';
import { Checkbox } from '@/vdb/components/ui/checkbox.js';
import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/vdb/components/ui/command.js';
import { Popover, PopoverContent, PopoverTrigger } from '@/vdb/components/ui/popover.js';
import { getQueryName } from '@/vdb/framework/document-introspection/get-document-structure.js';
import { api } from '@/vdb/graphql/api.js';
import { Trans } from '@/vdb/lib/trans.js';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useDebounce } from '@uidotdev/usehooks';
import type { DocumentNode } from 'graphql';
import { CheckIcon, Loader2, Plus, X } from 'lucide-react';
import React, { useState } from 'react';

export interface RelationSelectorConfig<T = any> {
    /** The GraphQL query document for fetching items */
    listQuery: DocumentNode;
    /** The property key for the entity ID */
    idKey: keyof T;
    /** The property key for the display label */
    labelKey: keyof T;
    /** Number of items to load per page */
    pageSize?: number;
    /** Placeholder text for the search input */
    placeholder?: string;
    /** Whether to enable multi-select mode */
    multiple?: boolean;
    /** Custom filter function for search */
    buildSearchFilter?: (searchTerm: string) => any;
}

export interface RelationSelectorProps<T = any> {
    config: RelationSelectorConfig<T>;
    value?: string | string[];
    onChange: (value: string | string[]) => void;
    disabled?: boolean;
    className?: string;
}

export interface RelationSelectorItemProps<T = any> {
    item: T;
    config: RelationSelectorConfig<T>;
    isSelected: boolean;
    onSelect: () => void;
    showCheckbox?: boolean;
}

/**
 * Abstract relation selector item component
 */
export function RelationSelectorItem<T>({
    item,
    config,
    isSelected,
    onSelect,
    showCheckbox = false,
}: RelationSelectorItemProps<T>) {
    const id = String(item[config.idKey]);
    const label = String(item[config.labelKey]);

    return (
        <CommandItem key={id} value={id} onSelect={onSelect} className="flex items-center gap-2">
            {showCheckbox && (
                <Checkbox
                    checked={isSelected}
                    onChange={onSelect}
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                />
            )}
            {isSelected && !showCheckbox && <CheckIcon className="h-4 w-4" />}
            <span className="flex-1">{label}</span>
        </CommandItem>
    );
}

/**
 * Hook for managing relation selector state and queries
 */
export function useRelationSelector<T>(config: RelationSelectorConfig<T>) {
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 300);

    const pageSize = config.pageSize ?? 25;

    // Build the default search filter if none provided
    const buildFilter =
        config.buildSearchFilter ??
        ((term: string) => ({
            [config.labelKey]: { contains: term },
        }));

    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, error } = useInfiniteQuery({
        queryKey: ['relationSelector', getQueryName(config.listQuery), debouncedSearch],
        queryFn: async ({ pageParam = 0 }) => {
            const variables: any = {
                options: {
                    skip: pageParam * pageSize,
                    take: pageSize,
                    sort: { [config.labelKey]: 'ASC' },
                },
            };

            // Add search filter if there's a search term
            if (debouncedSearch.trim().length > 0) {
                variables.options.filter = buildFilter(debouncedSearch.trim());
            }

            const response = (await api.query(config.listQuery, variables)) as any;
            return response[getQueryName(config.listQuery)];
        },
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage) return undefined;
            const totalFetched = allPages.length * pageSize;
            return totalFetched < lastPage.totalItems ? allPages.length : undefined;
        },
        initialPageParam: 0,
    });

    const items = data?.pages.flatMap(page => page?.items ?? []) ?? [];

    return {
        items,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        error,
        searchTerm,
        setSearchTerm,
    };
}

/**
 * Abstract relation selector component
 */
export function RelationSelector<T>({
    config,
    value,
    onChange,
    disabled,
    className,
}: RelationSelectorProps<T>) {
    const [open, setOpen] = useState(false);
    const isMultiple = config.multiple ?? false;

    const { items, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, searchTerm, setSearchTerm } =
        useRelationSelector(config);

    // Normalize value to always be an array for easier handling
    const selectedIds = React.useMemo(() => {
        if (isMultiple) {
            return Array.isArray(value) ? value : value ? [value] : [];
        }
        return value ? [String(value)] : [];
    }, [value, isMultiple]);

    const handleSelect = (item: T) => {
        const itemId = String(item[config.idKey]);

        if (isMultiple) {
            const newSelectedIds = selectedIds.includes(itemId)
                ? selectedIds.filter(id => id !== itemId)
                : [...selectedIds, itemId];
            onChange(newSelectedIds);
        } else {
            onChange(itemId);
            setOpen(false);
            setSearchTerm('');
        }
    };

    const handleRemove = (itemId: string) => {
        if (isMultiple) {
            const newSelectedIds = selectedIds.filter(id => id !== itemId);
            onChange(newSelectedIds);
        } else {
            onChange('');
        }
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        const scrolledToBottom = Math.abs(target.scrollHeight - target.clientHeight - target.scrollTop) < 1;

        if (scrolledToBottom && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    // Get selected items for display
    const selectedItems = React.useMemo(() => {
        return items.filter(item => selectedIds.includes(String(item[config.idKey])));
    }, [items, selectedIds, config.idKey]);

    return (
        <div className={className}>
            {/* Display selected items */}
            {selectedItems.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                    {selectedItems.map(item => {
                        const itemId = String(item[config.idKey]);
                        const label = String(item[config.labelKey]);
                        return (
                            <div
                                key={itemId}
                                className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                            >
                                <span>{label}</span>
                                {!disabled && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemove(itemId)}
                                        className="text-secondary-foreground/70 hover:text-secondary-foreground"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Selector trigger */}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" type="button" disabled={disabled} className="gap-2">
                        <Plus className="h-4 w-4" />
                        <Trans>
                            {isMultiple
                                ? selectedItems.length > 0
                                    ? `Add more (${selectedItems.length} selected)`
                                    : 'Select items'
                                : selectedItems.length > 0
                                  ? 'Change selection'
                                  : 'Select item'}
                        </Trans>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[400px]" align="start">
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder={config.placeholder ?? 'Search...'}
                            value={searchTerm}
                            onValueChange={setSearchTerm}
                            disabled={disabled}
                        />
                        <CommandList className="h-[300px] overflow-y-auto" onScroll={handleScroll}>
                            <CommandEmpty>
                                {isLoading ? (
                                    <div className="flex items-center justify-center py-6">
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        <Trans>Loading...</Trans>
                                    </div>
                                ) : (
                                    <Trans>No results found</Trans>
                                )}
                            </CommandEmpty>

                            {items.map(item => {
                                const itemId = String(item[config.idKey]);
                                const isSelected = selectedIds.includes(itemId);

                                return (
                                    <RelationSelectorItem
                                        key={itemId}
                                        item={item}
                                        config={config}
                                        isSelected={isSelected}
                                        onSelect={() => handleSelect(item)}
                                        showCheckbox={isMultiple}
                                    />
                                );
                            })}

                            {(isFetchingNextPage || isLoading) && (
                                <div className="flex items-center justify-center py-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                </div>
                            )}

                            {!hasNextPage && items.length > 0 && (
                                <div className="text-center py-2 text-sm text-muted-foreground">
                                    <Trans>No more items</Trans>
                                </div>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}

/**
 * Utility function to create a relation selector configuration
 */
export function createRelationSelectorConfig<T>(
    config: RelationSelectorConfig<T>,
): RelationSelectorConfig<T> {
    return config;
}
