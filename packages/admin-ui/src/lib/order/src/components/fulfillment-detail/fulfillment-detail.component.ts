import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CustomFieldConfig, OrderDetail, ServerConfigService } from '@vendure/admin-ui/core';
import { isObject } from '@vendure/common/lib/shared-utils';

@Component({
    selector: 'vdr-fulfillment-detail',
    templateUrl: './fulfillment-detail.component.html',
    styleUrls: ['./fulfillment-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FulfillmentDetailComponent implements OnInit, OnChanges {
    @Input() fulfillmentId: string;
    @Input() order: OrderDetail.Fragment;

    customFieldConfig: CustomFieldConfig[] = [];
    customFieldFormGroup = new FormGroup({});

    constructor(private serverConfigService: ServerConfigService) {}

    ngOnInit() {
        this.customFieldConfig = this.serverConfigService.getCustomFieldsFor('Fulfillment');
    }

    ngOnChanges(changes: SimpleChanges) {
        this.buildCustomFieldsFormGroup();
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

    buildCustomFieldsFormGroup() {
        const customFields = (this.fulfillment as any).customFields;
        for (const fieldDef of this.serverConfigService.getCustomFieldsFor('Fulfillment')) {
            this.customFieldFormGroup.addControl(fieldDef.name, new FormControl(customFields[fieldDef.name]));
        }
    }

    customFieldIsObject(customField: unknown) {
        return Array.isArray(customField) || isObject(customField);
    }
}
