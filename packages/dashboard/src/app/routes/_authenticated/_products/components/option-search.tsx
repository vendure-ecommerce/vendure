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
    query SearchProductOptions($options: ProductOptionListOptions) {
        productOptions(options: $options) {
            items {
                id
                name
                code
            }
            totalItems
        }
    }
`);

export const OptionSearch = forwardRef<HTMLInputElement, OptionSearchProps>(({ groupId, groupName, onSelect, selectedOptions, placeholder, disabled }, ref) => {
    const [search, setSearch] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [commandValue, setCommandValue] = useState<string>('');
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const debouncedSearch = useDebounce(search, 150);
    const { i18n } = useLingui();

    // Expose focus method via ref
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, []);

    const { data, isLoading } = useQuery({
        queryKey: ['productOptions', groupId, debouncedSearch],
        queryFn: () => api.query(searchProductOptionsDocument, {
            options: {
                filter: {
                    groupId: { eq: groupId },
                    name: { contains: debouncedSearch },
                },
                take: 30
            }
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

    const allOptions = data?.productOptions?.items || [];

    // Filter out already selected options
    const availableOptions = allOptions.filter(
        option => !selectedOptions?.some(selected => {
            if (selected.id && option.id) {
                // Both have IDs - compare IDs
                return selected.id === option.id;
            } else if (!selected.id && !option.id) {
                // Both are new - compare code (which is unique)
                return selected.code === option.code;
            }
            // One has ID, one doesn't - they're different
            return false;
        })
    );

    // Filter options based on search
    const filteredOptions = search
        ? availableOptions.filter(opt =>
            opt.name.toLowerCase().includes(search.toLowerCase()) ||
            opt.code.toLowerCase().includes(search.toLowerCase())
          )
        : availableOptions;

    const handleSelect = useCallback((option: Option) => {
        onSelect(option);
        setSearch('');
        setShowDropdown(false);
        // Keep focus on this input for continuous entry
        setTimeout(() => inputRef.current?.focus(), 100);
    }, [onSelect]);

    const handleCreateNew = useCallback(() => {
        if (search.trim()) {
            const baseCode = normalizeString(search.trim(), '-');
            let code = baseCode;
            let counter = 2;

            // Check if code already exists in API options or selected options
            const allExistingCodes = new Set([
                ...allOptions.map(opt => opt.code),
                ...(selectedOptions?.map(opt => opt.code) || [])
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
    }, [search, handleSelect, allOptions, selectedOptions]);

    // Build list of all possible values for navigation
    const allValues = [
        ...filteredOptions.map(o => o.code),
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
            const selectedOption = filteredOptions.find(o => o.code === commandValue);
            if (selectedOption) {
                handleSelect(selectedOption);
            }
            return;
        }

        if (search.trim()) {
            handleCreateNew();
        }
    }, [commandValue, search, handleCreateNew, filteredOptions, handleSelect]);

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
        <div className="relative" ref={containerRef}>
            <Input
                ref={inputRef}
                placeholder={placeholder || i18n.t(`Add option...`)}
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
                name="option-search"
            />

            {showDropdown && (
                <Command
                    className="absolute top-full h-auto left-0 right-0 mt-1 border rounded-md bg-background shadow-lg z-50"
                    shouldFilter={false}
                    value={commandValue}
                    onValueChange={setCommandValue}
                >
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
                                                value={option.code}
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
                                                    {groupId ? (
                                                        <Trans>Create "{search}"</Trans>
                                                    ) : (
                                                        <Trans>Add "{search}"</Trans>
                                                    )}
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
