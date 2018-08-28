import { DeepPartial, ID } from 'shared/shared-types';
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { getConfig } from '../../config/vendure-config';

const primaryKeyType = getConfig().entityIdStrategy.primaryKeyType as any;

/**
 * This is the base class from which all entities inherit.
 */
export abstract class VendureEntity {
    protected constructor(input?: DeepPartial<VendureEntity>) {
        if (input) {
            for (const [key, value] of Object.entries(input)) {
                this[key] = value;
            }
        }
    }

    @PrimaryGeneratedColumn(primaryKeyType) id: ID;

    @CreateDateColumn() createdAt: Date;

    @UpdateDateColumn() updatedAt: Date;
}
