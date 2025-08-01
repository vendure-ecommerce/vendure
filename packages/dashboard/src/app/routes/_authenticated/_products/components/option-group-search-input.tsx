import { Badge } from '@/vdb/components/ui/badge.js';
import { Button } from '@/vdb/components/ui/button.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/vdb/components/ui/card.js';
import { Label } from '@/vdb/components/ui/label.js';
import { Trans } from '@/vdb/lib/trans.js';
import { cn } from '@/vdb/lib/utils.js';
import { X } from 'lucide-react';
import { useRef, useState } from 'react';

import { GroupSearch, type OptionGroup } from './group-search.js';
import { OptionSearch, type Option } from './option-search.js';

export interface SelectedOption extends Option {}

export interface SelectedOptionGroup extends OptionGroup {
    options: SelectedOption[];
}

interface OptionGroupSearchInputProps {
    value: SelectedOptionGroup[];
    onChange: (groups: SelectedOptionGroup[]) => void;
    disabled?: boolean;
}

export function OptionGroupSearchInput({ value, onChange, disabled }: OptionGroupSearchInputProps) {
    const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set());
    const optionSearchRefs = useRef<Array<HTMLInputElement | null>>([]);

    const handleAddGroup = (group: OptionGroup) => {
        const newGroup: SelectedOptionGroup = {
            ...group,
            options: [],
        };
        const newGroupIndex = value.length;
        onChange([...value, newGroup]);
        // Expand the newly added group
        setExpandedGroups(new Set([...expandedGroups, newGroupIndex]));
        // Focus the option search input after the component updates
        setTimeout(() => {
            const optionSearchInput = optionSearchRefs.current[newGroupIndex];
            if (optionSearchInput) {
                optionSearchInput.focus();
            }
        }, 100);
    };

    const handleAddOption = (groupIndex: number, option: Option) => {
        const newGroups = [...value];
        newGroups[groupIndex] = {
            ...newGroups[groupIndex],
            options: [...newGroups[groupIndex].options, option],
        };
        onChange(newGroups);
    };

    const handleRemoveGroup = (index: number) => {
        const newGroups = [...value];
        newGroups.splice(index, 1);
        onChange(newGroups);
        // Update expanded state
        const newExpanded = new Set(expandedGroups);
        newExpanded.delete(index);
        setExpandedGroups(newExpanded);
    };

    const handleRemoveOption = (groupIndex: number, optionIndex: number) => {
        const newGroups = [...value];
        newGroups[groupIndex].options.splice(optionIndex, 1);
        onChange(newGroups);
    };

    const toggleGroupExpanded = (index: number) => {
        const newExpanded = new Set(expandedGroups);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedGroups(newExpanded);
    };

    return (
        <div className="space-y-4">
            {/* Selected option groups */}
            {value.map((group, groupIndex) => (
                <Card
                    key={group.id || groupIndex}
                    className={cn('transition-all', expandedGroups.has(groupIndex) ? '' : 'hover:shadow-md')}
                >
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-medium flex items-center gap-2">
                                {group.name}
                                {!group.id && (
                                    <Badge variant="outline" className="text-xs">
                                        <Trans>New</Trans>
                                    </Badge>
                                )}
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleGroupExpanded(groupIndex)}
                                >
                                    {expandedGroups.has(groupIndex) ? (
                                        <Trans>Collapse</Trans>
                                    ) : (
                                        <Trans>Expand</Trans>
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveGroup(groupIndex)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    {expandedGroups.has(groupIndex) && (
                        <CardContent>
                            {/* Selected options */}
                            {group.options.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {group.options.map((option, optionIndex) => (
                                        <Badge
                                            key={option.id || optionIndex}
                                            variant="secondary"
                                            className="flex items-center gap-1 pr-1"
                                        >
                                            {option.name}
                                            {!option.id && (
                                                <span className="text-xs text-muted-foreground ml-1">
                                                    <Trans>(new)</Trans>
                                                </span>
                                            )}
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-4 w-4 p-0 ml-1 hover:bg-secondary-foreground/20"
                                                onClick={() => handleRemoveOption(groupIndex, optionIndex)}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            {/* Option search */}
                            <OptionSearch
                                ref={el => {
                                    optionSearchRefs.current[groupIndex] = el;
                                }}
                                groupId={group.id}
                                groupName={group.name}
                                onSelect={option => handleAddOption(groupIndex, option)}
                                selectedOptions={group.options}
                                disabled={disabled}
                            />
                        </CardContent>
                    )}
                </Card>
            ))}

            {/* Add option group */}
            <Card className="border-dashed">
                <CardContent className="pt-6">
                    <Label className="text-sm font-medium mb-2 block">
                        <Trans>Add Option Group</Trans>
                    </Label>
                    <GroupSearch onSelect={handleAddGroup} selectedGroups={value} disabled={disabled} />
                </CardContent>
            </Card>
        </div>
    );
}
