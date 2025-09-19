import { Badge } from '@/vdb/components/ui/badge.js';
import { Button } from '@/vdb/components/ui/button.js';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/vdb/components/ui/command.js';
import { Popover, PopoverContent, PopoverTrigger } from '@/vdb/components/ui/popover.js';
import { api } from '@/vdb/graphql/api.js';
import { Trans } from '@/vdb/lib/trans.js';
import { cn } from '@/vdb/lib/utils.js';
import { useQuery } from '@tanstack/react-query';
import { Check, Filter, X } from 'lucide-react';
import { useState } from 'react';
import { tagListDocument } from '../assets.graphql.js';

interface AssetTagFilterProps {
    selectedTags: string[];
    onTagsChange: (tags: string[]) => void;
}

export function AssetTagFilter({ selectedTags, onTagsChange }: Readonly<AssetTagFilterProps>) {
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    // Fetch available tags
    const { data: tagsData } = useQuery({
        queryKey: ['tags'],
        queryFn: () => api.query(tagListDocument, { options: { take: 100 } }),
        staleTime: 1000 * 60 * 5,
    });

    const availableTags = tagsData?.tags.items || [];

    // Filter tags based on search value
    const filteredTags = availableTags.filter(tag =>
        tag.value.toLowerCase().includes(searchValue.toLowerCase()),
    );

    const handleSelectTag = (tagValue: string) => {
        if (!selectedTags.includes(tagValue)) {
            onTagsChange([...selectedTags, tagValue]);
        }
        setSearchValue('');
    };

    const handleRemoveTag = (tagToRemove: string) => {
        onTagsChange(selectedTags.filter(tag => tag !== tagToRemove));
    };

    const handleClearAll = () => {
        onTagsChange([]);
        setOpen(false);
    };

    return (
        <div className="flex items-center gap-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        role="combobox"
                        aria-expanded={open}
                        className="justify-start"
                    >
                        <Filter className="h-4 w-4 mr-2" />
                        <Trans>Filter by tags</Trans>
                        {selectedTags.length > 0 && (
                            <Badge variant="secondary" className="ml-2">
                                {selectedTags.length}
                            </Badge>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="start">
                    <Command>
                        <CommandInput
                            placeholder="Search tags..."
                            value={searchValue}
                            onValueChange={setSearchValue}
                        />
                        <CommandEmpty>
                            <div className="p-2 text-sm">
                                <Trans>No tags found</Trans>
                            </div>
                        </CommandEmpty>
                        <CommandGroup>
                            {filteredTags.map(tag => {
                                const isSelected = selectedTags.includes(tag.value);
                                return (
                                    <CommandItem
                                        key={tag.id}
                                        onSelect={() => {
                                            if (isSelected) {
                                                handleRemoveTag(tag.value);
                                            } else {
                                                handleSelectTag(tag.value);
                                            }
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                isSelected ? 'opacity-100' : 'opacity-0',
                                            )}
                                        />
                                        {tag.value}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                        {selectedTags.length > 0 && (
                            <div className="border-t p-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={handleClearAll}
                                >
                                    <Trans>Clear all</Trans>
                                </Button>
                            </div>
                        )}
                    </Command>
                </PopoverContent>
            </Popover>

            {/* Display selected tags */}
            {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {selectedTags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                            <button
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    );
}
