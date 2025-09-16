import { Button } from '@/vdb/components/ui/button.js';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/vdb/components/ui/command.js';
import { Popover, PopoverContent, PopoverTrigger } from '@/vdb/components/ui/popover.js';
import { api } from '@/vdb/graphql/api.js';
import { graphql } from '@/vdb/graphql/graphql.js';
import { Trans } from '@/vdb/lib/trans.js';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useDebounce } from '@uidotdev/usehooks';
import { ChevronRight, Loader2, Plus } from 'lucide-react';
import React, { useState } from 'react';

export interface FacetValue {
    id: string;
    name: string;
    code: string;
    facet: Facet;
}

export interface Facet {
    id: string;
    name: string;
    code: string;
}

/**
 * @description
 * A component for selecting facet values.
 *
 * @docsCategory components
 * @docsPage FacetValueSelector
 * @since 3.4.0
 */
interface FacetValueSelectorProps {
    /**
     * @description
     * The function to call when a facet value is selected.
     * 
     * The `value` will have the following structure:
     * 
     * ```ts
     * {
     *     id: string;
     *     name: string;
     *     code: string;
     *     facet: {
     *         id: string;
     *         name: string;
     *         code: string;
     *     };
     * }
     * ```
     */
    onValueSelect: (value: FacetValue) => void;
    /**
     * @description
     * Whether the selector is disabled.
     */
    disabled?: boolean;
    /**
     * @description
     * The placeholder text for the selector.
     */
    placeholder?: string;
    /**
     * @description
     * The number of facet values to display per page.
     * 
     * @default 4
     */
    pageSize?: number;
}

const getFacetValueListDocument = graphql(`
    query GetFacetValueList($options: FacetValueListOptions) {
        facetValues(options: $options) {
            items {
                id
                name
                code
                facet {
                    id
                    name
                    code
                }
            }
            totalItems
        }
    }
`);

const getFacetListDocument = graphql(`
    query GetFacetList($options: FacetListOptions) {
        facets(options: $options) {
            items {
                id
                name
                code
            }
            totalItems
        }
    }
`);

const getFacetValuesForFacetDocument = graphql(`
    query GetFacetValuesForFacet($options: FacetValueListOptions) {
        facetValues(options: $options) {
            items {
                id
                name
                code
                facet {
                    id
                    name
                    code
                }
            }
            totalItems
        }
    }
`);

/**
 * @description
 * A component for selecting facet values.
 * 
 * @example
 * ```tsx
 * <FacetValueSelector onValueSelect={onValueSelectHandler} disabled={disabled} />
 * ```
 *
 * @docsCategory components
 * @docsPage FacetValueSelector
 * @docsWeight 0
 * @since 3.4.0
 */
export function FacetValueSelector({
    onValueSelect,
    disabled,
    placeholder = 'Search facet values...',
    pageSize = 4,
}: FacetValueSelectorProps) {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedFacetId, setExpandedFacetId] = useState<string | null>(null);
    const debouncedSearch = useDebounce(searchTerm, 200);

    // Query for facet values based on search
    const { data: facetValueData, isLoading: isLoadingFacetValues } = useQuery({
        queryKey: ['facetValues', debouncedSearch],
        queryFn: () => {
            if (debouncedSearch.length < 2) {
                return { facetValues: { items: [], totalItems: 0 } };
            }
            return api.query(getFacetValueListDocument, {
                options: {
                    filter: {
                        name: { contains: debouncedSearch },
                    },
                    take: 100,
                },
            });
        },
        enabled: debouncedSearch.length >= 2 && !expandedFacetId,
    });

    // Query for facets based on search
    const { data: facetData, isLoading: isLoadingFacets } = useQuery({
        queryKey: ['facets', debouncedSearch],
        queryFn: () => {
            if (debouncedSearch.length < 2) {
                return { facets: { items: [], totalItems: 0 } };
            }
            return api.query(getFacetListDocument, {
                options: {
                    filter: {
                        name: { contains: debouncedSearch },
                    },
                    take: 100,
                },
            });
        },
        enabled: debouncedSearch.length >= 2 && !expandedFacetId,
    });

    // Query for paginated values of a specific facet when expanded
    const {
        data: expandedFacetData,
        isLoading: isLoadingExpandedFacet,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['facetValues', expandedFacetId, 'infinite'],
        queryFn: async ({ pageParam = 0 }) => {
            if (!expandedFacetId) return null;
            const response = await api.query(getFacetValuesForFacetDocument, {
                options: {
                    filter: { facetId: { eq: expandedFacetId } },
                    sort: { code: 'ASC' },
                    skip: pageParam * pageSize,
                    take: pageSize,
                },
            });
            return response.facetValues;
        },
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage) return undefined;
            const totalFetched = allPages.length * pageSize;
            return totalFetched < lastPage.totalItems ? allPages.length : undefined;
        },
        enabled: !!expandedFacetId,
        initialPageParam: 0,
    });

    const facetValues = facetValueData?.facetValues.items ?? [];
    const facets = facetData?.facets.items ?? [];
    const expandedFacetValues = expandedFacetData?.pages.flatMap(page => page?.items ?? []) ?? [];
    const expandedFacetName = expandedFacetValues[0]?.facet.name;

    // Group facet values by facet
    const facetGroups = facetValues.reduce<Record<string, FacetValue[]>>(
        (groups: Record<string, FacetValue[]>, facetValue: FacetValue) => {
            const facetId = facetValue.facet.id;
            if (!groups[facetId]) {
                groups[facetId] = [];
            }
            groups[facetId].push(facetValue);
            return groups;
        },
        {},
    );

    const isLoading = isLoadingFacetValues || isLoadingFacets || isLoadingExpandedFacet;

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        const scrolledToBottom = Math.abs(target.scrollHeight - target.clientHeight - target.scrollTop) < 1;

        if (scrolledToBottom && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" type="button" disabled={disabled} className="gap-2">
                    <Plus className="h-4 w-4" />
                    <Trans>Add facet values</Trans>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[400px]" align="start">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder={placeholder}
                        value={searchTerm}
                        onValueChange={value => {
                            setSearchTerm(value);
                            setExpandedFacetId(null);
                        }}
                        disabled={disabled}
                    />
                    <CommandList className="h-[200px] overflow-y-auto" onScroll={handleScroll}>
                        <CommandEmpty>
                            {debouncedSearch.length < 2 ? (
                                <Trans>Type at least 2 characters to search...</Trans>
                            ) : isLoading ? (
                                <Trans>Loading...</Trans>
                            ) : (
                                <Trans>No results found</Trans>
                            )}
                        </CommandEmpty>

                        {expandedFacetId ? (
                            <>
                                <CommandGroup>
                                    <CommandItem
                                        onSelect={() => setExpandedFacetId(null)}
                                        className="cursor-pointer"
                                    >
                                        ← <Trans>Back to search</Trans>
                                    </CommandItem>
                                </CommandGroup>
                                <CommandGroup heading={expandedFacetName}>
                                    {expandedFacetValues.map(facetValue => (
                                        <CommandItem
                                            key={facetValue.id}
                                            value={facetValue.id}
                                            onSelect={() => {
                                                onValueSelect(facetValue);
                                                setSearchTerm('');
                                                setExpandedFacetId(null);
                                                setOpen(false);
                                            }}
                                        >
                                            {facetValue.name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                                {(isFetchingNextPage || isLoadingExpandedFacet) && (
                                    <div className="flex items-center justify-center py-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    </div>
                                )}
                                {!hasNextPage && expandedFacetValues.length > 0 && (
                                    <div className="text-center py-2 text-sm text-muted-foreground">
                                        <Trans>No more items</Trans>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                {facets.length > 0 && (
                                    <CommandGroup heading={<Trans>Facets</Trans>}>
                                        {facets.map(facet => (
                                            <CommandItem
                                                key={facet.id}
                                                value={`facet-${facet.id}`}
                                                onSelect={() => setExpandedFacetId(facet.id)}
                                                className="cursor-pointer"
                                            >
                                                <span className="flex-1">{facet.name}</span>
                                                <ChevronRight className="h-4 w-4" />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                )}

                                {Object.entries(facetGroups).map(
                                    ([facetId, values]: [string, FacetValue[]]) => (
                                        <CommandGroup key={facetId} heading={values[0]?.facet.name}>
                                            {values.map((facetValue: FacetValue) => (
                                                <CommandItem
                                                    key={facetValue.id}
                                                    value={facetValue.id}
                                                    onSelect={() => {
                                                        onValueSelect(facetValue);
                                                        setSearchTerm('');
                                                        setOpen(false);
                                                    }}
                                                >
                                                    {facetValue.name}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    ),
                                )}
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
