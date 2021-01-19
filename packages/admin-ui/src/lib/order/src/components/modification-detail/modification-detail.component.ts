import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';
import { OrderDetail, OrderDetailFragment } from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-modification-detail',
    templateUrl: './modification-detail.component.html',
    styleUrls: ['./modification-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModificationDetailComponent implements OnChanges {
    @Input() order: OrderDetailFragment;
    @Input() modification: OrderDetail.Modifications;
    private addedItems = new Map<OrderDetail.Lines, number>();
    private removedItems = new Map<OrderDetail.Lines, number>();

    ngOnChanges(): void {
        const { added, removed } = this.getModifiedLines();
        this.addedItems = added;
        this.removedItems = removed;
    }

    getSurcharge(id: string) {
        return this.order.surcharges.find(m => m.id === id);
    }

    getAddedItems() {
        return [...this.addedItems.entries()].map(([line, count]) => {
            return { name: line.productVariant.name, quantity: count };
        });
    }

    getRemovedItems() {
        return [...this.removedItems.entries()].map(([line, count]) => {
            return { name: line.productVariant.name, quantity: count };
        });
    }

    private getModifiedLines() {
        const added = new Map<OrderDetail.Lines, number>();
        const removed = new Map<OrderDetail.Lines, number>();
        for (const _item of this.modification.orderItems || []) {
            const result = this.getOrderLineAndItem(_item.id);
            if (result) {
                const { line, item } = result;
                if (item.cancelled) {
                    const count = removed.get(line) ?? 0;
                    removed.set(line, count + 1);
                } else {
                    const count = added.get(line) ?? 0;
                    added.set(line, count + 1);
                }
            }
        }
        return { added, removed };
    }

    private getOrderLineAndItem(itemId: string) {
        for (const line of this.order.lines) {
            const item = line.items.find(i => i.id === itemId);
            if (item) {
                return { line, item };
            }
        }
    }
}
