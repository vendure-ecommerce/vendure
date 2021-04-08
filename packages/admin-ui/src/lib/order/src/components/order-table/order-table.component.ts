import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { AdjustmentType, CustomFieldConfig, OrderDetail } from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-order-table',
    templateUrl: './order-table.component.html',
    styleUrls: ['./order-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderTableComponent implements OnInit {
    @Input() order: OrderDetail.Fragment;
    @Input() orderLineCustomFields: CustomFieldConfig[];
    orderLineCustomFieldsVisible = false;

    get visibleOrderLineCustomFields(): CustomFieldConfig[] {
        return this.orderLineCustomFieldsVisible ? this.orderLineCustomFields : [];
    }

    get showElided(): boolean {
        return !this.orderLineCustomFieldsVisible && 0 < this.orderLineCustomFields.length;
    }

    ngOnInit(): void {
        this.orderLineCustomFieldsVisible = this.orderLineCustomFields.length < 2;
    }

    toggleOrderLineCustomFields() {
        this.orderLineCustomFieldsVisible = !this.orderLineCustomFieldsVisible;
    }

    getLineDiscounts(line: OrderDetail.Lines) {
        return line.discounts.filter(a => a.type === AdjustmentType.PROMOTION);
    }

    getLineCustomFields(line: OrderDetail.Lines): Array<{ config: CustomFieldConfig; value: any }> {
        return this.orderLineCustomFields
            .map(config => {
                const value = (line as any).customFields[config.name];
                return {
                    config,
                    value,
                };
            })
            .filter(field => {
                return this.orderLineCustomFieldsVisible ? true : field.value != null;
            });
    }

    getPromotionLink(promotion: OrderDetail.Discounts): any[] {
        const id = promotion.adjustmentSource.split(':')[1];
        return ['/marketing', 'promotions', id];
    }

    getCouponCodeForAdjustment(
        order: OrderDetail.Fragment,
        promotionAdjustment: OrderDetail.Discounts,
    ): string | undefined {
        const id = promotionAdjustment.adjustmentSource.split(':')[1];
        const promotion = order.promotions.find(p => p.id === id);
        if (promotion) {
            return promotion.couponCode || undefined;
        }
    }
}
