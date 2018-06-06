import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Role } from '../../auth/role';
import { AddressEntity } from '../address/address.entity';
import { User } from './user.interface';

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
