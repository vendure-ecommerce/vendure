import { HistoryEntry, HistoryEntryProps } from '@/vdb/components/shared/history-timeline/history-entry.js';
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
import { MoreVerticalIcon, PencilIcon, TrashIcon } from 'lucide-react';

export function OrderNoteComponent({
    onEditNote,
    onDeleteNote,
    ...props
}: Readonly<
    HistoryEntryProps & {
        onEditNote: (noteId: string, note: string, isPrivate: boolean) => void;
        onDeleteNote: (noteId: string) => void;
    }
>) {
    const { entry, isPrimary } = props;
    return (
        <HistoryEntry {...props}>
            <div className={isPrimary ? 'space-y-2' : 'space-y-1'}>
                <div className="space-y-1">
                    <p className={`${isPrimary ? 'text-sm' : 'text-xs'} text-foreground`}>
                        {entry.data.note}
                    </p>
                </div>
                {onEditNote && onDeleteNote && (
                    <div className="flex items-center gap-2">
                        <Badge variant={entry.isPublic ? 'outline' : 'secondary'} className="text-xs">
                            {entry.isPublic ? 'Public' : 'Private'}
                        </Badge>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                    <MoreVerticalIcon className="h-3 w-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={() => {
                                        onEditNote(entry.id, entry.data.note, !entry.isPublic);
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
                    </div>
                )}
            </div>
        </HistoryEntry>
    );
}

export function OrderStateTransitionComponent(props: Readonly<HistoryEntryProps>) {
    const { entry } = props;
    if (entry.data.from === 'Created') return null;

    return (
        <HistoryEntry {...props}>
            <p className="text-xs text-muted-foreground">
                <Trans>
                    From {entry.data.from} to {entry.data.to}
                </Trans>
            </p>
        </HistoryEntry>
    );
}

export function OrderPaymentTransitionComponent(props: Readonly<HistoryEntryProps>) {
    const { entry } = props;
    return (
        <HistoryEntry {...props}>
            <p className="text-xs text-muted-foreground">
                <Trans>
                    Payment #{entry.data.paymentId} transitioned to {entry.data.to}
                </Trans>
            </p>
        </HistoryEntry>
    );
}

export function OrderRefundTransitionComponent(props: Readonly<HistoryEntryProps>) {
    const { entry } = props;
    return (
        <HistoryEntry {...props}>
            <p className="text-xs text-muted-foreground">
                <Trans>
                    Refund #{entry.data.refundId} transitioned to {entry.data.to}
                </Trans>
            </p>
        </HistoryEntry>
    );
}

export function OrderFulfillmentTransitionComponent(props: Readonly<HistoryEntryProps>) {
    const { entry } = props;
    return (
        <HistoryEntry {...props}>
            <p className="text-xs text-muted-foreground">
                <Trans>
                    Fulfillment #{entry.data.fulfillmentId} from {entry.data.from} to {entry.data.to}
                </Trans>
            </p>
        </HistoryEntry>
    );
}

export function OrderFulfillmentComponent(props: Readonly<HistoryEntryProps>) {
    const { entry } = props;
    return (
        <HistoryEntry {...props}>
            <p className="text-xs text-muted-foreground">
                <Trans>Fulfillment #{entry.data.fulfillmentId} created</Trans>
            </p>
        </HistoryEntry>
    );
}

export function OrderModifiedComponent(props: Readonly<HistoryEntryProps>) {
    const { entry } = props;
    return (
        <HistoryEntry {...props}>
            <p className="text-xs text-muted-foreground">
                <Trans>Order modification #{entry.data.modificationId}</Trans>
            </p>
        </HistoryEntry>
    );
}

export function OrderCustomerUpdatedComponent(props: Readonly<HistoryEntryProps>) {
    return (
        <HistoryEntry {...props}>
            <p className="text-xs text-muted-foreground">
                <Trans>Customer information updated</Trans>
            </p>
        </HistoryEntry>
    );
}

export function OrderCancellationComponent(props: Readonly<HistoryEntryProps>) {
    return (
        <HistoryEntry {...props}>
            <p className="text-xs text-muted-foreground">
                <Trans>Order cancelled</Trans>
            </p>
        </HistoryEntry>
    );
}
