import { Column, Entity, Unique } from 'typeorm';

import { VendureEntity } from '../../entity/base/base.entity';

@Entity()
@Unique(['taskId'])
export class ScheduledTaskRecord extends VendureEntity {
    constructor(input: Partial<ScheduledTaskRecord>) {
        super(input);
    }

    @Column()
    taskId: string;

    @Column({ default: true })
    enabled: boolean;

    @Column({ nullable: true, type: 'datetime', precision: 3 })
    lockedAt: Date | null;

    @Column({ nullable: true, type: 'datetime', precision: 3 })
    lastExecutedAt: Date | null;

    @Column({ type: 'json', nullable: true })
    lastResult: Record<string, any> | string | number | null;
}
