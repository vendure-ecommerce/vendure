import { Field, ID as GID, ObjectType } from '@nestjs/graphql';
import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { PrimaryGeneratedId } from '../entity-id.decorator';

/**
 * @description
 * This is the base class from which all entities inherit. The type of
 * the `id` property is defined by the {@link EntityIdStrategy}.
 *
 * @docsCategory entities
 */
export abstract class VendureEntity {
    protected constructor(input?: DeepPartial<VendureEntity>) {
        if (input) {
            for (const [key, value] of Object.entries(input)) {
                (this as any)[key] = value;
            }
        }
    }

    @Field(() => GID)
    @PrimaryGeneratedId()
    id: ID;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;
}
