import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne } from 'typeorm';

import { DeepPartial } from '../../../../shared/shared-types';
import { HasCustomFields } from '../../../../shared/shared-types';
import { Address } from '../address/address.entity';
import { VendureEntity } from '../base/base.entity';
import { CustomCustomerFields } from '../custom-entity-fields';
import { CustomerGroup } from '../customer-group/customer-group.entity';
import { Order } from '../order/order.entity';
import { User } from '../user/user.entity';

@Entity()
export class Customer extends VendureEntity implements HasCustomFields {
    constructor(input?: DeepPartial<Customer>) {
        super(input);
    }

    @Column({ nullable: true })
    title: string;

    @Column() firstName: string;

    @Column() lastName: string;

    @Column({ nullable: true })
    phoneNumber: string;

    @Column({ unique: true })
    emailAddress: string;

    @ManyToMany(type => CustomerGroup)
    @JoinTable()
    groups: CustomerGroup[];

    @OneToMany(type => Address, address => address.customer)
    addresses: Address[];

    @OneToMany(type => Order, order => order.customer)
    orders: Order[];

    @OneToOne(type => User, { eager: true })
    @JoinColumn()
    user?: User;

    @Column(type => CustomCustomerFields)
    customFields: CustomCustomerFields;
}
