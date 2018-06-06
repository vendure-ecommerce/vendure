import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CustomerEntity } from '../customer/customer.entity';
import { UserEntity } from '../user/user.entity';
import { Address } from './address.interface';

@Entity('address')
export class AddressEntity implements Address {
    @PrimaryGeneratedColumn() id: number;

    @ManyToOne(type => CustomerEntity, customer => customer.addresses)
    customer: CustomerEntity;

    @Column() fullName: string;

    @Column() company: string;

    @Column() streetLine1: string;

    @Column() streetLine2: string;

    @Column() city: string;

    @Column() province: string;

    @Column() postalCode: string;

    @Column() country: string;

    @Column() phoneNumber: string;

    @Column() defaultShippingAddress: boolean;

    @Column() defaultBillingAddress: boolean;

    @CreateDateColumn() createdAt: string;

    @UpdateDateColumn() updatedAt: string;
}
