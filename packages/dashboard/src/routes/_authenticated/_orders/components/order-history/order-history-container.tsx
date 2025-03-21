import React from 'react';
import { OrderHistory } from './order-history.js';
import { useOrderHistory } from './use-order-history.js';
import { Skeleton } from '@/components/ui/skeleton.js';
import { Alert, AlertDescription } from '@/components/ui/alert.js';
import { TriangleAlert } from 'lucide-react';

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
  } = useOrderHistory(orderId);

  if (loading && !order) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Order history</h2>
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
          Error loading order history: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!order) {
    return (
      <Alert>
        <AlertDescription>Order not found</AlertDescription>
      </Alert>
    );
  }

  return (
    <OrderHistory
      order={order}
      historyEntries={historyEntries}
      onAddNote={addNote}
      onUpdateNote={updateNote}
      onDeleteNote={deleteNote}
    />
  );
} 