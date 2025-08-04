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
    const [commandValue, setCommandValue] = useState<string>('');
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const debouncedSearch = useDebounce(search, 150);
    const { i18n } = useLingui();

    const { data, isLoading } = useQuery({
        queryKey: ['optionGroups', debouncedSearch],
        queryFn: () => api.query(searchProductOptionGroupsDocument, {
            options: {
                filter: debouncedSearch ? { name: { contains: debouncedSearch } } : undefined,
                take: 30
            }
        })
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

    const handleSelect = useCallback((group: OptionGroup) => {
        onSelect(group);
        setSearch('');
        setShowDropdown(false);
    }, [onSelect]);

    const handleCreateNew = useCallback(() => {
        if (search.trim()) {
            const baseCode = normalizeString(search.trim(), '-');
            let code = baseCode;
            let counter = 2;

            // Check if code already exists in API groups or selected groups
            const allExistingCodes = new Set([
                ...existingGroups.map(group => group.code),
                ...(selectedGroups?.map(group => group.code) || [])
            ]);

            // Generate unique code
            while (allExistingCodes.has(code)) {
                code = `${baseCode}-${counter}`;
                counter++;
            }

            handleSelect({
                name: search.trim(),
                code
            });
        }
    }, [search, handleSelect, existingGroups, selectedGroups]);

    // Build list of all possible values for navigation
    const allValues = [
        ...availableGroups.map(g => g.code),
        ...(search ? [`create-${search}`] : [])
    ];

    const handleArrowNavigation = useCallback((direction: 'up' | 'down') => {
        if (!showDropdown || allValues.length === 0) return;

        const currentIndex = allValues.indexOf(commandValue);
        let nextIndex: number;

        if (direction === 'down') {
            nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % allValues.length;
        } else {
            nextIndex = currentIndex === -1 ? allValues.length - 1 : (currentIndex - 1 + allValues.length) % allValues.length;
        }

        setCommandValue(allValues[nextIndex]);
    }, [showDropdown, commandValue, allValues]);

    const handleEnterKey = useCallback(() => {
        if (commandValue === `create-${search}`) {
            handleCreateNew();
            return;
        }

        if (commandValue) {
            const selectedGroup = availableGroups.find(g => g.code === commandValue);
            if (selectedGroup) {
                handleSelect(selectedGroup);
            }
            return;
        }

        if (search.trim()) {
            handleCreateNew();
        }
    }, [commandValue, search, handleCreateNew, availableGroups, handleSelect]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                handleArrowNavigation('down');
                break;
            case 'ArrowUp':
                e.preventDefault();
                handleArrowNavigation('up');
                break;
            case 'Enter':
                e.preventDefault();
                handleEnterKey();
                break;
            case 'Tab':
                setShowDropdown(false);
                setCommandValue('');
                break;
        }
    }, [handleArrowNavigation, handleEnterKey]);

    return (
        <div
            className="relative"
            ref={containerRef}
        >
            <Input
                ref={inputRef}
                placeholder={placeholder || i18n.t('Search or create option group...')}
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setShowDropdown(true);
                    setCommandValue('');
                }}
                onFocus={() => setShowDropdown(true)}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                autoComplete="off"
            />

            {showDropdown && (
                <Command
                    className="absolute top-full h-auto left-0 right-0 mt-1 border rounded-md bg-background shadow-lg z-50"
                    shouldFilter={false}
                    value={commandValue}
                    onValueChange={setCommandValue}
                >
                    <CommandList className="max-h-60 overflow-auto">
                        {isLoading && (
                            <div className="flex items-center justify-center p-4 text-muted-foreground">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                <Trans>Searching...</Trans>
                            </div>
                        )}

                        {!isLoading && (
                            <>
                                {availableGroups.length > 0 && (
                                    <CommandGroup heading={i18n.t('Existing option groups')}>
                                        {availableGroups.map(group => (
                                            <CommandItem
                                                key={group.id}
                                                value={group.code}
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

                                {search && (
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
                                            </div>
                                        </CommandItem>
                                    </CommandGroup>
                                )}

                                {!search && availableGroups.length === 0 && (
                                    <CommandEmpty>
                                        <Trans>No option groups available</Trans>
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
