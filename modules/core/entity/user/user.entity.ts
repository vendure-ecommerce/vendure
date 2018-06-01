import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { AddressEntity } from '../address/address.entity';
import { User } from './user.interface';
import { Role } from "../../auth/roles";

@Entity('user')
export class UserEntity implements User {
    @PrimaryGeneratedColumn() id: number;

    @Column() identifier: string;

    @Column() passwordHash: string;

    @Column('simple-array') roles: Role[];

    @Column() lastLogin: string;

    @CreateDateColumn() createdAt: string;

    @UpdateDateColumn() updatedAt: string;
}
