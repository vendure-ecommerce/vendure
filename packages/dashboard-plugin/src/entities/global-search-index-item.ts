import { ID } from '@vendure/common/lib/shared-types';
import { EntityId, VendureEntity } from '@vendure/core';
import { Column, Entity, Index } from 'typeorm';

@Entity()
export class GlobalSearchIndexItem extends VendureEntity {
    constructor(input?: Partial<GlobalSearchIndexItem>) {
        super(input);
    }

    @EntityId()
    entityId: ID;

    @Index()
    @Column()
    entityType: string;

    @Column('text')
    data: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    entityCreatedAt: Date;

    @Column({ nullable: true })
    entityUpdatedAt: Date;
}
