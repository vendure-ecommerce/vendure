import { AdjustmentOperation, AdjustmentType } from 'shared/generated-types';
import { DeepPartial } from 'shared/shared-types';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

import { Adjustment, AdjustmentSource } from '../../common/types/adjustment-source';
import { VendureEntity } from '../base/base.entity';
import { Channel } from '../channel/channel.entity';
import { CustomerGroup } from '../customer-group/customer-group.entity';
import { TaxCategory } from '../tax-category/tax-category.entity';
import { Zone } from '../zone/zone.entity';

@Entity()
export class TaxRate extends VendureEntity implements AdjustmentSource {
    constructor(input?: DeepPartial<TaxRate>) {
        super(input);
    }

    @Column() name: string;

    @Column() enabled: boolean;

    @ManyToOne(type => TaxCategory)
    category: TaxCategory;

    @ManyToOne(type => Zone)
    zone: Zone;

    @ManyToOne(type => CustomerGroup, { nullable: true })
    customerGroup?: CustomerGroup;

    apply(): Adjustment[] {
        return [];
    }

    test(): boolean {
        return false;
    }
}
