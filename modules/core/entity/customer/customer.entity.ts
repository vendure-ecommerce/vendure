import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { DeepPartial } from '../../common/common-types';
import { Address } from '../address/address.entity';
import { User } from '../user/user.entity';

@Entity('customer')
export class Customer {
    constructor(input?: DeepPartial<Customer>) {
        if (input) {
            Object.assign(this, input);
        }
    }

    @PrimaryGeneratedColumn() id: number;

    @Column() firstName: string;

    @Column() lastName: string;

    @Column() phoneNumber: string;

    @Column({ unique: true })
    emailAddress: string;

    @OneToMany(type => Address, address => address.customer)
    addresses: Address[];

    @OneToOne(type => User, { eager: true })
    @JoinColumn()
    user?: User;

    @CreateDateColumn() createdAt: string;

    @UpdateDateColumn() updatedAt: string;
}
