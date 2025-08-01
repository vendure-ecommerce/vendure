import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/vdb/components/ui/command.js';
import { Input } from '@/vdb/components/ui/input.js';
import { api } from '@/vdb/graphql/api.js';
import { graphql } from '@/vdb/graphql/graphql.js';
import { Trans, useLingui } from '@/vdb/lib/trans.js';
import { normalizeString } from '@/vdb/lib/utils.js';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@uidotdev/usehooks';
import { Loader2, Plus } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface OptionGroup {
    id?: string;
    name: string;
    code: string;
}

interface GroupSearchProps {
    onSelect: (group: OptionGroup) => void;
    selectedGroups?: OptionGroup[];
    placeholder?: string;
    disabled?: boolean;
}

const searchProductOptionGroupsDocument = graphql(`
    query SearchProductOptionGroups($options: ProductOptionGroupListOptions) {
        productOptionGroups(options: $options) {
            items {
                id
                name
                code
            }
            totalItems
        }
    }
`);

export function GroupSearch({ onSelect, selectedGroups, placeholder, disabled }: GroupSearchProps) {
    const [search, setSearch] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const debouncedSearch = useDebounce(search, 300);
    const { i18n } = useLingui();

    const { data, isLoading } = useQuery({
        queryKey: ['optionGroups', debouncedSearch],
        queryFn: () => api.query(searchProductOptionGroupsDocument, {
            options: {
                filter: { name: { contains: debouncedSearch } },
                take: 10
            }
        }),
        enabled: !!debouncedSearch && debouncedSearch.length > 0
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const existingGroups = data?.productOptionGroups.items || [];

    // Filter out already selected groups
    const availableGroups = existingGroups.filter(
        group => !selectedGroups?.some(selected =>
            selected.id ? selected.id === group.id : selected.name === group.name
        )
    );

    const exactMatch = availableGroups.find(g =>
        g.name.toLowerCase() === search.toLowerCase()
    );

    const handleSelect = useCallback((group: OptionGroup) => {
        onSelect(group);
        setSearch('');
        setShowDropdown(false);
    }, [onSelect]);

    const handleCreateNew = useCallback(() => {
        if (search.trim()) {
            handleSelect({
                name: search.trim(),
                code: normalizeString(search.trim(), '-')
            });
        }
    }, [search, handleSelect]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown' && showDropdown) {
            e.preventDefault();
            // Focus first command item
            const firstItem = containerRef.current?.querySelector('[role="option"]') as HTMLElement;
            firstItem?.focus();
        } else if (e.key === 'Enter' && !exactMatch && search.trim()) {
            e.preventDefault();
            handleCreateNew();
        } else if (e.key === 'Escape') {
            setShowDropdown(false);
        }
    }, [search, exactMatch, handleCreateNew, showDropdown]);

    return (
        <div className="relative" ref={containerRef}>
            <Input
                ref={inputRef}
                placeholder={placeholder || i18n.t('Search or create option group...')}
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setShowDropdown(e.target.value.length > 0);
                }}
                onFocus={() => setShowDropdown(search.length > 0)}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                autoComplete="off"
            />

            {showDropdown && search && (
                <Command className="absolute top-full h-auto left-0 right-0 mt-1 border rounded-md bg-background shadow-lg z-50" shouldFilter={false}>
                    <CommandList className="max-h-60 overflow-auto">
                        {isLoading && (
                            <div className="flex items-center justify-center p-4 text-muted-foreground">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                <Trans>Searching...</Trans>
                            </div>
                        )}

                        {!isLoading && search && (
                            <>
                                {availableGroups.length > 0 && (
                                    <CommandGroup heading={i18n.t('Existing option groups')}>
                                        {availableGroups.map(group => (
                                            <CommandItem
                                                key={group.id}
                                                value={group.name}
                                                onSelect={() => handleSelect(group)}
                                            >
                                                <div>
                                                    <div className="font-medium">{group.name}</div>
                                                    <div className="text-xs text-muted-foreground">{group.code}</div>
                                                </div>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                )}

                                {!exactMatch && (
                                    <CommandGroup heading={i18n.t('Create new')}>
                                        <CommandItem
                                            value={`create-${search}`}
                                            onSelect={handleCreateNew}
                                            className="text-muted-foreground"
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            <div>
                                                <div className="font-medium">
                                                    <Trans>Create "{search}"</Trans>
                                                </div>
                                                <div className="text-xs">
                                                    {i18n.t('Code: {code}', { code: normalizeString(search, '-') })}
                                                </div>
                                            </div>
                                        </CommandItem>
                                    </CommandGroup>
                                )}

                                {availableGroups.length === 0 && !search && (
                                    <CommandEmpty>
                                        <Trans>Type to search option groups</Trans>
                                    </CommandEmpty>
                                )}

                                {!isLoading && search && availableGroups.length === 0 && (
                                    <CommandEmpty className="py-4">
                                        <div className="text-center">
                                            <p className="text-sm text-muted-foreground mb-2">
                                                <Trans>No option groups found</Trans>
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                <Trans>Press Enter to create "{search}"</Trans>
                                            </p>
                                        </div>
                                    </CommandEmpty>
                                )}
                            </>
                        )}
                    </CommandList>
                </Command>
            )}
        </div>
    );
}
