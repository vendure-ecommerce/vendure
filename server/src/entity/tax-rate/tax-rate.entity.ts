import { Adjustment, AdjustmentType } from 'shared/generated-types';
import { DeepPartial } from 'shared/shared-types';
import { Column, Entity, ManyToOne } from 'typeorm';

import { AdjustmentSource } from '../../common/types/adjustment-source';
import { idsAreEqual } from '../../common/utils';
import { getConfig } from '../../config/vendure-config';
import { CustomerGroup } from '../customer-group/customer-group.entity';
import { TaxCategory } from '../tax-category/tax-category.entity';
import { Zone } from '../zone/zone.entity';

@Entity()
export class TaxRate extends AdjustmentSource {
    readonly type = AdjustmentType.TAX;
    private readonly round: (input: number) => number;

    constructor(input?: DeepPartial<TaxRate>) {
        super(input);
        this.round = getConfig().roundingStrategy.round;
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

    /**
     * Returns the tax applicable to the given price.
     */
    getTax(price: number): number {
        return this.round(price * (this.value / 100));
    }

    apply(price: number): Adjustment {
        return {
            type: this.type,
            adjustmentSource: this.getSourceId(),
            description: this.name,
            amount: this.getTax(price),
        };
    }

    test(zone: Zone, taxCategory: TaxCategory): boolean {
        return idsAreEqual(taxCategory.id, this.category.id) && idsAreEqual(zone.id, this.zone.id);
    }
}
