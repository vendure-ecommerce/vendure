import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { Address } from './address.interface';

@Entity('address')
export class AddressEntity implements Address {
    @PrimaryGeneratedColumn() id: number;

    @ManyToOne(type => UserEntity, user => user.addresses)
    user: UserEntity;

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
