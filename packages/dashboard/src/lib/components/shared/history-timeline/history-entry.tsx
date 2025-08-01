import { Badge } from '@/vdb/components/ui/badge.js';
import { Button } from '@/vdb/components/ui/button.js';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/vdb/components/ui/dropdown-menu.js';
import { Separator } from '@/vdb/components/ui/separator.js';
import { Trans } from '@/vdb/lib/trans.js';
import { cn } from '@/vdb/lib/utils.js';
import { MoreVerticalIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { HistoryEntryDate } from './history-entry-date.js';

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

interface OrderCustomer {
    firstName: string;
    lastName: string;
}

interface HistoryEntryProps {
    entry: HistoryEntryItem;
    isNoteEntry: boolean;
    timelineIcon: React.ReactNode;
    title: string | React.ReactNode;
    children: React.ReactNode;
    isPrimary?: boolean;
    customer?: OrderCustomer | null;
    onEditNote?: (noteId: string, note: string, isPrivate: boolean) => void;
    onDeleteNote?: (noteId: string) => void;
}

export function HistoryEntry({
    entry,
    isNoteEntry,
    timelineIcon,
    title,
    children,
    isPrimary = true,
    customer,
    onEditNote,
    onDeleteNote,
}: Readonly<HistoryEntryProps>) {
    const getIconColor = (type: string) => {
        // Check for success states (payment settled, order delivered)
        if (type === 'ORDER_PAYMENT_TRANSITION' && entry.data.to === 'Settled') {
            return 'bg-success text-success-foreground';
        }
        if (type === 'ORDER_STATE_TRANSITION' && entry.data.to === 'Delivered') {
            return 'bg-success text-success-foreground';
        }
        if (type === 'ORDER_FULFILLMENT_TRANSITION' && entry.data.to === 'Delivered') {
            return 'bg-success text-success-foreground';
        }
        
        // Check for destructive states (cancellations)
        if (type === 'ORDER_CANCELLATION') {
            return 'bg-destructive text-destructive-foreground';
        }
        if (type === 'ORDER_STATE_TRANSITION' && entry.data.to === 'Cancelled') {
            return 'bg-destructive text-destructive-foreground';
        }
        if (type === 'ORDER_PAYMENT_TRANSITION' && (entry.data.to === 'Declined' || entry.data.to === 'Cancelled')) {
            return 'bg-destructive text-destructive-foreground';
        }
        
        // All other entries use neutral colors
        return 'bg-muted text-muted-foreground';
    };

    const getActorName = () => {
        if (entry.administrator) {
            return `${entry.administrator.firstName} ${entry.administrator.lastName}`;
        } else if (customer) {
            return `${customer.firstName} ${customer.lastName}`;
        }
        return '';
    };

    return (
        <div key={entry.id} className="relative group">
            <div
                className={`flex gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors ${!isPrimary ? 'opacity-75' : ''}`}
            >
                <div className={cn(`relative z-10 flex-shrink-0 ${isNoteEntry ? 'ml-2' : ''}`, isPrimary ? '-ml-1' : '')}>
                    <div
                        className={`rounded-full flex items-center justify-center ${isPrimary ? 'h-8 w-8' : 'h-6 w-6'} ${getIconColor(entry.type)} border-2 border-background ${isPrimary ? 'shadow-sm' : 'shadow-none'}`}
                    >
                        <div className={isPrimary ? 'text-current' : 'text-current scale-75'}>
                            {timelineIcon}
                        </div>
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                            <h4
                                className={`text-sm ${isPrimary ? 'font-medium text-foreground' : 'font-normal text-muted-foreground'}`}
                            >
                                {title}
                            </h4>
                            <div className="mt-1">
                                {entry.type === 'ORDER_NOTE' ? (
                                    <div className={`space-y-${isPrimary ? '2' : '1'}`}>
                                        <p className={`${isPrimary ? 'text-sm' : 'text-xs'} text-foreground`}>
                                            {entry.data.note}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant={entry.isPublic ? 'outline' : 'secondary'}
                                                className="text-xs"
                                            >
                                                {entry.isPublic ? 'Public' : 'Private'}
                                            </Badge>
                                            {isPrimary && onEditNote && onDeleteNote && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                                            <MoreVerticalIcon className="h-3 w-3" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                onEditNote(
                                                                    entry.id,
                                                                    entry.data.note,
                                                                    !entry.isPublic,
                                                                );
                                                            }}
                                                            className="cursor-pointer"
                                                        >
                                                            <PencilIcon className="mr-2 h-4 w-4" />
                                                            <Trans>Edit</Trans>
                                                        </DropdownMenuItem>
                                                        <Separator className="my-1" />
                                                        <DropdownMenuItem
                                                            onClick={() => onDeleteNote(entry.id)}
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
                                ) : (
                                    children
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                            <div className="text-right">
                                <HistoryEntryDate
                                    date={entry.createdAt}
                                    className={`text-xs cursor-help ${isPrimary ? 'text-muted-foreground' : 'text-muted-foreground/70'}`}
                                />
                                {getActorName() && (
                                    <div
                                        className={`text-xs ${isPrimary ? 'text-muted-foreground' : 'text-muted-foreground/70'}`}
                                    >
                                        {getActorName()}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
