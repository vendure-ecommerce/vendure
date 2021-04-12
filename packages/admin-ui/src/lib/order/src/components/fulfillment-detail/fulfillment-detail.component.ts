import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { OrderDetail } from '@vendure/admin-ui/core';
import { isObject } from '@vendure/common/lib/shared-utils';

@Component({
    selector: 'vdr-fulfillment-detail',
    templateUrl: './fulfillment-detail.component.html',
    styleUrls: ['./fulfillment-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FulfillmentDetailComponent implements OnChanges {
    @Input() fulfillmentId: string;
    @Input() order: OrderDetail.Fragment;

    customFields: Array<{ key: string; value: any }> = [];

    ngOnChanges(changes: SimpleChanges) {
        this.customFields = this.getCustomFields();
    }

    get fulfillment(): OrderDetail.Fulfillments | undefined | null {
        return this.order.fulfillments && this.order.fulfillments.find(f => f.id === this.fulfillmentId);
    }

    get items(): Array<{ name: string; quantity: number }> {
        const itemMap = new Map<string, number>();
        const fulfillmentItemIds = this.fulfillment?.orderItems.map(i => i.id);
        for (const line of this.order.lines) {
            for (const item of line.items) {
                if (fulfillmentItemIds?.includes(item.id)) {
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

    getCustomFields(): Array<{ key: string; value: any }> {
        const customFields = (this.fulfillment as any).customFields;
        if (customFields) {
            return Object.entries(customFields)
                .filter(([key]) => key !== '__typename')
                .map(([key, val]) => {
                    const value = Array.isArray(val) || isObject(val) ? val : (val as any).toString();
                    return { key, value };
                });
        } else {
            return [];
        }
    }

    customFieldIsObject(customField: unknown) {
        return Array.isArray(customField) || isObject(customField);
    }
}
