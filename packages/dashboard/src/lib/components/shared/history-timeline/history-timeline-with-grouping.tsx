import { HistoryEntryItem } from '@/vdb/framework/extension-api/types/history-entries.js';
import { Button } from '@/vdb/components/ui/button.js';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { HistoryTimeline } from './history-timeline.js';

interface HistoryTimelineWithGroupingProps<T extends HistoryEntryItem> {
    historyEntries: T[];
    isPrimaryEvent: (entry: T) => boolean;
    renderEntryContent: (entry: T, variant: 'primary' | 'secondary') => ReactNode;
    children?: ReactNode; // For HistoryNoteInput or other content before timeline
}

export function HistoryTimelineWithGrouping<T extends HistoryEntryItem>({
    historyEntries,
    isPrimaryEvent,
    renderEntryContent,
    children,
}: HistoryTimelineWithGroupingProps<T>) {
    const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set());

    // Group consecutive secondary events
    const groupedEntries: Array<
        | { type: 'primary'; entry: T; index: number }
        | {
              type: 'secondary-group';
              entries: Array<{ entry: T; index: number }>;
              startIndex: number;
          }
    > = [];
    let currentGroup: Array<{ entry: T; index: number }> = [];

    for (let i = 0; i < historyEntries.length; i++) {
        const entry = historyEntries[i];
        const isSecondary = !isPrimaryEvent(entry);

        if (isSecondary) {
            currentGroup.push({ entry, index: i });
        } else {
            // If we have accumulated secondary events, add them as a group
            if (currentGroup.length > 0) {
                groupedEntries.push({
                    type: 'secondary-group',
                    entries: currentGroup,
                    startIndex: currentGroup[0].index,
                });
                currentGroup = [];
            }
            // Add the primary event
            groupedEntries.push({ type: 'primary', entry, index: i });
        }
    }

    // Don't forget the last group if it exists
    if (currentGroup.length > 0) {
        groupedEntries.push({
            type: 'secondary-group',
            entries: currentGroup,
            startIndex: currentGroup[0].index,
        });
    }

    const toggleGroup = (groupIndex: number) => {
        const newExpanded = new Set(expandedGroups);
        if (newExpanded.has(groupIndex)) {
            newExpanded.delete(groupIndex);
        } else {
            newExpanded.add(groupIndex);
        }
        setExpandedGroups(newExpanded);
    };

    return (
        <div className="">
            {children && <div className="mb-4">{children}</div>}
            <HistoryTimeline>
                {groupedEntries.map((group, groupIndex) => {
                    if (group.type === 'primary') {
                        const entry = group.entry;
                        return <div key={entry.id}>{renderEntryContent(entry, 'primary')}</div>;
                    } else {
                        // Secondary group
                        const shouldCollapse = group.entries.length > 2;
                        const isExpanded = expandedGroups.has(groupIndex);
                        const visibleEntries =
                            shouldCollapse && !isExpanded ? group.entries.slice(0, 2) : group.entries;

                        return (
                            <div key={`group-${groupIndex}`}>
                                {visibleEntries.map(({ entry }) => (
                                    <div key={entry.id}>{renderEntryContent(entry, 'secondary')}</div>
                                ))}
                                {shouldCollapse && (
                                    <div className="flex justify-center py-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => toggleGroup(groupIndex)}
                                            className="text-muted-foreground hover:text-foreground h-6 text-xs"
                                        >
                                            {isExpanded ? (
                                                <>
                                                    <ChevronUp className="w-3 h-3 mr-1" />
                                                    Show less
                                                </>
                                            ) : (
                                                <>
                                                    <ChevronDown className="w-3 h-3 mr-1" />
                                                    Show all ({group.entries.length - 2})
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        );
                    }
                })}
            </HistoryTimeline>
        </div>
    );
}