import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import {
    GetOrderHistory,
    HistoryEntryType,
    OrderDetail,
    OrderDetailFragment,
} from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-order-history',
    templateUrl: './order-history.component.html',
    styleUrls: ['./order-history.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderHistoryComponent {
    @Input() order: OrderDetailFragment;
    @Input() history: GetOrderHistory.Items[];
    @Output() addNote = new EventEmitter<{ note: string; isPublic: boolean }>();
    note = '';
    noteIsPrivate = true;
    readonly type = HistoryEntryType;

    getClassForEntry(entry: GetOrderHistory.Items): 'success' | 'error' | 'warning' | undefined {
        if (entry.type === HistoryEntryType.ORDER_PAYMENT_TRANSITION) {
            if (entry.data.to === 'Settled') {
                return 'success';
            } else if (entry.data.to === 'Declined') {
                return 'error';
            }
        }
        if (entry.type === HistoryEntryType.ORDER_CANCELLATION) {
            return 'error';
        }
        if (entry.type === HistoryEntryType.ORDER_REFUND_TRANSITION) {
            return 'warning';
        }
    }

    getTimelineIcon(
        entry: GetOrderHistory.Items,
    ): 'complete' | 'note' | 'fulfillment' | 'payment' | 'cancelled' | undefined {
        if (entry.type === HistoryEntryType.ORDER_STATE_TRANSITION) {
            if (entry.data.to === 'Fulfilled') {
                return 'complete';
            }
            if (entry.data.to === 'Cancelled') {
                return 'cancelled';
            }
        }
        if (entry.type === HistoryEntryType.ORDER_PAYMENT_TRANSITION && entry.data.to === 'Settled') {
            return 'payment';
        }
        if (entry.type === HistoryEntryType.ORDER_NOTE) {
            return 'note';
        }
        if (entry.type === HistoryEntryType.ORDER_FULLFILLMENT) {
            return 'fulfillment';
        }
    }

    getFullfillment(entry: GetOrderHistory.Items): OrderDetail.Fulfillments | undefined {
        if (entry.type === HistoryEntryType.ORDER_FULLFILLMENT && this.order.fulfillments) {
            return this.order.fulfillments.find(f => f.id === entry.data.fulfillmentId);
        }
    }

    getPayment(entry: GetOrderHistory.Items): OrderDetail.Payments | undefined {
        if (entry.type === HistoryEntryType.ORDER_PAYMENT_TRANSITION && this.order.payments) {
            return this.order.payments.find(p => p.id === entry.data.paymentId);
        }
    }

    getCancelledItems(entry: GetOrderHistory.Items): Array<{ name: string; quantity: number }> {
        const itemMap = new Map<string, number>();
        const cancelledItemIds: string[] = entry.data.orderItemIds;
        for (const line of this.order.lines) {
            for (const item of line.items) {
                if (cancelledItemIds.includes(item.id)) {
                    const count = itemMap.get(line.productVariant.name);
                    if (count != null) {
                        itemMap.set(line.productVariant.name, count + 1);
                    } else {
                        itemMap.set(line.productVariant.name, 1);
                    }
                }
            }
        }
        return Array.from(itemMap.entries()).map(([name, quantity]) => ({ name, quantity }));
    }

    getName(entry: GetOrderHistory.Items): string {
        const { administrator } = entry;
        if (administrator) {
            return `${administrator.firstName} ${administrator.lastName}`;
        } else {
            const customer = this.order.customer;
            if (customer) {
                return `${customer.firstName} ${customer.lastName}`;
            }
        }
        return '';
    }

    addNoteToOrder() {
        this.addNote.emit({ note: this.note, isPublic: !this.noteIsPrivate });
        this.note = '';
        this.noteIsPrivate = true;
    }
}
