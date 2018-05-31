import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Address } from './Address';

@Entity()
export class User {
    @PrimaryGeneratedColumn() id: number;

    @Column() firstName: string;

    @Column() lastName: string;

    @Column() phoneNumber: string;

    @Column() emailAddress: string;

    @OneToMany(type => Address, address => address.user)
    addresses: Address[];

    @CreateDateColumn() createdAt: string;

    @UpdateDateColumn() updatedAt: string;
}
