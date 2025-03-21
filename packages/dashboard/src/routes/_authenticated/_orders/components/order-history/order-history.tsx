import { Badge } from '@/components/ui/badge.js';
import { Button } from '@/components/ui/button.js';
import { Checkbox } from '@/components/ui/checkbox.js';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.js';
import { ScrollArea } from '@/components/ui/scroll-area.js';
import { Separator } from '@/components/ui/separator.js';
import { Textarea } from '@/components/ui/textarea.js';
import { useLocalFormat } from '@/hooks/use-local-format.js';
import { Trans } from '@lingui/react/macro';
import {
    ArrowRightToLine,
    CheckIcon,
    CreditCardIcon,
    MoreVerticalIcon,
    PencilIcon,
    SquarePen,
    TrashIcon,
} from 'lucide-react';
import { useState } from 'react';
import { NoteEditor } from './note-editor.js';

interface OrderHistoryProps {
    order: {
        id: string;
        createdAt: string;
        currencyCode: string;
    };
    historyEntries: Array<{
        id: string;
        type: string;
        createdAt: string;
        isPublic: boolean;
        administrator?: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
        data: any;
    }>;
    onAddNote: (note: string, isPrivate: boolean) => void;
    onUpdateNote?: (entryId: string, note: string, isPrivate: boolean) => void;
    onDeleteNote?: (entryId: string) => void;
}

// Helper function to get initials from a name
const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
};

export function OrderHistory({
    order,
    historyEntries,
    onAddNote,
    onUpdateNote,
    onDeleteNote,
}: OrderHistoryProps) {
    const [note, setNote] = useState('');
    const [noteIsPrivate, setNoteIsPrivate] = useState(true);
    const { formatDate } = useLocalFormat();
    const [noteEditorOpen, setNoteEditorOpen] = useState(false);
      const [noteEditorNote, setNoteEditorNote] = useState<{ noteId: string; note: string; isPrivate: boolean }>({ noteId: '', note: '', isPrivate: true });

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

    const handleAddNote = () => {
        if (note.trim()) {
            onAddNote(note, noteIsPrivate);
            setNote('');
        }
    };

    const formatDateTime = (date: string) => {
        return formatDate(date, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
        });
    };

    const onEditNote = (noteId: string, note: string, isPrivate: boolean) => {
        setNoteEditorNote({ noteId, note, isPrivate });
        setNoteEditorOpen(true);
    };

    const onEditNoteSave = (noteId: string, note: string, isPrivate: boolean) => {
        onUpdateNote?.(noteId, note, isPrivate);
        setNoteEditorOpen(false);
    };

    return (
        <div className="space-y-4">
            <div className="space-y-4">
                {/* Add Note Section */}
                <div className="border rounded-md p-4 bg-gray-50">
                    <div className="flex flex-col space-y-4">
                        <Textarea
                            placeholder="Add a note..."
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            className="min-h-[80px] resize-none"
                        />
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="note-private"
                                    checked={noteIsPrivate}
                                    onCheckedChange={checked => setNoteIsPrivate(checked as boolean)}
                                />
                                <label
                                    htmlFor="note-private"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Note is private
                                </label>
                                <span
                                    className={
                                        noteIsPrivate ? 'text-gray-500 text-xs' : 'text-green-600 text-xs'
                                    }
                                >
                                    {noteIsPrivate ? 'Visible to admins only' : 'Visible to customer'}
                                </span>
                            </div>
                            <Button onClick={handleAddNote} disabled={!note.trim()} size="sm">
                                Add note
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Timeline */}
                <ScrollArea className=" pr-4">
                    <div className="relative">
                        <div className="absolute left-5 top-0 bottom-[44px] w-0.5 bg-gray-200" />

                        {/* History entries */}
                        {historyEntries.map((entry, index) => (
                            <div key={entry.id} className="relative mb-4 pl-11">
                                <div className="absolute left-0 w-10 flex items-center justify-center">
                                    <div className={`rounded-full flex items-center justify-center h-6 w-6`}>
                                        <div
                                            className={`rounded-full bg-gray-200 text-muted-foreground flex items-center justify-center h-6 w-6`}
                                        >
                                            {getTimelineIcon(entry)}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white px-4 rounded-md">
                                    <div className="mt-2 text-sm text-gray-500 flex items-center">
                                        <span>{formatDateTime(entry.createdAt)}</span>
                                        {entry.administrator && (
                                            <span className="ml-2">
                                                {entry.administrator.firstName} {entry.administrator.lastName}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="font-medium text-sm">{getTitle(entry)}</div>

                                            {entry.type === 'ORDER_NOTE' && (
                                                <div className="flex items-center space-x-2">
                                                    <Badge
                                                        variant={entry.isPublic ? 'outline' : 'secondary'}
                                                        className="text-xs"
                                                    >
                                                        {entry.isPublic ? 'Public' : 'Private'}
                                                    </Badge>
                                                    <span>{entry.data.note}</span>
                                                </div>
                                            )}
                                            <div className="text-sm text-muted-foreground">
                                                {entry.type === 'ORDER_STATE_TRANSITION' && (
                                                    <Trans>
                                                        From {entry.data.from} to {entry.data.to}
                                                    </Trans>
                                                )}
                                                {entry.type === 'ORDER_PAYMENT_TRANSITION' && (
                                                    <Trans>
                                                        Payment #{entry.data.paymentId} transitioned to{' '}
                                                        {entry.data.to}
                                                    </Trans>
                                                )}
                                            </div>
                                        </div>

                                        {entry.type === 'ORDER_NOTE' && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <MoreVerticalIcon className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            onEditNote?.(
                                                                entry.id,
                                                                entry.data.note,
                                                                !entry.isPublic,
                                                            )
                                                        }
                                                        className="cursor-pointer"
                                                    >
                                                        <PencilIcon className="mr-2 h-4 w-4" />
                                                        <Trans>Edit</Trans>
                                                    </DropdownMenuItem>
                                                    <Separator className="my-1" />
                                                    <DropdownMenuItem
                                                        onClick={() => onDeleteNote?.(entry.id)}
                                                        className="cursor-pointer text-red-600 focus:text-red-600"
                                                    >
                                                        <TrashIcon className="mr-2 h-4 w-4" />
                                                        <span>Delete</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </div>
                                </div>
                                <div className="border-b border-muted my-4 mx-4"></div>
                            </div>
                        ))}

                        {/* Order created entry - always shown last */}
                        <div className="relative mb-4 pl-11">
                            <div className="absolute left-0 w-10 flex items-center justify-center">
                                <div className="h-6 w-6 rounded-full flex items-center justify-center bg-green-100">
                                    <CheckIcon className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="bg-white px-4 rounded-md">
                                <div className="mt-2 text-sm text-gray-500">
                                    {formatDateTime(order.createdAt)}
                                </div>
                                <div className="font-medium">Order created</div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
                <NoteEditor
                    key={noteEditorNote.noteId}
                    note={noteEditorNote.note}
                    onNoteChange={onEditNoteSave}
                    open={noteEditorOpen}
                    onOpenChange={setNoteEditorOpen}
                    noteId={noteEditorNote.noteId}
                    isPrivate={noteEditorNote.isPrivate}
                />
            </div>
        </div>
    );
}
