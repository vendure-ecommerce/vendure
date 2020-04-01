import { JobState } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class JobRecord {
    constructor(input: DeepPartial<JobRecord>) {
        if (input) {
            for (const [key, value] of Object.entries(input)) {
                (this as any)[key] = value;
            }
        }
    }

    @PrimaryColumn()
    id: string;

    @CreateDateColumn() createdAt: Date;

    @UpdateDateColumn() updatedAt: Date;

    @Column()
    queueName: string;

    @Column('simple-json', { nullable: true })
    data: any;

    @Column('varchar')
    state: JobState;

    @Column()
    progress: number;

    @Column('simple-json', { nullable: true })
    result: any;

    @Column({ nullable: true })
    error: string;

    @Column({ nullable: true })
    started?: Date;

    @Column({ nullable: true })
    settled?: Date;

    @Column()
    isSettled: boolean;

    @Column()
    retries: number;

    @Column()
    attempts: number;
}
