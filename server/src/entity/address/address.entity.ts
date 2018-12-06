import { Column, Entity, ManyToOne } from 'typeorm';

import { DeepPartial, HasCustomFields } from '../../../../shared/shared-types';
import { VendureEntity } from '../base/base.entity';
import { CustomAddressFields } from '../custom-entity-fields';
import { Customer } from '../customer/customer.entity';

@Entity()
export class Address extends VendureEntity implements HasCustomFields {
    constructor(input?: DeepPartial<Address>) {
        super(input);
    }

    @ManyToOne(type => Customer, customer => customer.addresses)
    customer: Customer;

    @Column() fullName: string;

    @Column({ default: '' })
    company: string;

    @Column() streetLine1: string;

    @Column({ default: '' })
    streetLine2: string;

    @Column() city: string;

    @Column({ default: '' })
    province: string;

    @Column() postalCode: string;

    @Column() country: string;

    @Column({ default: '' })
    phoneNumber: string;

    @Column({ default: false })
    defaultShippingAddress: boolean;

    @Column({ default: false })
    defaultBillingAddress: boolean;

    @Column(type => CustomAddressFields)
    customFields: CustomAddressFields;
}
