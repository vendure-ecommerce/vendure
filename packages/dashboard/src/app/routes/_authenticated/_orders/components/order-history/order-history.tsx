import { HistoryEntryProps } from '@/vdb/components/shared/history-timeline/history-entry.js';
import { HistoryNoteEditor } from '@/vdb/components/shared/history-timeline/history-note-editor.js';
import { HistoryNoteInput } from '@/vdb/components/shared/history-timeline/history-note-input.js';
import { HistoryTimeline } from '@/vdb/components/shared/history-timeline/history-timeline.js';
import { Button } from '@/vdb/components/ui/button.js';
import { HistoryEntryItem } from '@/vdb/framework/extension-api/types/index.js';
import { Trans } from '@/vdb/lib/trans.js';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import {
    OrderCancellationComponent,
    OrderCustomerUpdatedComponent,
    OrderFulfillmentComponent,
    OrderFulfillmentTransitionComponent,
    OrderModifiedComponent,
    OrderNoteComponent,
    OrderPaymentTransitionComponent,
    OrderRefundTransitionComponent,
    OrderStateTransitionComponent,
} from './default-order-history-components.js';
import { OrderHistoryOrderDetail } from './order-history-types.js';
import { orderHistoryUtils } from './order-history-utils.js';

interface OrderHistoryProps {
    order: OrderHistoryOrderDetail;
    historyEntries: Array<HistoryEntryItem>;
    onAddNote: (note: string, isPrivate: boolean) => void;
    onUpdateNote?: (entryId: string, note: string, isPrivate: boolean) => void;
    onDeleteNote?: (entryId: string) => void;
}

export function OrderHistory({
    order,
    historyEntries,
    onAddNote,
    onUpdateNote,
    onDeleteNote,
}: Readonly<OrderHistoryProps>) {
    const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set());
    const [noteEditorOpen, setNoteEditorOpen] = useState(false);
    const [noteEditorNote, setNoteEditorNote] = useState<{
        noteId: string;
        note: string;
        isPrivate: boolean;
    }>({
        noteId: '',
        note: '',
        isPrivate: true,
    });

    const handleEditNote = (noteId: string, note: string, isPrivate: boolean) => {
        setNoteEditorNote({ noteId, note, isPrivate });
        setNoteEditorOpen(true);
    };

    const handleDeleteNote = (noteId: string) => {
        onDeleteNote?.(noteId);
    };

    const handleNoteEditorSave = (noteId: string, note: string, isPrivate: boolean) => {
        onUpdateNote?.(noteId, note, isPrivate);
    };

    const { getTimelineIcon, getTitle, getIconColor, getActorName, isPrimaryEvent } =
        orderHistoryUtils(order);

    const renderEntryContent = (entry: HistoryEntryItem) => {
        const props: HistoryEntryProps = {
            entry,
            title: getTitle(entry),
            actorName: getActorName(entry),
            timelineIcon: getTimelineIcon(entry),
            timelineIconClassName: getIconColor(entry),
            isPrimary: isPrimaryEvent(entry),
            children: null,
        };
        if (entry.type === 'ORDER_NOTE') {
            return (
                <OrderNoteComponent {...props} onEditNote={handleEditNote} onDeleteNote={handleDeleteNote} />
            );
        } else if (entry.type === 'ORDER_STATE_TRANSITION') {
            return <OrderStateTransitionComponent {...props} />;
        } else if (entry.type === 'ORDER_PAYMENT_TRANSITION') {
            return <OrderPaymentTransitionComponent {...props} />;
        } else if (entry.type === 'ORDER_REFUND_TRANSITION') {
            return <OrderRefundTransitionComponent {...props} />;
        } else if (entry.type === 'ORDER_FULFILLMENT_TRANSITION') {
            return <OrderFulfillmentTransitionComponent {...props} />;
        } else if (entry.type === 'ORDER_FULFILLMENT') {
            return <OrderFulfillmentComponent {...props} />;
        } else if (entry.type === 'ORDER_MODIFIED') {
            return <OrderModifiedComponent {...props} />;
        } else if (entry.type === 'ORDER_CUSTOMER_UPDATED') {
            return <OrderCustomerUpdatedComponent {...props} />;
        } else if (entry.type === 'ORDER_CANCELLATION') {
            return <OrderCancellationComponent {...props} />;
        }
        return null;
    };

    // Group consecutive secondary events
    const groupedEntries: Array<
        | { type: 'primary'; entry: HistoryEntryItem; index: number }
        | {
              type: 'secondary-group';
              entries: Array<{ entry: HistoryEntryItem; index: number }>;
              startIndex: number;
          }
    > = [];
    let currentGroup: Array<{ entry: HistoryEntryItem; index: number }> = [];

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
            <div className="mb-4">
                <HistoryNoteInput onAddNote={onAddNote} />
            </div>
            <HistoryTimeline>
                {groupedEntries.map((group, groupIndex) => {
                    if (group.type === 'primary') {
                        const entry = group.entry;
                        return <div key={entry.id}>{renderEntryContent(entry)}</div>;
                    } else {
                        // Secondary group
                        const shouldCollapse = group.entries.length > 2;
                        const isExpanded = expandedGroups.has(groupIndex);
                        const visibleEntries =
                            shouldCollapse && !isExpanded ? group.entries.slice(0, 2) : group.entries;

                        return (
                            <div key={`group-${groupIndex}`}>
                                {visibleEntries.map(({ entry }) => (
                                    <div key={entry.id}>{renderEntryContent(entry)}</div>
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
                                                    <Trans>Show less</Trans>
                                                </>
                                            ) : (
                                                <>
                                                    <ChevronDown className="w-3 h-3 mr-1" />
                                                    <Trans>Show all ({group.entries.length - 2})</Trans>
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
            <HistoryNoteEditor
                key={noteEditorNote.noteId}
                note={noteEditorNote.note}
                onNoteChange={handleNoteEditorSave}
                open={noteEditorOpen}
                onOpenChange={setNoteEditorOpen}
                noteId={noteEditorNote.noteId}
                isPrivate={noteEditorNote.isPrivate}
            />
        </div>
    );
}
