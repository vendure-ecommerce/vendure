import { HistoryEntry, HistoryEntryItem } from '@/vdb/components/shared/history-timeline/history-entry.js';
import { HistoryNoteEditor } from '@/vdb/components/shared/history-timeline/history-note-editor.js';
import { HistoryNoteInput } from '@/vdb/components/shared/history-timeline/history-note-input.js';
import { HistoryTimeline } from '@/vdb/components/shared/history-timeline/history-timeline.js';
import { Badge } from '@/vdb/components/ui/badge.js';
import { Button } from '@/vdb/components/ui/button.js';
import { Trans } from '@/vdb/lib/trans.js';
import {
    ArrowRightToLine,
    Ban,
    CheckIcon,
    ChevronDown,
    ChevronUp,
    CreditCardIcon,
    Edit3,
    SquarePen,
    Truck,
    UserX,
} from 'lucide-react';
import { useState } from 'react';

interface OrderHistoryProps {
    order: {
        id: string;
        createdAt: string;
        currencyCode: string;
        customer?: {
            firstName: string;
            lastName: string;
        } | null;
    };
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

    const isPrimaryEvent = (entry: HistoryEntryItem) => {
        // Based on Angular component's isFeatured method
        switch (entry.type) {
            case 'ORDER_STATE_TRANSITION':
                return (
                    entry.data.to === 'Delivered' ||
                    entry.data.to === 'Cancelled' ||
                    entry.data.to === 'Settled' ||
                    entry.data.from === 'Created'
                );
            case 'ORDER_REFUND_TRANSITION':
                return entry.data.to === 'Settled';
            case 'ORDER_PAYMENT_TRANSITION':
                return entry.data.to === 'Settled' || entry.data.to === 'Cancelled';
            case 'ORDER_FULFILLMENT_TRANSITION':
                return entry.data.to === 'Delivered' || entry.data.to === 'Shipped';
            case 'ORDER_NOTE':
            case 'ORDER_MODIFIED':
            case 'ORDER_CUSTOMER_UPDATED':
            case 'ORDER_CANCELLATION':
                return true;
            default:
                return false; // All other events are secondary
        }
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
    const getTimelineIcon = (entry: OrderHistoryProps['historyEntries'][0]) => {
        switch (entry.type) {
            case 'ORDER_PAYMENT_TRANSITION':
                return <CreditCardIcon className="h-4 w-4" />;
            case 'ORDER_REFUND_TRANSITION':
                return <CreditCardIcon className="h-4 w-4" />;
            case 'ORDER_NOTE':
                return <SquarePen className="h-4 w-4" />;
            case 'ORDER_STATE_TRANSITION':
                if (entry.data.to === 'Delivered') {
                    return <CheckIcon className="h-4 w-4" />;
                }
                if (entry.data.to === 'Cancelled') {
                    return <Ban className="h-4 w-4" />;
                }
                return <ArrowRightToLine className="h-4 w-4" />;
            case 'ORDER_FULFILLMENT_TRANSITION':
                if (entry.data.to === 'Shipped' || entry.data.to === 'Delivered') {
                    return <Truck className="h-4 w-4" />;
                }
                return <ArrowRightToLine className="h-4 w-4" />;
            case 'ORDER_FULFILLMENT':
                return <Truck className="h-4 w-4" />;
            case 'ORDER_MODIFIED':
                return <Edit3 className="h-4 w-4" />;
            case 'ORDER_CUSTOMER_UPDATED':
                return <UserX className="h-4 w-4" />;
            case 'ORDER_CANCELLATION':
                return <Ban className="h-4 w-4" />;
            default:
                return <CheckIcon className="h-4 w-4" />;
        }
    };

    const getTitle = (entry: OrderHistoryProps['historyEntries'][0]) => {
        switch (entry.type) {
            case 'ORDER_PAYMENT_TRANSITION':
                if (entry.data.to === 'Settled') {
                    return <Trans>Payment settled</Trans>;
                }
                if (entry.data.to === 'Authorized') {
                    return <Trans>Payment authorized</Trans>;
                }
                if (entry.data.to === 'Declined' || entry.data.to === 'Cancelled') {
                    return <Trans>Payment failed</Trans>;
                }
                return <Trans>Payment transitioned</Trans>;
            case 'ORDER_REFUND_TRANSITION':
                if (entry.data.to === 'Settled') {
                    return <Trans>Refund settled</Trans>;
                }
                return <Trans>Refund transitioned</Trans>;
            case 'ORDER_NOTE':
                return <Trans>Note added</Trans>;
            case 'ORDER_STATE_TRANSITION': {
                if (entry.data.from === 'Created') {
                    return <Trans>Order placed</Trans>;
                }
                if (entry.data.to === 'Delivered') {
                    return <Trans>Order fulfilled</Trans>;
                }
                if (entry.data.to === 'Cancelled') {
                    return <Trans>Order cancelled</Trans>;
                }
                if (entry.data.to === 'Shipped') {
                    return <Trans>Order shipped</Trans>;
                }
                return <Trans>Order transitioned</Trans>;
            }
            case 'ORDER_FULFILLMENT_TRANSITION':
                if (entry.data.to === 'Shipped') {
                    return <Trans>Order shipped</Trans>;
                }
                if (entry.data.to === 'Delivered') {
                    return <Trans>Order delivered</Trans>;
                }
                return <Trans>Fulfillment transitioned</Trans>;
            case 'ORDER_FULFILLMENT':
                return <Trans>Fulfillment created</Trans>;
            case 'ORDER_MODIFIED':
                return <Trans>Order modified</Trans>;
            case 'ORDER_CUSTOMER_UPDATED':
                return <Trans>Customer updated</Trans>;
            case 'ORDER_CANCELLATION':
                return <Trans>Order cancelled</Trans>;
            default:
                return <Trans>{entry.type.replace(/_/g, ' ').toLowerCase()}</Trans>;
        }
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
                        return (
                            <HistoryEntry
                                key={entry.id}
                                entry={entry}
                                isNoteEntry={entry.type === 'ORDER_NOTE'}
                                timelineIcon={getTimelineIcon(entry)}
                                title={getTitle(entry)}
                                isPrimary={true}
                                customer={order.customer}
                                onEditNote={handleEditNote}
                                onDeleteNote={handleDeleteNote}
                            >
                                {entry.type === 'ORDER_NOTE' && (
                                    <div className="space-y-2">
                                        <p className="text-sm text-foreground">{entry.data.note}</p>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant={entry.isPublic ? 'outline' : 'secondary'}
                                                className="text-xs"
                                            >
                                                {entry.isPublic ? 'Public' : 'Private'}
                                            </Badge>
                                        </div>
                                    </div>
                                )}
                                {entry.type === 'ORDER_STATE_TRANSITION' && entry.data.from !== 'Created' && (
                                    <p className="text-xs text-muted-foreground">
                                        <Trans>
                                            From {entry.data.from} to {entry.data.to}
                                        </Trans>
                                    </p>
                                )}
                                {entry.type === 'ORDER_PAYMENT_TRANSITION' && (
                                    <p className="text-xs text-muted-foreground">
                                        <Trans>
                                            Payment #{entry.data.paymentId} transitioned to {entry.data.to}
                                        </Trans>
                                    </p>
                                )}
                                {entry.type === 'ORDER_REFUND_TRANSITION' && (
                                    <p className="text-xs text-muted-foreground">
                                        <Trans>
                                            Refund #{entry.data.refundId} transitioned to {entry.data.to}
                                        </Trans>
                                    </p>
                                )}
                                {entry.type === 'ORDER_FULFILLMENT_TRANSITION' &&
                                    entry.data.from !== 'Created' && (
                                        <p className="text-xs text-muted-foreground">
                                            <Trans>
                                                Fulfillment #{entry.data.fulfillmentId} from {entry.data.from}{' '}
                                                to {entry.data.to}
                                            </Trans>
                                        </p>
                                    )}
                                {entry.type === 'ORDER_FULFILLMENT' && (
                                    <p className="text-xs text-muted-foreground">
                                        <Trans>Fulfillment #{entry.data.fulfillmentId} created</Trans>
                                    </p>
                                )}
                                {entry.type === 'ORDER_MODIFIED' && (
                                    <p className="text-xs text-muted-foreground">
                                        <Trans>Order modification #{entry.data.modificationId}</Trans>
                                    </p>
                                )}
                                {entry.type === 'ORDER_CUSTOMER_UPDATED' && (
                                    <p className="text-xs text-muted-foreground">
                                        <Trans>Customer information updated</Trans>
                                    </p>
                                )}
                                {entry.type === 'ORDER_CANCELLATION' && (
                                    <p className="text-xs text-muted-foreground">
                                        <Trans>Order cancelled</Trans>
                                    </p>
                                )}
                            </HistoryEntry>
                        );
                    } else {
                        // Secondary group
                        const shouldCollapse = group.entries.length > 2;
                        const isExpanded = expandedGroups.has(groupIndex);
                        const visibleEntries =
                            shouldCollapse && !isExpanded ? group.entries.slice(0, 2) : group.entries;

                        return (
                            <div key={`group-${groupIndex}`}>
                                {visibleEntries.map(({ entry }) => (
                                    <HistoryEntry
                                        key={entry.id}
                                        entry={entry}
                                        isNoteEntry={entry.type === 'ORDER_NOTE'}
                                        timelineIcon={getTimelineIcon(entry)}
                                        title={getTitle(entry)}
                                        isPrimary={false}
                                        customer={order.customer}
                                        onEditNote={handleEditNote}
                                        onDeleteNote={handleDeleteNote}
                                    >
                                        {entry.type === 'ORDER_NOTE' && (
                                            <div className="space-y-1">
                                                <p className="text-xs text-foreground">{entry.data.note}</p>
                                                <Badge
                                                    variant={entry.isPublic ? 'outline' : 'secondary'}
                                                    className="text-xs"
                                                >
                                                    {entry.isPublic ? 'Public' : 'Private'}
                                                </Badge>
                                            </div>
                                        )}
                                        {entry.type === 'ORDER_STATE_TRANSITION' &&
                                            entry.data.from !== 'Created' && (
                                                <p className="text-xs text-muted-foreground">
                                                    <Trans>
                                                        From {entry.data.from} to {entry.data.to}
                                                    </Trans>
                                                </p>
                                            )}
                                        {entry.type === 'ORDER_PAYMENT_TRANSITION' && (
                                            <p className="text-xs text-muted-foreground">
                                                <Trans>
                                                    Payment #{entry.data.paymentId} transitioned to{' '}
                                                    {entry.data.to}
                                                </Trans>
                                            </p>
                                        )}
                                        {entry.type === 'ORDER_REFUND_TRANSITION' && (
                                            <p className="text-xs text-muted-foreground">
                                                <Trans>
                                                    Refund #{entry.data.refundId} transitioned to{' '}
                                                    {entry.data.to}
                                                </Trans>
                                            </p>
                                        )}
                                        {entry.type === 'ORDER_FULFILLMENT_TRANSITION' &&
                                            entry.data.from !== 'Created' && (
                                                <p className="text-xs text-muted-foreground">
                                                    <Trans>
                                                        Fulfillment #{entry.data.fulfillmentId} from{' '}
                                                        {entry.data.from} to {entry.data.to}
                                                    </Trans>
                                                </p>
                                            )}
                                        {entry.type === 'ORDER_FULFILLMENT' && (
                                            <p className="text-xs text-muted-foreground">
                                                <Trans>Fulfillment #{entry.data.fulfillmentId} created</Trans>
                                            </p>
                                        )}
                                        {entry.type === 'ORDER_MODIFIED' && (
                                            <p className="text-xs text-muted-foreground">
                                                <Trans>Order modification #{entry.data.modificationId}</Trans>
                                            </p>
                                        )}
                                        {entry.type === 'ORDER_CUSTOMER_UPDATED' && (
                                            <p className="text-xs text-muted-foreground">
                                                <Trans>Customer information updated</Trans>
                                            </p>
                                        )}
                                        {entry.type === 'ORDER_CANCELLATION' && (
                                            <p className="text-xs text-muted-foreground">
                                                <Trans>Order cancelled</Trans>
                                            </p>
                                        )}
                                    </HistoryEntry>
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
                                                    <Trans>Show all ({group.entries.length})</Trans>
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
