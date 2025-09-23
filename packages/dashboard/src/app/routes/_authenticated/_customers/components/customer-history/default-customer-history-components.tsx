import { Badge } from '@/vdb/components/ui/badge.js';
import { Button } from '@/vdb/components/ui/button.js';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/vdb/components/ui/dropdown-menu.js';
import { Separator } from '@/vdb/components/ui/separator.js';
import { HistoryEntry, HistoryEntryProps } from '@/vdb/framework/history-entry/history-entry.js';
import { Trans } from '@/vdb/lib/trans.js';
import { MoreVerticalIcon, PencilIcon, TrashIcon } from 'lucide-react';

interface CustomerNoteComponentProps extends Readonly<HistoryEntryProps> {
    onEditNote?: (noteId: string, note: string, isPrivate: boolean) => void;
    onDeleteNote?: (noteId: string) => void;
}

export function CustomerRegisteredComponent(props: Readonly<HistoryEntryProps>) {
    const { entry } = props;
    const strategy = entry.data?.strategy || 'native';

    return (
        <HistoryEntry {...props}>
            <div className="space-y-1">
                {strategy === 'native' ? (
                    <p className="text-xs text-muted-foreground">
                        <Trans>Using native authentication strategy</Trans>
                    </p>
                ) : (
                    <p className="text-xs text-muted-foreground">
                        <Trans>Using external authentication strategy: {strategy}</Trans>
                    </p>
                )}
            </div>
        </HistoryEntry>
    );
}

export function CustomerVerifiedComponent(props: Readonly<HistoryEntryProps>) {
    const { entry } = props;
    const strategy = entry.data?.strategy || 'native';

    return (
        <HistoryEntry {...props}>
            <div className="space-y-1">
                {strategy === 'native' ? (
                    <p className="text-xs text-muted-foreground">
                        <Trans>Using native authentication strategy</Trans>
                    </p>
                ) : (
                    <p className="text-xs text-muted-foreground">
                        <Trans>Using external authentication strategy: {strategy}</Trans>
                    </p>
                )}
            </div>
        </HistoryEntry>
    );
}

export function CustomerDetailUpdatedComponent(props: Readonly<HistoryEntryProps>) {
    const { entry } = props;
    return (
        <HistoryEntry {...props}>
            <div className="space-y-2">
                {entry.data?.input && (
                    <details className="text-xs">
                        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                            <Trans>View changes</Trans>
                        </summary>
                        <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                            {JSON.stringify(entry.data.input, null, 2)}
                        </pre>
                    </details>
                )}
            </div>
        </HistoryEntry>
    );
}

export function CustomerAddedToGroupComponent(props: Readonly<HistoryEntryProps>) {
    const { entry } = props;
    const groupName = entry.data?.groupName || 'Unknown Group';

    return (
        <HistoryEntry {...props}>
            <p className="text-xs text-muted-foreground">{groupName}</p>
        </HistoryEntry>
    );
}

export function CustomerRemovedFromGroupComponent(props: Readonly<HistoryEntryProps>) {
    const { entry } = props;
    const groupName = entry.data?.groupName || 'Unknown Group';

    return (
        <HistoryEntry {...props}>
            <p className="text-xs text-muted-foreground">{groupName}</p>
        </HistoryEntry>
    );
}

export function CustomerAddressCreatedComponent(props: Readonly<HistoryEntryProps>) {
    const { entry } = props;
    return (
        <HistoryEntry {...props}>
            <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                    <Trans>Address created</Trans>
                </p>
                {entry.data?.address && (
                    <div className="text-xs p-2 bg-muted rounded">{entry.data.address}</div>
                )}
            </div>
        </HistoryEntry>
    );
}

export function CustomerAddressUpdatedComponent(props: Readonly<HistoryEntryProps>) {
    const { entry } = props;
    return (
        <HistoryEntry {...props}>
            <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                    <Trans>Address updated</Trans>
                </p>
                {entry.data?.address && (
                    <div className="text-xs p-2 bg-muted rounded">{entry.data.address}</div>
                )}
                {entry.data?.input && (
                    <details className="text-xs">
                        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                            <Trans>View changes</Trans>
                        </summary>
                        <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                            {JSON.stringify(entry.data.input, null, 2)}
                        </pre>
                    </details>
                )}
            </div>
        </HistoryEntry>
    );
}

export function CustomerAddressDeletedComponent(props: Readonly<HistoryEntryProps>) {
    const { entry } = props;
    return (
        <HistoryEntry {...props}>
            <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                    <Trans>Address deleted</Trans>
                </p>
                {entry.data?.address && (
                    <div className="text-xs p-2 bg-muted rounded">{entry.data.address}</div>
                )}
            </div>
        </HistoryEntry>
    );
}

export function CustomerPasswordUpdatedComponent(props: Readonly<HistoryEntryProps>) {
    return (
        <HistoryEntry {...props}>
            <p className="text-xs text-muted-foreground">
                <Trans>Password updated</Trans>
            </p>
        </HistoryEntry>
    );
}

export function CustomerPasswordResetRequestedComponent(props: Readonly<HistoryEntryProps>) {
    return (
        <HistoryEntry {...props}>
            <p className="text-xs text-muted-foreground">
                <Trans>Password reset requested</Trans>
            </p>
        </HistoryEntry>
    );
}

export function CustomerPasswordResetVerifiedComponent(props: Readonly<HistoryEntryProps>) {
    return (
        <HistoryEntry {...props}>
            <p className="text-xs text-muted-foreground">
                <Trans>Password reset verified</Trans>
            </p>
        </HistoryEntry>
    );
}

export function CustomerEmailUpdateRequestedComponent({ entry }: Readonly<HistoryEntryProps>) {
    const { oldEmailAddress, newEmailAddress } = entry.data || {};

    return (
        <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
                <Trans>Email update requested</Trans>
            </p>
            {(oldEmailAddress || newEmailAddress) && (
                <details className="text-xs">
                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                        <Trans>View details</Trans>
                    </summary>
                    <div className="mt-2 space-y-1">
                        {oldEmailAddress && (
                            <div>
                                <span className="font-medium">
                                    <Trans>Old email:</Trans>
                                </span>{' '}
                                {oldEmailAddress}
                            </div>
                        )}
                        {newEmailAddress && (
                            <div>
                                <span className="font-medium">
                                    <Trans>New email:</Trans>
                                </span>{' '}
                                {newEmailAddress}
                            </div>
                        )}
                    </div>
                </details>
            )}
        </div>
    );
}

export function CustomerEmailUpdateVerifiedComponent({ entry }: Readonly<HistoryEntryProps>) {
    const { oldEmailAddress, newEmailAddress } = entry.data || {};

    return (
        <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
                <Trans>Email update verified</Trans>
            </p>
            {(oldEmailAddress || newEmailAddress) && (
                <details className="text-xs">
                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                        <Trans>View details</Trans>
                    </summary>
                    <div className="mt-2 space-y-1">
                        {oldEmailAddress && (
                            <div>
                                <span className="font-medium">
                                    <Trans>Old email:</Trans>
                                </span>{' '}
                                {oldEmailAddress}
                            </div>
                        )}
                        {newEmailAddress && (
                            <div>
                                <span className="font-medium">
                                    <Trans>New email:</Trans>
                                </span>{' '}
                                {newEmailAddress}
                            </div>
                        )}
                    </div>
                </details>
            )}
        </div>
    );
}

export function CustomerNoteComponent(props: CustomerNoteComponentProps) {
    const { entry, isPrimary, onEditNote, onDeleteNote } = props;
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
