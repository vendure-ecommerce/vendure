import { Alert, AlertDescription } from '@/components/ui/alert.js';
import { Skeleton } from '@/components/ui/skeleton.js';
import { TriangleAlert } from 'lucide-react';
import { OrderHistory } from './order-history.js';
import { useOrderHistory } from './use-order-history.js';
import { Trans } from '@/lib/trans.js';
import { Button } from '@/components/ui/button.js';
interface OrderHistoryContainerProps {
  orderId: string;
}

export function OrderHistoryContainer({ orderId }: OrderHistoryContainerProps) {
  const { 
    historyEntries, 
    order, 
    loading, 
    error, 
    addNote, 
    updateNote, 
    deleteNote,
    fetchNextPage,
    hasNextPage,
  } = useOrderHistory({ orderId, pageSize: 10 });

  if (loading && !order) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold"><Trans>Order history</Trans></h2>
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
          <Trans>Error loading order history: {error.message}</Trans>
        </AlertDescription>
      </Alert>
    );
  }

  if (!order) {
    return (
      <Alert>
        <AlertDescription><Trans>Order not found</Trans></AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <OrderHistory
        order={order}
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