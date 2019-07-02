import { HistoryEntryType } from '@vendure/common/lib/generated-types';
import { Column, Entity, ManyToOne, TableInheritance } from 'typeorm';

import { Administrator } from '../administrator/administrator.entity';
import { VendureEntity } from '../base/base.entity';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'discriminator' } })
export abstract class HistoryEntry extends VendureEntity {
    @ManyToOne(type => Administrator)
    administrator?: Administrator;

    @Column({ nullable: false, type: 'varchar' })
    readonly type: HistoryEntryType;

    @Column()
    isPublic: boolean;

    @Column('simple-json')
    data: any;
}
