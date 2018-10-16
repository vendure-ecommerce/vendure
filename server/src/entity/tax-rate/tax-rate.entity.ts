import { Adjustment, AdjustmentType } from 'shared/generated-types';
import { DeepPartial } from 'shared/shared-types';
import { Column, Entity, ManyToOne } from 'typeorm';

import { AdjustmentSource } from '../../common/types/adjustment-source';
import { idsAreEqual } from '../../common/utils';
import { CustomerGroup } from '../customer-group/customer-group.entity';
import { TaxCategory } from '../tax-category/tax-category.entity';
import { Zone } from '../zone/zone.entity';

@Entity()
export class TaxRate extends AdjustmentSource {
    readonly type = AdjustmentType.TAX;

    constructor(input?: DeepPartial<TaxRate>) {
        super(input);
    }

    @Column() name: string;

    @Column() enabled: boolean;

    @Column() value: number;

    @ManyToOne(type => TaxCategory)
    category: TaxCategory;

    @ManyToOne(type => Zone)
    zone: Zone;

    @ManyToOne(type => CustomerGroup, { nullable: true })
    customerGroup?: CustomerGroup;

    apply(price: number): Adjustment {
        const tax = Math.round(price * (this.value / 100));
        return {
            type: this.type,
            adjustmentSource: this.getSourceId(),
            description: this.name,
            amount: tax,
        };
    }

    test(zone: Zone, taxCategory: TaxCategory): boolean {
        return idsAreEqual(taxCategory.id, this.category.id) && idsAreEqual(zone.id, this.zone.id);
    }
}
