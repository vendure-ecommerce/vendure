import {
    Column,
    CreateDateColumn,
    Entity, JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { AddressEntity } from '../address/address.entity';
import { Customer } from "./customer.interface";
import { UserEntity } from "../user/user.entity";
import { User } from "../user/user.interface";

@Entity('customer')
export class CustomerEntity implements Customer {
    @PrimaryGeneratedColumn() id: number;

    @Column() firstName: string;

    @Column() lastName: string;

    @Column() phoneNumber: string;

    @Column() emailAddress: string;

    @OneToMany(type => AddressEntity, address => address.customer)
    addresses: AddressEntity[];

    @OneToOne(type => UserEntity, { eager: true })
    @JoinColumn()
    user?: User;

    @CreateDateColumn() createdAt: string;

    @UpdateDateColumn() updatedAt: string;
}
