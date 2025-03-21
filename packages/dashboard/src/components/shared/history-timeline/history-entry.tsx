import { Button } from '@/components/ui/button.js';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.js';
import { Separator } from '@/components/ui/separator.js';
import { useLocalFormat } from '@/hooks/use-local-format.js';
import { Trans } from '@lingui/react/macro';
import { MoreVerticalIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { useCallback } from 'react';
import { useHistoryTimeline } from './history-timeline.js';

export interface HistoryEntryItem {
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
}

interface HistoryEntryProps {
    entry: HistoryEntryItem;
    isNoteEntry: boolean;
    timelineIcon: React.ReactNode;
    title: string | React.ReactNode;
    children: React.ReactNode;
}

export function HistoryEntry({
    entry,
    isNoteEntry,
    timelineIcon,
    title,
    children,
}: HistoryEntryProps) {
    const { formatDate } = useLocalFormat();
    const { editNote, deleteNote } = useHistoryTimeline();


    const formatDateTime = useCallback((date: string) => {
        return formatDate(date, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
        });
    }, [formatDate]);

    return (
        <div key={entry.id} className="relative mb-4 pl-11">
            <div className="absolute left-0 w-10 flex items-center justify-center">
                <div className={`rounded-full flex items-center justify-center h-6 w-6`}>
                    <div
                        className={`rounded-full bg-gray-200 text-muted-foreground flex items-center justify-center h-6 w-6`}
                    >
                        {timelineIcon}
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
                        <div className="font-medium text-sm">{title}</div>
                        {children}
                    </div>

                    {isNoteEntry && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVerticalIcon className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={() => editNote(entry.id, entry.data.note, !entry.isPublic)}
                                    className="cursor-pointer"
                                >
                                    <PencilIcon className="mr-2 h-4 w-4" />
                                    <Trans>Edit</Trans>
                                </DropdownMenuItem>
                                <Separator className="my-1" />
                                <DropdownMenuItem
                                    onClick={() => deleteNote(entry.id)}
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
    );
}
