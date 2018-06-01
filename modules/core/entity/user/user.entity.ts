import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { AddressEntity } from '../address/address.entity';
import { User } from './user.interface';

@Entity('user')
export class UserEntity implements User {
    @PrimaryGeneratedColumn() id: number;

    @Column() firstName: string;

    @Column() lastName: string;

    @Column() phoneNumber: string;

    @Column() emailAddress: string;

    @OneToMany(type => AddressEntity, address => address.user)
    addresses: AddressEntity[];

    @CreateDateColumn() createdAt: string;

    @UpdateDateColumn() updatedAt: string;
}
