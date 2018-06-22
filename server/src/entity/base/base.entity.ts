import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { DeepPartial, ID } from '../../common/common-types';

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

    @PrimaryGeneratedColumn('increment') id: ID;

    @CreateDateColumn() createdAt: string;

    @UpdateDateColumn() updatedAt: string;
}
