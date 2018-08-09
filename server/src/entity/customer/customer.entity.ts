import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { DeepPartial } from '../../../../shared/shared-types';
import { Address } from '../address/address.entity';
import { VendureEntity } from '../base/base.entity';
import { HasCustomFields } from '../base/has-custom-fields';
import { CustomCustomerFields } from '../custom-entity-fields';
import { User } from '../user/user.entity';

@Entity()
export class Customer extends VendureEntity implements HasCustomFields {
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

    @Column(type => CustomCustomerFields)
    customFields: CustomCustomerFields;
}
