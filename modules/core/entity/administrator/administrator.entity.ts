import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { Administrator } from "./administrator.interface";
import { UserEntity } from "../user/user.entity";
import { User } from "../user/user.interface";

@Entity('administrator')
export class AdministratorEntity implements Administrator {
    @PrimaryGeneratedColumn() id: number;

    @Column() firstName: string;

    @Column() lastName: string;

    @Column() emailAddress: string;

    @OneToOne(type => UserEntity)
    @JoinColumn()
    user: User;

    @CreateDateColumn() createdAt: string;

    @UpdateDateColumn() updatedAt: string;
}
