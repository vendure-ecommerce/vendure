import { HistoryNoteEditor } from '@/vdb/components/shared/history-timeline/history-note-editor.js';
import { HistoryNoteInput } from '@/vdb/components/shared/history-timeline/history-note-input.js';
import { HistoryTimelineWithGrouping } from '@/vdb/components/shared/history-timeline/history-timeline-with-grouping.js';
import { HistoryEntryItem } from '@/vdb/framework/extension-api/types/history-entries.js';
import { HistoryEntryProps } from '@/vdb/framework/history-entry/history-entry.js';
import { useState } from 'react';
import { CustomerHistoryCustomerDetail } from './customer-history-types.js';
import { customerHistoryUtils } from './customer-history-utils.js';
import {
    CustomerAddedToGroupComponent,
    CustomerAddressCreatedComponent,
    CustomerAddressDeletedComponent,
    CustomerAddressUpdatedComponent,
    CustomerDetailUpdatedComponent,
    CustomerEmailUpdateRequestedComponent,
    CustomerEmailUpdateVerifiedComponent,
    CustomerNoteComponent,
    CustomerPasswordResetRequestedComponent,
    CustomerPasswordResetVerifiedComponent,
    CustomerPasswordUpdatedComponent,
    CustomerRegisteredComponent,
    CustomerRemovedFromGroupComponent,
    CustomerVerifiedComponent,
} from './default-customer-history-components.js';

interface CustomerHistoryProps {
    customer: CustomerHistoryCustomerDetail;
    historyEntries: HistoryEntryItem[];
    onAddNote: (note: string, isPrivate: boolean) => void;
    onUpdateNote?: (entryId: string, note: string, isPrivate: boolean) => void;
    onDeleteNote?: (entryId: string) => void;
}

export function CustomerHistory({
    customer,
    historyEntries,
    onAddNote,
    onUpdateNote,
    onDeleteNote,
}: Readonly<CustomerHistoryProps>) {
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
        customerHistoryUtils(customer);

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
        if (entry.type === 'CUSTOMER_REGISTERED') {
            return <CustomerRegisteredComponent {...props} />;
        } else if (entry.type === 'CUSTOMER_VERIFIED') {
            return <CustomerVerifiedComponent {...props} />;
        } else if (entry.type === 'CUSTOMER_DETAIL_UPDATED') {
            return <CustomerDetailUpdatedComponent {...props} />;
        } else if (entry.type === 'CUSTOMER_ADDED_TO_GROUP') {
            return <CustomerAddedToGroupComponent {...props} />;
        } else if (entry.type === 'CUSTOMER_REMOVED_FROM_GROUP') {
            return <CustomerRemovedFromGroupComponent {...props} />;
        } else if (entry.type === 'CUSTOMER_ADDRESS_CREATED') {
            return <CustomerAddressCreatedComponent {...props} />;
        } else if (entry.type === 'CUSTOMER_ADDRESS_UPDATED') {
            return <CustomerAddressUpdatedComponent {...props} />;
        } else if (entry.type === 'CUSTOMER_ADDRESS_DELETED') {
            return <CustomerAddressDeletedComponent {...props} />;
        } else if (entry.type === 'CUSTOMER_NOTE') {
            return (
                <CustomerNoteComponent
                    {...props}
                    onEditNote={handleEditNote}
                    onDeleteNote={handleDeleteNote}
                />
            );
        } else if (entry.type === 'CUSTOMER_PASSWORD_UPDATED') {
            return <CustomerPasswordUpdatedComponent {...props} />;
        } else if (entry.type === 'CUSTOMER_PASSWORD_RESET_REQUESTED') {
            return <CustomerPasswordResetRequestedComponent {...props} />;
        } else if (entry.type === 'CUSTOMER_PASSWORD_RESET_VERIFIED') {
            return <CustomerPasswordResetVerifiedComponent {...props} />;
        } else if (entry.type === 'CUSTOMER_EMAIL_UPDATE_REQUESTED') {
            return <CustomerEmailUpdateRequestedComponent {...props} />;
        } else if (entry.type === 'CUSTOMER_EMAIL_UPDATE_VERIFIED') {
            return <CustomerEmailUpdateVerifiedComponent {...props} />;
        }
        return null;
    };

    return (
        <>
            <HistoryTimelineWithGrouping
                historyEntries={historyEntries}
                isPrimaryEvent={isPrimaryEvent}
                renderEntryContent={renderEntryContent}
                entity={customer}
            >
                <HistoryNoteInput onAddNote={onAddNote} />
            </HistoryTimelineWithGrouping>
            <HistoryNoteEditor
                open={noteEditorOpen}
                onOpenChange={setNoteEditorOpen}
                onNoteChange={handleNoteEditorSave}
                note={noteEditorNote.note}
                isPrivate={noteEditorNote.isPrivate}
                noteId={noteEditorNote.noteId}
            />
        </>
    );
}
