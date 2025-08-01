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
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

export interface Option {
    id?: string;
    name: string;
    code: string;
}

interface OptionSearchProps {
    groupId?: string;
    groupName: string;
    onSelect: (option: Option) => void;
    selectedOptions?: Option[];
    placeholder?: string;
    disabled?: boolean;
}

const searchProductOptionsDocument = graphql(`
    query SearchProductOptions($groupId: ID!) {
        productOptionGroup(id: $groupId) {
            id
            options {
                id
                name
                code
            }
        }
    }
`);

export const OptionSearch = forwardRef<HTMLInputElement, OptionSearchProps>(({ groupId, groupName, onSelect, selectedOptions, placeholder, disabled }, ref) => {
    const [search, setSearch] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const debouncedSearch = useDebounce(search, 300);
    const { i18n } = useLingui();

    // Expose focus method via ref
    useImperativeHandle(ref, () => inputRef.current!, []);

    const { data, isLoading } = useQuery({
        queryKey: ['productOptions', groupId],
        queryFn: () => api.query(searchProductOptionsDocument, {
            groupId: groupId!
        }),
        enabled: !!groupId
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

    const allOptions = data?.productOptionGroup?.options || [];

    // Filter out already selected options
    const availableOptions = allOptions.filter(
        option => !selectedOptions?.some(selected =>
            selected.id ? selected.id === option.id : selected.name === option.name
        )
    );

    // Filter options based on search
    const filteredOptions = search
        ? availableOptions.filter(opt =>
            opt.name.toLowerCase().includes(search.toLowerCase()) ||
            opt.code.toLowerCase().includes(search.toLowerCase())
          )
        : availableOptions;

    const exactMatch = filteredOptions.find(o =>
        o.name.toLowerCase() === search.toLowerCase()
    );

    const handleSelect = useCallback((option: Option) => {
        onSelect(option);
        setSearch('');
        setShowDropdown(false);
        // Keep focus on this input for continuous entry
        setTimeout(() => inputRef.current?.focus(), 100);
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
                placeholder={placeholder || i18n.t('Add {groupName} option...', { groupName })}
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
                        {isLoading && groupId && (
                            <div className="flex items-center justify-center p-4 text-muted-foreground">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                <Trans>Loading options...</Trans>
                            </div>
                        )}

                        {!isLoading && (
                            <>
                                {filteredOptions.length > 0 && (
                                    <CommandGroup heading={groupId ? i18n.t('Existing options') : i18n.t('Options')}>
                                        {filteredOptions.map(option => (
                                            <CommandItem
                                                key={option.id}
                                                value={option.name}
                                                onSelect={() => handleSelect(option)}
                                            >
                                                <div>
                                                    <div className="font-medium">{option.name}</div>
                                                    <div className="text-xs text-muted-foreground">{option.code}</div>
                                                </div>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                )}

                                {search && !exactMatch && (
                                    <CommandGroup heading={i18n.t('Create new')}>
                                        <CommandItem
                                            value={`create-${search}`}
                                            onSelect={handleCreateNew}
                                            className="text-muted-foreground"
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            <div>
                                                <div className="font-medium">
                                                    {groupId ? (
                                                        <Trans>Create "{search}"</Trans>
                                                    ) : (
                                                        <Trans>Add "{search}"</Trans>
                                                    )}
                                                </div>
                                                <div className="text-xs">
                                                    {i18n.t('Code: {code}', { code: normalizeString(search, '-') })}
                                                </div>
                                            </div>
                                        </CommandItem>
                                    </CommandGroup>
                                )}

                                {!search && filteredOptions.length === 0 && (
                                    <CommandEmpty>
                                        <Trans>Type to add options</Trans>
                                    </CommandEmpty>
                                )}

                                {search && filteredOptions.length === 0 && (
                                    <CommandEmpty className="py-4">
                                        <div className="text-center">
                                            <p className="text-sm text-muted-foreground mb-2">
                                                <Trans>No options found</Trans>
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
});

OptionSearch.displayName = 'OptionSearch';
