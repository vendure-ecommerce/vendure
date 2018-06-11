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
import { Address } from '../address/address.entity';
import { User } from '../user/user.entity';

@Entity('customer')
export class Customer {
    @PrimaryGeneratedColumn() id: number;

    @Column() firstName: string;

    @Column() lastName: string;

    @Column() phoneNumber: string;

    @Column() emailAddress: string;

    @OneToMany(type => Address, address => address.customer)
    addresses: Address[];

    @OneToOne(type => User, { eager: true })
    @JoinColumn()
    user?: User;

    @CreateDateColumn() createdAt: string;

    @UpdateDateColumn() updatedAt: string;
}
