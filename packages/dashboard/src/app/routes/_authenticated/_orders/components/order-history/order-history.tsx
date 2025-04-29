import { Badge } from '@/components/ui/badge.js';
import { Trans } from '@/lib/trans.js';
import { ArrowRightToLine, CheckIcon, CreditCardIcon, SquarePen } from 'lucide-react';
import { HistoryEntry, HistoryEntryItem } from '@/components/shared/history-timeline/history-entry.js';
import { HistoryNoteInput } from '@/components/shared/history-timeline/history-note-input.js';
import { HistoryTimeline } from '@/components/shared/history-timeline/history-timeline.js';

interface OrderHistoryProps {
    order: {
        id: string;
        createdAt: string;
        currencyCode: string;
    };
    historyEntries: Array<HistoryEntryItem>;
    onAddNote: (note: string, isPrivate: boolean) => void;
    onUpdateNote?: (entryId: string, note: string, isPrivate: boolean) => void;
    onDeleteNote?: (entryId: string) => void;
}

export function OrderHistory({ historyEntries, onAddNote, onUpdateNote, onDeleteNote }: OrderHistoryProps) {
    const getTimelineIcon = (entry: OrderHistoryProps['historyEntries'][0]) => {
        switch (entry.type) {
            case 'ORDER_PAYMENT_TRANSITION':
                return <CreditCardIcon className="h-4 w-4" />;
            case 'ORDER_NOTE':
                return <SquarePen className="h-4 w-4" />;
            case 'ORDER_STATE_TRANSITION':
                return <ArrowRightToLine className="h-4 w-4" />;
            default:
                return <CheckIcon className="h-4 w-4" />;
        }
    };

    const getTitle = (entry: OrderHistoryProps['historyEntries'][0]) => {
        switch (entry.type) {
            case 'ORDER_PAYMENT_TRANSITION':
                return <Trans>Payment settled</Trans>;
            case 'ORDER_NOTE':
                return <Trans>Note added</Trans>;
            case 'ORDER_STATE_TRANSITION': {
                if (entry.data.from === 'Created') {
                    return <Trans>Order created</Trans>;
                }
                if (entry.data.to === 'Delivered') {
                    return <Trans>Order fulfilled</Trans>;
                }
                if (entry.data.to === 'Cancelled') {
                    return <Trans>Order cancelled</Trans>;
                }
                return <Trans>Order transitioned</Trans>;
            }
            default:
                return <Trans>{entry.type.replace(/_/g, ' ').toLowerCase()}</Trans>;
        }
    };

    return (
        <div className="">
            <div className="mb-4">
                <HistoryNoteInput onAddNote={onAddNote} />
            </div>
            <HistoryTimeline onEditNote={onUpdateNote} onDeleteNote={onDeleteNote}>
                {historyEntries.map(entry => (
                    <HistoryEntry
                        key={entry.id}
                        entry={entry}
                        isNoteEntry={entry.type === 'ORDER_NOTE'}
                        timelineIcon={getTimelineIcon(entry)}
                        title={getTitle(entry)}
                    >
                        {entry.type === 'ORDER_NOTE' && (
                            <div className="flex items-center space-x-2">
                                <Badge variant={entry.isPublic ? 'outline' : 'secondary'} className="text-xs">
                                    {entry.isPublic ? 'Public' : 'Private'}
                                </Badge>
                                <span>{entry.data.note}</span>
                            </div>
                        )}
                        <div className="text-sm text-muted-foreground">
                            {entry.type === 'ORDER_STATE_TRANSITION' && entry.data.from !== 'Created' && (
                                <Trans>
                                    From {entry.data.from} to {entry.data.to}
                                </Trans>
                            )}
                            {entry.type === 'ORDER_PAYMENT_TRANSITION' && (
                                <Trans>
                                    Payment #{entry.data.paymentId} transitioned to {entry.data.to}
                                </Trans>
                            )}
                        </div>
                    </HistoryEntry>
                ))}
            </HistoryTimeline>
        </div>
    );
}
