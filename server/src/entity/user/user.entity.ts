import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Role } from '../../auth/role';
import { Address } from '../address/address.entity';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn('uuid') id: string;

    @Column({ unique: true })
    identifier: string;

    @Column() passwordHash: string;

    @Column('simple-array') roles: Role[];

    @Column() lastLogin: string;

    @CreateDateColumn() createdAt: string;

    @UpdateDateColumn() updatedAt: string;
}
