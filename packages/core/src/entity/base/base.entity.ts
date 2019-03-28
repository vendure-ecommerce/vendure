import { DeepPartial, ID } from '@vendure/common/shared-types';
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { primaryKeyType } from '../../config/config-helpers';

const keyType = primaryKeyType();

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

    @PrimaryGeneratedColumn(keyType) id: ID;

    @CreateDateColumn() createdAt: Date;

    @UpdateDateColumn() updatedAt: Date;
}
