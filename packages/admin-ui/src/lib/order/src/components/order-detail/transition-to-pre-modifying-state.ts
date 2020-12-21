import { DataService, HistoryEntryType, SortOrder } from '@vendure/admin-ui/core';
import { EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export function transitionToPreModifyingState(dataService: DataService, orderId: string) {
    return dataService.order
        .getOrderHistory(orderId, {
            filter: {
                type: {
                    eq: HistoryEntryType.ORDER_STATE_TRANSITION,
                },
            },
            sort: {
                createdAt: SortOrder.DESC,
            },
        })
        .mapSingle(result => result.order)
        .pipe(
            switchMap(result => {
                const item = result?.history.items.find(i => i.data.to === 'Modifying');
                if (item) {
                    const originalState = item.data.from;
                    return dataService.order.transitionToState(orderId, originalState);
                } else {
                    return EMPTY;
                }
            }),
        );
}
