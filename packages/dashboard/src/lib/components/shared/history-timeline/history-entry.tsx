import { cn } from '@/vdb/lib/utils.js';
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
}

export function HistoryEntry({
    entry,
    isNoteEntry,
    timelineIcon,
    title,
    children,
    isPrimary = true,
    customer,
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
                            <div className="mt-1">{children}</div>
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
