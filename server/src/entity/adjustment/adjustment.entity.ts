import { AdjustmentType } from 'shared/generated-types';
import { Column, Entity, ManyToOne, TableInheritance } from 'typeorm';

import { AdjustmentSource } from '../adjustment-source/adjustment-source.entity';
import { VendureEntity } from '../base/base.entity';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class Adjustment extends VendureEntity {
    @Column('varchar') type: AdjustmentType;

    @Column() amount: number;

    @ManyToOne(type => AdjustmentSource)
    source: AdjustmentSource;
}
