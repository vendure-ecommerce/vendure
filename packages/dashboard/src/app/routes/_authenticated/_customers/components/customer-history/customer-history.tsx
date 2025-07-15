import { HistoryEntry, HistoryEntryItem } from '@/vdb/components/shared/history-timeline/history-entry.js';
import { HistoryNoteInput } from '@/vdb/components/shared/history-timeline/history-note-input.js';
import { HistoryTimeline } from '@/vdb/components/shared/history-timeline/history-timeline.js';
import { Badge } from '@/vdb/components/ui/badge.js';
import { Trans } from '@/vdb/lib/trans.js';
import { CheckIcon, SquarePen } from 'lucide-react';

interface CustomerHistoryProps {
    customer: {
        id: string;
    };
    historyEntries: Array<HistoryEntryItem>;
    onAddNote: (note: string, isPrivate: boolean) => void;
    onUpdateNote?: (entryId: string, note: string, isPrivate: boolean) => void;
    onDeleteNote?: (entryId: string) => void;
}

export function CustomerHistory({
    historyEntries,
    onAddNote,
    onUpdateNote,
    onDeleteNote,
}: CustomerHistoryProps) {
    const getTimelineIcon = (entry: CustomerHistoryProps['historyEntries'][0]) => {
        switch (entry.type) {
            case 'CUSTOMER_NOTE':
                return <SquarePen className="h-4 w-4" />;
            default:
                return <CheckIcon className="h-4 w-4" />;
        }
    };

    const getTitle = (entry: CustomerHistoryProps['historyEntries'][0]) => {
        switch (entry.type) {
            case 'CUSTOMER_NOTE':
                return <Trans>Note added</Trans>;
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
                        isNoteEntry={entry.type === 'CUSTOMER_NOTE'}
                        timelineIcon={getTimelineIcon(entry)}
                        title={getTitle(entry)}
                    >
                        {entry.type === 'CUSTOMER_NOTE' && (
                            <div className="flex items-center space-x-2">
                                <Badge variant={entry.isPublic ? 'outline' : 'secondary'} className="text-xs">
                                    {entry.isPublic ? 'Public' : 'Private'}
                                </Badge>
                                <span>{entry.data.note}</span>
                            </div>
                        )}
                        <div className="text-sm text-muted-foreground">
                            {entry.type === 'CUSTOMER_NOTE' && (
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
