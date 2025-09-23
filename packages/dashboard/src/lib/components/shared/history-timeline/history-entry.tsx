import { HistoryEntryProps } from '@/vdb/framework/extension-api/types/index.js';
import { cn } from '@/vdb/lib/utils.js';
import { HistoryEntryDate } from './history-entry-date.js';

export function HistoryEntry({
    entry,
    timelineIcon,
    timelineIconClassName,
    actorName,
    title,
    children,
    isPrimary = true,
}: Readonly<HistoryEntryProps>) {
    return (
        <div key={entry.id} className="relative group">
            <div
                className={`flex gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors ${!isPrimary ? 'opacity-75' : ''}`}
            >
                <div className={cn(`relative z-10 flex-shrink-0`, isPrimary ? '-ml-1' : '')}>
                    <div
                        className={`rounded-full flex items-center justify-center ${isPrimary ? 'h-8 w-8' : 'h-6 w-6'} ${timelineIconClassName ?? ''} border-2 border-background ${isPrimary ? 'shadow-sm' : 'shadow-none'}`}
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
                                {actorName && (
                                    <div
                                        className={`text-xs ${isPrimary ? 'text-muted-foreground' : 'text-muted-foreground/70'}`}
                                    >
                                        {actorName}
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
