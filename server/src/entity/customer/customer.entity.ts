import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { DeepPartial } from '../../common/common-types';
import { Address } from '../address/address.entity';
import { VendureEntity } from '../base/base.entity';
import { User } from '../user/user.entity';

@Entity()
export class Customer extends VendureEntity {
    constructor(input?: DeepPartial<Customer>) {
        super(input);
    }

    @Column() firstName: string;

    @Column() lastName: string;

    @Column() phoneNumber: string;

    @Column({ unique: true })
    emailAddress: string;

    @OneToMany(type => Address, address => address.customer)
    addresses: Address[];

    @OneToOne(type => User, { eager: true })
    @JoinColumn()
    user?: User;
}
