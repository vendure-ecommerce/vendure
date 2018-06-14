import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { DeepPartial } from '../../common/common-types';
import { User } from '../user/user.entity';

@Entity('administrator')
export class Administrator {
    constructor(input?: DeepPartial<Administrator>) {
        if (input) {
            Object.assign(this, input);
        }
    }

    @PrimaryGeneratedColumn() id: number;

    @Column() firstName: string;

    @Column() lastName: string;

    @Column({ unique: true })
    emailAddress: string;

    @OneToOne(type => User, { eager: true })
    @JoinColumn()
    user: User;

    @CreateDateColumn() createdAt: string;

    @UpdateDateColumn() updatedAt: string;
}
