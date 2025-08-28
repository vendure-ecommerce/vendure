import { api } from '@/vdb/graphql/api.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { orderHistoryDocument, transitionOrderToStateDocument } from '../orders.graphql.js';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/vdb/components/ui/dialog.js';
import { Trans } from '@/vdb/lib/trans.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/vdb/components/ui/select.js';
import { useState } from 'react';
import { Button } from '@/vdb/components/ui/button.js';
import { Alert, AlertDescription } from '@/vdb/components/ui/alert.js';
import { ResultOf } from 'gql.tada';

/**
 * Returns the state the order was in before it entered 'Modifying'.
 * @param orderId The order ID
 */
export function useTransitionOrderToState(orderId: string | undefined) {
  const [selectStateOpen, setSelectStateOpen] = useState(false);
  const [onSuccessFn, setOnSuccessFn] = useState<() => void>(() => {});

  const { data, isLoading, error } = useQuery<string | null>({              // ----> tipizza: string | null (mai undefined)
    queryKey: ['orderPreModifyingState', String(orderId ?? '')],            // ----> chiave stabile: sempre string
    enabled: !!orderId,                                         
    placeholderData: null,                                                  // ----> mai undefined in UI
    retry: false,                                                           // ----> evita loop su 404/permessi
    queryFn: async () => {
      // qui orderId è definito grazie a enabled
      const result = await api.query(orderHistoryDocument, {
        id: orderId!,                                                       // ----> safe grazie a enabled
        options: {
          filter: { type: { eq: 'ORDER_STATE_TRANSITION' } },
          sort: { createdAt: 'DESC' },
          take: 50,
        },
      });

      const items = result.order?.history?.items ?? [];
      const modifyingEntry = items.find((i) => i.data?.to === 'Modifying');
      return (modifyingEntry?.data?.from as string | undefined) ?? null;    // ----> fallback a null (non undefined)
    },
  });

  const transitionOrderToStateMutation = useMutation({
    mutationFn: api.mutate(transitionOrderToStateDocument),
  });

  const transitionToState = async (state: string) => {
    if (orderId) {
      const { transitionOrderToState } =
        await transitionOrderToStateMutation.mutateAsync({
          id: orderId,
          state,
        });
      if (transitionOrderToState?.__typename === 'OrderStateTransitionError') {
        return transitionOrderToState.transitionError;
      }
    }
    return undefined;
  };

  const transitionToPreModifyingState = async () => {
    if (orderId && data != null) {                                           // ----> controlla null/defined, non truthy, perché '' non è previsto ma null sì
      return transitionToState(data);
    } else {
      return 'Could not find the state the order was in before it entered Modifying';
    }
  };

  const ManuallySelectNextState = (props: { availableStates: string[] }) => {
    const manuallyTransition = useMutation({
      mutationFn: api.mutate(transitionOrderToStateDocument),
      onSuccess: (result: ResultOf<typeof transitionOrderToStateDocument>) => {
        if (result.transitionOrderToState?.__typename === 'OrderStateTransitionError') {
          setTransitionError(result.transitionOrderToState.transitionError);
        } else {
          setTransitionError(undefined);
          setSelectStateOpen(false);
          onSuccessFn?.();
        }
      },
      onError: (error) => {
        setTransitionError(error.message);
      },
    });

    const [selectedState, setSelectedState] = useState<string | undefined>(undefined);
    const [transitionError, setTransitionError] = useState<string | undefined>(undefined);
    if (!orderId) return null;

    const onTransitionClick = () => {
      if (!selectedState) return;
      manuallyTransition.mutateAsync({ id: orderId, state: selectedState });
    };

    return (
      <Dialog open={selectStateOpen} onOpenChange={setSelectStateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle><Trans>Select next state</Trans></DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <Trans>Select the next state for the order</Trans>
          </DialogDescription>

          {/* Se usi shadcn React: SelectTrigger/SelectValue ok */}
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger>
              <SelectValue placeholder="Select a state" />
            </SelectTrigger>
            <SelectContent>
              {props.availableStates.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {transitionError && (
            <Alert variant="destructive">
              <AlertDescription>
                <Trans>Error transitioning to state</Trans>: {transitionError}
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button type="button" disabled={!selectedState} onClick={onTransitionClick}>
              <Trans>Transition to selected state</Trans>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return {
    isLoading,
    error,
    preModifyingState: data, // ----> ora è string | null
    transitionToPreModifyingState,
    transitionToState,
    ManuallySelectNextState,
    selectNextState: ({ onSuccess }: { onSuccess?: () => void }) => {
      setSelectStateOpen(true);
      if (onSuccess) setOnSuccessFn(() => onSuccess);
    },
  };
}