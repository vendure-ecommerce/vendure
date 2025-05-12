import { Alert, AlertDescription } from '@/components/ui/alert.js';
import { Skeleton } from '@/components/ui/skeleton.js';
import { Trans } from '@/lib/trans.js';
import { TriangleAlert } from 'lucide-react';
import { CustomerHistory } from './customer-history.js';
import { useCustomerHistory } from './use-customer-history.js';
import { Button } from '@/components/ui/button.js';

interface CustomerHistoryContainerProps {
    customerId: string;
}

export function CustomerHistoryContainer({ customerId }: CustomerHistoryContainerProps) {
    const {
        historyEntries,
        customer,
        loading,
        error,
        addNote,
        updateNote,
        deleteNote,
        fetchNextPage,
        hasNextPage,
    } = useCustomerHistory({ customerId, pageSize: 10 });

    if (loading && !customer) {
        return (
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">
                    <Trans>Customer history</Trans>
                </h2>
                <div className="space-y-2">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <TriangleAlert className="h-4 w-4" />
                <AlertDescription>
                    <Trans>Error loading customer history: {error.message}</Trans>
                </AlertDescription>
            </Alert>
        );
    }

    if (!customer) {
        return (
            <Alert>
                <AlertDescription>
                    <Trans>Customer not found</Trans>
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <>
            <CustomerHistory
                customer={customer}
                historyEntries={historyEntries ?? []}
                onAddNote={addNote}
                onUpdateNote={updateNote}
                onDeleteNote={deleteNote}
            />
            {hasNextPage && (
                <Button type="button" variant="outline" onClick={() => fetchNextPage()}>
                    <Trans>Load more</Trans>
                </Button>
            )}
        </>
    );
}
